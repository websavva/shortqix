import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['configs', 'app', 'shared'].map(
            (path) => `${path}/**/*.test.ts`,
          ),
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['e2e/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
