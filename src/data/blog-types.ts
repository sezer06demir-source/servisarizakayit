export interface BlogPost {
  slug: string;
  title: string;
  /** Liste ve meta için tek cümle özet */
  excerpt: string;
  /** İlgili cihaz slug'ı (site.ts devices) */
  device: string;
  /** Okuma süresi, dakika */
  readMinutes: number;
  /** YYYY-MM-DD */
  date: string;
  /** Gövde: markdown benzeri basit yapı — her öğe bir paragraf ya da başlık/madde bloğu */
  body: BlogBlock[];
  seoTitle: string;
  seoDescription: string;
  /** Anahtar kelimeler (meta keywords + doğal kullanım kontrolü) */
  keywords: string[];
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string };
