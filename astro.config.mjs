// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://kingdomskids.robyrew.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,

  i18n: {
    locales: ['en', 'es', 'ca', 'ro'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
    fallback: {
      es: 'en',
      ca: 'en',
      ro: 'en',
    },
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-GB', es: 'es-ES', ca: 'ca-ES', ro: 'ro-RO' },
      },
    }),
    icon({
      include: {
        lucide: ['*'],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
    },
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  experimental: {
    clientPrerender: true,
  },
});
