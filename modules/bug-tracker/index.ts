import {
  defineNuxtModule,
  createResolver,
  addServerHandler,
  addPlugin,
  addImportsDir,
} from '@nuxt/kit';

import type { ModuleOptions } from './types';
import './augmentation.d.ts';

export { type ModuleOptions } from './types';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'bug-tracker',
    configKey: 'bugTracker',
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.bugTracker = options;

    addServerHandler({
      route: '/api/error-logs',
      method: 'post',
      handler: resolve('runtime/nitro-handler.ts'),
    });

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolve('./augmentation.d.ts'),
      });
    });

    addPlugin({
      src: resolve('runtime/plugin.ts'),
    });

    addImportsDir(resolve('runtime/imports'));
  },
});
