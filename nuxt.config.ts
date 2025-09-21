import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';
import vue from '@vitejs/plugin-vue';

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
  ],

  fonts: {
    families: [
      {
        name: 'Inter',
        global: true,
        preload: true,
        weights: [400, 500, 600, 700],
        provider: 'google',
      },
    ],
  },

  // imports: {
  //   autoImport: true,
  // },

  vite: {
    define: {
      'process.env.BASE_URL': JSON.stringify(
        process.env.BASE_URL,
      ),
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  alias: {
    '#server': resolve('./server'),
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
      appear: true,
    },

    head: {
      title: 'Link Shortener',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
    },
  },

  nitro: {
    imports: {
      autoImport: false,
    },

    rollupConfig: {
      plugins: [vue()],
    },

    experimental: {
      websocket: true,
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
    },
  },

  vue: {
    compilerOptions: {
      comments: false,
    },
  },
});
