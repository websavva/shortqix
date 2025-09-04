import { defineNuxtConfig } from 'nuxt/config';
import vue from '@vitejs/plugin-vue';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

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
