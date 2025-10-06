import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineNuxtConfig } from 'nuxt/config';
import { createResolver } from '@nuxt/kit';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { publicDefine } from './configs/env';
import { staticSeoMeta } from './configs/seo-meta';

const { resolve } = createResolver(import.meta.url);

const drizzleKitBinPath = join(
  dirname(
    fileURLToPath(import.meta.resolve('drizzle-kit')),
  ),
  'bin.cjs',
);

const isProdBuild = process.env.SQQ_STAGE === 'production';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/fonts',
    '@pinia/nuxt',

    ...(!isProdBuild
      ? ['@nuxt/eslint', '@nuxt/test-utils/module']
      : []),
  ],

  experimental: {
    entryImportMap: false,
  },

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

  ym: {
    id: process.env.SQX_YM_ID,
    enabled: process.env.SQX_STAGE === 'production',
  },

  vite: {
    define: publicDefine,
    build: {
      target: 'safari13',
    },
  },

  alias: {
    '#server': resolve('./server'),
  },

  hooks: {
    'prepare:types'({ tsConfig }) {
      if (!tsConfig.include) tsConfig.include = [];

      tsConfig.include.push(
        'configs/**/*.ts',
        'vitest.config.ts',
        'modules/**/*.ts',
      );
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

    externals: {
      traceInclude: [drizzleKitBinPath],
    },

    esbuild: {
      options: {
        define: publicDefine,
      },
    },

    rollupConfig: {
      plugins: [
        vueJsx({
          include: /\.tsx$/,
        }),
      ],
    },

    experimental: {
      websocket: true,
    },
  },

  vue: {
    compilerOptions: {
      comments: false,
    },
  },
});
