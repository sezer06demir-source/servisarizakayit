/**
 * Build öncesi görsel üretimi: favicon (SVG + ICO), PWA ikonları, Open Graph görseli.
 * Marka işareti: teal yuvarlak rozet içinde beyaz onay (tik). Logo ile uyumlu.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = resolve(root, 'public');
const TEAL = '#0EA5A0';
const INK = '#131A1F';

const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="11" fill="${TEAL}"/>
  <path d="M12 21.5l4.2 4.2L28 14" stroke="#fff" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const maskable = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 40 40">
  <rect width="40" height="40" fill="${TEAL}"/>
  <path d="M12 21.5l4.2 4.2L28 14" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="0" y="0" width="1200" height="12" fill="${TEAL}"/>
  <g transform="translate(80,84)">
    <rect width="96" height="96" rx="26" fill="${TEAL}"/>
    <path d="M28 52l10 10L66 34" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="200" y="122" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800" fill="${INK}">Servis Arıza Kayıt</text>
  <text x="200" y="164" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#5B6B75">Beyaz Eşya &amp; İklimlendirme Teknik Servisi</text>
  <text x="80" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="66" font-weight="800" fill="${INK}">Arızayı kaydedin,</text>
  <text x="80" y="398" font-family="Segoe UI, Arial, sans-serif" font-size="66" font-weight="800" fill="${TEAL}">biz sizi arayalım.</text>
  <text x="80" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="#5B6B75">Türkiye geneli servis ağı · Marka bağımsız · Her gün 08:00–22:00</text>
  <rect x="80" y="510" width="360" height="66" rx="33" fill="#FF7A1A"/>
  <text x="112" y="552" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="800" fill="#fff">0542 403 36 22</text>
</svg>`;

/** PNG'yi geçerli bir ICO kabına sarar (6B başlık + 16B dizin + PNG verisi). */
function icoFromPng(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, pngBuf]);
}

await mkdir(resolve(pub, 'icons'), { recursive: true });
const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

await writeFile(resolve(pub, 'favicon.svg'), mark(40).trimStart());
await writeFile(resolve(pub, 'favicon.ico'), icoFromPng(await png(mark(40), 32), 32));
await writeFile(resolve(pub, 'icons/icon-192.png'), await png(mark(40), 192));
await writeFile(resolve(pub, 'icons/icon-512.png'), await png(mark(40), 512));
await writeFile(resolve(pub, 'icons/apple-touch-icon.png'), await png(mark(40), 180));
await writeFile(resolve(pub, 'icons/icon-512-maskable.png'), await png(maskable, 512));
await writeFile(resolve(pub, 'og-image.png'), await sharp(Buffer.from(og)).png().toBuffer());
console.log('[images] favicon, ikonlar ve og-image üretildi');
