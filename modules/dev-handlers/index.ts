import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

import type { NitroEventHandler } from 'nitropack';
import {
  defineNuxtModule,
  addServerHandler,
  createResolver,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'email-preview',
  },

  async setup(_, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (process.env.SQQ_STAGE !== 'production') {
      const handlersDir = resolver.resolve(
        'runtime/handlers',
      );

      const handlerFilenames = await readdir(handlersDir);
      for (const handlerFilename of handlerFilenames) {
        const [name, method] = handlerFilename.split('.');

        addServerHandler({
          method: method as NitroEventHandler['method'],
          route: `/api/dev/${name}`,
          handler: join(handlersDir, handlerFilename),
        });
      }
    }
  },
});
