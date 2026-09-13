// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/data/site-url.mjs';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/' || path === '') item.priority = 1.0;
        else if (path.startsWith('/kvkk') || path.startsWith('/gizlilik')) {
          item.priority = 0.2;
          item.changefreq = /** @type {any} */ ('yearly');
        }
        return item;
      },
    }),
  ],
});
