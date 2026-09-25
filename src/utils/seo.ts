import { site } from '@data/site';

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = site.url.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `${base}/` : `${base}${clean}`;
}

/** build.format 'file' pathname'i `.html` ile verir; cleanUrls bunu temiz adrese yönlendirdiği için canonical'dan atılır. */
export function canonicalUrl(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/+$/, '') || '/';
  return absoluteUrl(p);
}

export function buildTitle(title: string, withBrand = true): string {
  if (!withBrand) return title;
  return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

/** LocalBusiness / bağımsız teknik servis şeması. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${absoluteUrl('/')}#business`,
    name: site.name,
    url: absoluteUrl('/'),
    telephone: site.phone.e164,
    image: absoluteUrl('/og-image.png'),
    logo: absoluteUrl('/icons/icon-512.png'),
    description: site.description,
    priceRange: '₺₺',
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    knowsLanguage: 'tr',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    sameAs: [`https://wa.me/${site.whatsapp.number}`],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phone.e164,
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: 'Turkish',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl('/')}#website`,
    name: site.name,
    url: absoluteUrl('/'),
    inLanguage: 'tr-TR',
    publisher: { '@id': `${absoluteUrl('/')}#business` },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.name,
    provider: { '@id': `${absoluteUrl('/')}#business` },
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    availableChannel: {
      '@type': 'ServiceChannel',
      servicePhone: { '@type': 'ContactPoint', telephone: site.phone.e164 },
    },
  };
}

/** Yıldızlı yorumlar için aggregateRating + review şeması. */
export function reviewSchema(reviews: { name: string; stars: number; text: string }[]) {
  const avg = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${absoluteUrl('/')}#business`,
    name: site.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 8).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.stars, bestRating: 5 },
      reviewBody: r.text,
    })),
  };
}

export function articleSchema(opts: { title: string; description: string; path: string; date: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    datePublished: opts.date,
    dateModified: opts.date,
    inLanguage: 'tr-TR',
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@id': `${absoluteUrl('/')}#business` },
    mainEntityOfPage: absoluteUrl(opts.path),
  };
}
