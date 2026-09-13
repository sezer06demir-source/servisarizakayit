/**
 * Vercel Routing Middleware (Edge) — site geneli erişim filtresi.
 *
 * Her HTML isteği önce buradan geçer. Amaç:
 *  1. Yalnızca izin verilen ülkelerden (TR, DZ) gelen ziyaretçilere sayfa sunmak.
 *  2. Arama motoru ve sosyal medya botlarını (Google, Bing, Yandex, WhatsApp vb.) ülkeden bağımsız geçirmek.
 *  3. SEO/scraper botlarını (Ahrefs, Semrush, MJ12 vb.) ve saldırı araçlarını engellemek.
 *  4. WordPress/PHP tarama isteklerini (wp-login, .env, xmlrpc) hızlıca reddetmek.
 *  5. SALDIRI MODU (FIGHT_MODE=1): tarayıcı olmayan istemcilere JavaScript doğrulaması uygulamak.
 *
 * Ayarlar Vercel ortam değişkenleriyle yapılır (Project → Settings → Environment Variables):
 *   SECURITY_MODE     = "on" (varsayılan) | "off"  → filtreyi tamamen kapatır (acil durum)
 *   ALLOWED_COUNTRIES = "TR,DZ" (varsayılan)       → ISO 3166-1 alpha-2 kodları, virgülle
 *   FIGHT_MODE        = "0" (varsayılan) | "1"     → JS doğrulaması. Kullanıcı kararıyla 12 Eylül 2026'dan
 *                                                    itibaren üretimde SÜREKLİ AÇIK (Vercel env FIGHT_MODE=1).
 *   FIGHT_MODE_SECRET = rastgele uzun metin        → doğrulama çerezi imzası (FIGHT_MODE için önerilir)
 *   BEHIND_CLOUDFLARE = "0" (varsayılan) | "1"     → İsteğe bağlı. Cloudflare proxy'si bağlanan IP'den
 *                                                    otomatik tespit edilir; 1 yapmak yalnızca zorlar.
 *   BLOCKED_IPS       = "1.2.3.4,5.6.7.8"          → elle engellenecek ek IP'ler (isteğe bağlı)
 *   Kalıcı IP engel listesi: bu dosyadaki BLOCKED_IPS_STATIC dizisi (dış import edge paketleyicide çalışmadı)
 *
 * Değişken değiştirince yeniden deploy gerekmez; Vercel bir sonraki istekte yeni değeri okur
 * (bazı durumlarda "Redeploy" gerekebilir).
 */

export const config = {
  // Statik varlıklar, sitemap, robots ve manifest için çalışmaz; yalnızca sayfa isteklerinde devreye girer.
  matcher: ['/((?!_astro/|images/|videos/|icons/|favicon\\.ico|favicon\\.svg|og-image\\.png|manifest\\.webmanifest|robots\\.txt|sitemap|sw\\.js|\\.well-known/).*)'],
};

/* ----------------------------------------------------------------------------- yardımcılar */

/** Kalıcı IP engel listesi — security/blocked-ips.ts ile aynı içerik; middleware dış dosya import etmez. */
const BLOCKED_IPS_STATIC: readonly string[] = [];

type Env = Record<string, string | undefined>;
const env: Env = ((globalThis as unknown as { process?: { env?: Env } }).process?.env ?? {}) as Env;

function envList(name: string, fallback: string[]): string[] {
  const raw = env[name];
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

const SECURITY_ON = (env.SECURITY_MODE ?? 'on').toLowerCase() !== 'off';
const FIGHT_MODE = env.FIGHT_MODE === '1';
/** Elle zorlama; normalde gerek yok, Cloudflare proxy'si bağlanan IP'den otomatik tespit edilir. */
const BEHIND_CLOUDFLARE_ENV = env.BEHIND_CLOUDFLARE === '1';

/** Cloudflare'in yayınladığı çıkış aralıkları (https://www.cloudflare.com/ips). Yalnızca bu IP'lerden gelen
 *  isteklerde cf-ipcountry / cf-connecting-ip başlıklarına güvenilir; böylece başlık sahteciliği engellenir. */
const CLOUDFLARE_IPV4: Array<[number, number]> = [
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '108.162.192.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '198.41.128.0/17',
  '162.158.0.0/15',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '172.64.0.0/13',
  '131.0.72.0/22',
].map((cidr) => {
  const [ip, bits] = cidr.split('/');
  const mask = bits === '0' ? 0 : (~0 << (32 - Number(bits))) >>> 0;
  return [(ipv4ToInt(ip) & mask) >>> 0, mask] as [number, number];
});
/** IPv6 önekleri: [ilk hextet, ikinci hextet alt sınır, ikinci hextet üst sınır] */
const CLOUDFLARE_IPV6: Array<[string, number, number]> = [
  ['2400', 0xcb00, 0xcb00],
  ['2606', 0x4700, 0x4700],
  ['2803', 0xf800, 0xf800],
  ['2405', 0xb500, 0xb500],
  ['2405', 0x8100, 0x8100],
  ['2a06', 0x98c0, 0x98c7],
  ['2c0f', 0xf248, 0xf248],
];

function ipv4ToInt(ip: string): number {
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return -1;
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}

function isCloudflareIp(ip: string): boolean {
  if (!ip) return false;
  if (ip.includes(':')) {
    const [h1 = '', h2 = ''] = ip.toLowerCase().split(':');
    const n2 = parseInt(h2 || '0', 16);
    return CLOUDFLARE_IPV6.some(([a, lo, hi]) => h1 === a && n2 >= lo && n2 <= hi);
  }
  const n = ipv4ToInt(ip);
  if (n < 0) return false;
  return CLOUDFLARE_IPV4.some(([net, mask]) => (n & mask) >>> 0 === net);
}

/** İstek Cloudflare proxy'sinden mi geliyor? Bağlanan IP Cloudflare aralığındaysa evet. */
function viaCloudflare(req: Request): boolean {
  if (BEHIND_CLOUDFLARE_ENV) return true;
  if (!req.headers.get('cf-ray')) return false;
  const peer = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ?? '';
  return isCloudflareIp(peer);
}
const ALLOWED_COUNTRIES = new Set(envList('ALLOWED_COUNTRIES', ['TR']));
/** Kalıcı liste (security/blocked-ips.ts) + ortam değişkeniyle eklenenler. */
const BLOCKED_IPS = new Set([...BLOCKED_IPS_STATIC, ...envList('BLOCKED_IPS', [])].map((s) => s.toLowerCase()));
const FIGHT_SECRET = env.FIGHT_MODE_SECRET ?? 'demir-elektrik-varsayilan-anahtar';

/** Ülkeden bağımsız geçmesine izin verilen "iyi" botlar (User-Agent parçaları, küçük harf). */
const GOOD_BOTS = [
  // Google
  'googlebot',
  'google-inspectiontool',
  'adsbot-google',
  'mediapartners-google',
  'apis-google',
  'feedfetcher-google',
  'google-read-aloud',
  'google-site-verification',
  'googleother',
  'storebot-google',
  'google-extended',
  'chrome-lighthouse',
  'google page speed',
  'lighthouse',
  // Bing / Microsoft
  'bingbot',
  'adidxbot',
  'bingpreview',
  'msnbot',
  // Diğer arama motorları
  'yandexbot',
  'yandeximages',
  'yandexmobilebot',
  'duckduckbot',
  'duckduckgo',
  'applebot',
  'baiduspider',
  'seznambot',
  'qwantify',
  // Sosyal medya link önizlemeleri
  'whatsapp',
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'linkedinbot',
  'telegrambot',
  'pinterestbot',
  'slackbot',
  'discordbot',
  'skypeuripreview',
  // İzleme / uptime
  'uptimerobot',
  'vercel',
];

/** Engellenecek scraper, SEO aracı ve saldırı istemcileri (User-Agent parçaları, küçük harf). */
const BAD_BOTS = [
  'ahrefsbot',
  'ahrefssiteaudit',
  'semrushbot',
  'siteauditbot',
  'mj12bot',
  'dotbot',
  'blexbot',
  'dataforseobot',
  'serpstatbot',
  'seokicks',
  'seznam-screenshot',
  'megaindex',
  'linkdexbot',
  'spbot',
  'rogerbot',
  'sistrix',
  'barkrowler',
  'petalbot',
  'bytespider',
  'ccbot',
  'gptbot',
  'claudebot',
  'anthropic-ai',
  'omgili',
  'zoominfobot',
  'screaming frog',
  'netcraft',
  'masscan',
  'zgrab',
  'nikto',
  'sqlmap',
  'nmap',
  'wpscan',
  'python-requests',
  'python-urllib',
  'go-http-client',
  'java/',
  'libwww-perl',
  'httpclient',
  'okhttp',
  'scrapy',
  'httrack',
  'wget',
  'curl/',
];

/** WordPress / PHP tarayıcılarının denediği yollar — sitede böyle bir şey yok. */
const PROBE_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/wp-content',
  '/wp-includes',
  '/wp-json',
  '/xmlrpc.php',
  '/.env',
  '/.git',
  '/.htaccess',
  '/.htpasswd',
  '/.aws',
  '/.ssh',
  '/.vscode',
  '/.idea',
  '/phpmyadmin',
  '/phpinfo',
  '/cgi-bin',
  '/vendor/',
  '/administrator',
  '/config.php',
  '/wp-config',
  '/backup',
  '/shell',
  '/admin.php',
];

function deny(status: number, text: string): Response {
  return new Response(text, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}

function getCountry(req: Request, cf: boolean): string | undefined {
  if (cf) {
    const c = req.headers.get('cf-ipcountry');
    if (c && c !== 'XX' && c !== 'T1') return c.toUpperCase();
  }
  const v = req.headers.get('x-vercel-ip-country');
  return v ? v.toUpperCase() : undefined;
}

function getIp(req: Request, cf: boolean): string {
  return (
    (cf ? req.headers.get('cf-connecting-ip') : null) ??
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    ''
  ).toLowerCase();
}

/** Günlük değişen, gizli anahtarla türetilmiş doğrulama çerezi değeri. */
async function challengeToken(): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${FIGHT_SECRET}|${day}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hasCookie(req: Request, name: string, value: string): boolean {
  const cookie = req.headers.get('cookie') ?? '';
  return cookie.split(';').some((part) => {
    const [k, v] = part.trim().split('=');
    return k === name && v === value;
  });
}

/** Tarayıcıda çalışan küçük bir JS doğrulaması: çerezi yazar ve sayfayı yeniler. Basit botlar geçemez. */
function challengePage(token: string): Response {
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Güvenlik kontrolü · Demir Elektrik</title>
<style>body{font-family:system-ui,sans-serif;background:#0b1220;color:#e5e7eb;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:1rem}
.box{max-width:420px}.spin{width:40px;height:40px;border:4px solid #334155;border-top-color:#ffc107;border-radius:50%;margin:0 auto 1rem;animation:s 1s linear infinite}@keyframes s{to{transform:rotate(360deg)}}
noscript p{color:#fca5a5}</style></head>
<body><div class="box"><div class="spin"></div><h1 style="font-size:1.2rem">Güvenlik kontrolü yapılıyor</h1>
<p>Demir Elektrik web sitesi birkaç saniye içinde açılacak.</p>
<noscript><p>Bu kontrol için tarayıcınızda JavaScript açık olmalıdır.</p></noscript></div>
<script>(function(){var d=new Date();d.setTime(d.getTime()+12*60*60*1000);
document.cookie="de_chk=${token}; expires="+d.toUTCString()+"; path=/; SameSite=Lax; Secure";
var ok=document.cookie.indexOf("de_chk=")!==-1;
setTimeout(function(){
  if(ok){location.reload();return;}
  // Çerez yazılamadı (tarayıcı engelliyor): döngüye girmemek için tek seferlik geçiş işaretiyle devam et.
  var u=new URL(location.href);u.searchParams.set("__chk","1");location.replace(u.toString());
},350);})();</script></body></html>`;
  return new Response(html, {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'retry-after': '2',
      'x-robots-tag': 'noindex',
    },
  });
}

/* ----------------------------------------------------------------------------- ana akış */

export default async function middleware(req: Request): Promise<Response | undefined> {
  if (!SECURITY_ON) return undefined;

  const url = new URL(req.url);
  const path = url.pathname.toLowerCase();
  const ua = (req.headers.get('user-agent') ?? '').toLowerCase();
  const cf = viaCloudflare(req);
  const ip = getIp(req, cf);

  // 1) Yalnızca okuma metotları; site statik, POST/PUT vb. beklenmiyor.
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    return deny(405, 'Method not allowed');
  }

  // 2) Elle engellenen IP'ler.
  if (ip && BLOCKED_IPS.has(ip)) {
    return deny(403, 'Erişim engellendi.');
  }

  // 3) WordPress/PHP tarama yolları — böyle bir sayfa yok, tarayıcıya zaman kaybettirme.
  if (PROBE_PATHS.some((p) => path.startsWith(p)) || path.endsWith('.php') || path.endsWith('.asp') || path.endsWith('.aspx')) {
    return deny(404, 'Not found');
  }

  // 4) İyi botlar ülkeden bağımsız geçer (Googlebot ABD'den tarar).
  const isGoodBot = GOOD_BOTS.some((b) => ua.includes(b));
  if (isGoodBot) return undefined;

  // 5) Scraper / SEO araçları / saldırı istemcileri.
  if (!ua || BAD_BOTS.some((b) => ua.includes(b))) {
    return deny(403, 'Erişim engellendi.');
  }

  // 6) Ülke filtresi. Ülke bilgisi yoksa (yerel geliştirme) geçir.
  const country = getCountry(req, cf);
  if (country && !ALLOWED_COUNTRIES.has(country)) {
    return deny(403, 'Bu site yalnızca hizmet verdiğimiz bölgelerden erişime açıktır.');
  }

  // 6b) /api/ip — sayfanın üstündeki ziyaretçi bilgi çubuğu için IP ve ülke (yalnızca isteği yapan kişiye).
  if (path === '/api/ip') {
    const names: Record<string, string> = { TR: 'Türkiye', DZ: 'Cezayir' };
    const body = JSON.stringify({ ip: ip || null, country: country ?? null, countryName: country ? (names[country] ?? country) : null });
    return new Response(body, {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store, private', 'x-robots-tag': 'noindex' },
    });
  }

  // 7) Saldırı modu: JS doğrulama çerezi olmayan istemciye meydan okuma sayfası.
  //    Çerezi yazamayan tarayıcılar (çerez kapalı) JS'in eklediği __chk=1 işaretiyle döngüye girmeden geçer.
  if (FIGHT_MODE && req.method === 'GET') {
    const token = await challengeToken();
    if (!hasCookie(req, 'de_chk', token) && url.searchParams.get('__chk') !== '1') {
      return challengePage(token);
    }
  }

  return undefined;
}
