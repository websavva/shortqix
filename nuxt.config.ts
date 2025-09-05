import { defineNuxtConfig } from 'nuxt/config';
import vue from '@vitejs/plugin-vue';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  imports: {
    autoImport: false,
  },

  app: {
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
});
