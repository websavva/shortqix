import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';
import vue from '@vitejs/plugin-vue';

import { publicDefine, privateDefine } from './configs/env';
import { staticSeoMeta } from './configs/seo-meta';

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts'],

  buildDir: '.nuxt',

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
    define: publicDefine,
  },

  alias: {
    '#server': resolve('./server'),
  },

  hooks: {
    'prepare:types'({ tsConfig }) {
      if (!tsConfig.include) tsConfig.include = [];

      tsConfig.include.push('configs/**/*.ts');
    },
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
      appear: true,
    },

    head: staticSeoMeta,
  },

  nitro: {
    imports: {
      autoImport: false,
    },

    esbuild: {
      options: {
        define: {
          ...privateDefine,
          ...publicDefine,
        },
      },
    },

    rollupConfig: {
      // @ts-expect-error rollup types are not updated
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
