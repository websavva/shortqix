import { rmdir } from 'node:fs/promises';

import { createTest } from '@nuxt/test-utils';

import { port, rootDir, buildDir } from '../utils';

export default async function start() {
  const {
    ctx,

    ...hooks
  } = await createTest({
    rootDir,
    build: true,
    fixture: 'common',
    buildDir,
    port,
    dev: false,
    server: true,
  });

  await hooks.beforeAll();

  return async () => {
    await hooks.afterAll();

    await rmdir(buildDir, { recursive: true }).catch(
      (err) => {
        console.error(err);
      },
    );
  };
}
