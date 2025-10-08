import {
  defineNuxtModule,
  updateRuntimeConfig,
  createResolver,
  addImportsDir,
  addPlugin,
} from '@nuxt/kit';
import { defu } from 'defu';

import type { ModuleOptions } from './types';
import './augmentation.d.ts';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'logger',
    configKey: 'logger',
  },

  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // extending runtime config
    await updateRuntimeConfig({
      public: {
        logger: {
          logLevel:
            options.logLevel || nuxt.options.logLevel,
        },
      },
    });

    const publicConfigTypesAugmentationSrc = resolve(
      './augmentation.d.ts',
    );
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: publicConfigTypesAugmentationSrc,
      });
    });

    // adding nitro plugin
    nuxt.hook('nitro:config', (nitroConfig) => {
      if (nitroConfig.imports) {
        nitroConfig.imports = defu(nitroConfig.imports, {
          dirs: [resolve('./runtime/nitro/imports')],
        });
      }

      nitroConfig.typescript = defu(
        nitroConfig.typescript || {},
        {
          tsConfig: {
            include: [publicConfigTypesAugmentationSrc],
          },
        },
      );
    });

    // adding nuxt plugin
    addPlugin({
      src: resolve('./runtime/app/plugin.ts'),
    });

    addImportsDir(resolve('./runtime/app/imports'));
  },
});
