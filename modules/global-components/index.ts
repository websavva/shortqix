import { defineNuxtModule } from '@nuxt/kit';

const GLOBAL_COMPONENT_NAMES = ['NuxtLink'];

export default defineNuxtModule({
  meta: {
    name: 'global-components',
  },

  setup(_, nuxt) {
    nuxt.hook('components:extend', (components) => {
      for (const componentOptions of components) {
        if (
          GLOBAL_COMPONENT_NAMES.includes(
            componentOptions.pascalName,
          )
        ) {
          componentOptions.global = true;
        }
      }
    });
  },
});
