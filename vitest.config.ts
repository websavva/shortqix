import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'configs',
            'shared',
            'server/utils',
          ].map((path) => `${path}/**/*.test.ts`),
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['app/**/*.test.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
});
