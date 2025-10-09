import { createResolver } from '@nuxt/kit';
import {
  setup as _setup,
  createTestContext,
  type TestOptions,
  loadFixture,
  buildFixture,
  setTestContext,
  startServer,
  stopServer,
} from '@nuxt/test-utils';

const { resolve } = createResolver(import.meta.url);

export const rootDir = resolve('../..');

export const buildDir = resolve(
  rootDir,
  '.nuxt',
  'test',
  'common',
);

export const host = process.env.SQX_BASE_URL!;

export const port =
  +(process.env.PORT || '') ||
  +new URL(process.env.SQX_BASE_URL!).port ||
  undefined;

export const baseTestOptions: Partial<TestOptions> = {
  fixture: 'common',
  buildDir,
  rootDir,
  dev: false,
};

export async function build() {
  const ctx = createTestContext({
    ...baseTestOptions,
    build: true,
    server: false,
    browser: false,
    nuxtConfig: {
      logLevel: 'silent',
      // @ts-expect-error missing logger module type
      logger: {
        logLevel: 'silent',
      },
    },
  });

  setTestContext(ctx);

  await loadFixture();

  await buildFixture();

  setTestContext(undefined);
}

export async function start() {
  const ctx = createTestContext({
    ...baseTestOptions,
    build: false,
    server: true,
    browser: false,
    port,
  });

  setTestContext(ctx);

  await loadFixture();

  await startServer();

  const { serverProcess } = ctx;

  return () => serverProcess?.kill();
}

export function setup() {
  return _setup({
    ...baseTestOptions,
    build: false,
    server: false,
    host,
    browser: true,
    browserOptions: {
      type: 'chromium',
    },
  });
}
