import { createResolver } from '@nuxt/kit';
import { setup as _setup } from '@nuxt/test-utils';

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
  +new URL(process.env.SQX_BASE_URL!).port || undefined;

export function setup() {
  return _setup({
    fixture: 'common',
    rootDir,
    build: false,
    buildDir,
    dev: false,
    server: false,
    host,
    browser: true,
  });
}
