import { createTest } from '@nuxt/test-utils';
import { rm } from 'fs-extra';

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

    await rm(buildDir, { force: true, recursive: true });
  };
}
