import { defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';

import { RemoveTestAttributePlugin } from './plugin';

export interface ModuleOptions {
  enabled?: boolean;
}

export default defineNuxtModule({
  meta: {
    name: 'test-attribute-removal',
    configKey: 'testAttributeRemoval',
  },

  setup(options, nuxt) {
    if (!options.enabled) return;

    // @ts-expect-error - wrong type of @vue/compiler-core
    nuxt.options.vite.vue = defu(
      nuxt.options.vite.vue || {},
      {
        template: {
          compilerOptions: {
            nodeTransforms: [RemoveTestAttributePlugin],
          },
        },
      },
    );
  },
});
