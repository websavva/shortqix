import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(async () => {
  const { publicDefine, privateDefine } = await import(
    './configs/env'
  );

  return {
    test: {
      projects: [
        // pure unit tests
        {
          test: {
            name: 'pure-unit',
            include: [
              'configs',
              'shared',
              'server/utils',
            ].map((path) => `${path}/**/*.test.ts`),
            environment: 'node',
          },
        },

        // nuxt-dependent unit tests
        await defineVitestProject({
          test: {
            name: 'nuxt-unit',
            include: ['app/**/*.test.ts'],
            environment: 'nuxt',
          },
        }),

        // e2e tests
        {
          define: {
            ...privateDefine,
            ...publicDefine,
          },

          test: {
            name: 'e2e',
            include: ['e2e/**/*.test.ts'],

            globalSetup: [
              'e2e/setup/global/start.ts',
              'e2e/setup/global/check.ts',
            ],

            setupFiles: ['e2e/setup/clear-database.ts'],

            environment: 'node',

            testTimeout: 10e3,

            threads: false,

            retry: 2,
          },
        },
      ],
    },
  };
});
