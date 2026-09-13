export interface DeviceDetail {
  /** site.ts devices ile eşleşen slug */
  slug: string;
  /** 2-3 özgün giriş paragrafı */
  intro: string[];
  /** Belirti → olası neden eşleştirmeleri (4-6 adet) */
  causes: { symptom: string; cause: string }[];
  /** Servisi çağırmadan önce yapılabilecek güvenli kontroller (3-4 adet) */
  tips: string[];
  /** Bu cihaza özel kısa süreç notu (1-2 cümle) */
  process: string;
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}
