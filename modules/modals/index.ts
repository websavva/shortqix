import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  addImportsDir,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'modals',
  },

  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addComponentsDir({
      path: resolve('./runtime/components'),
    });

    addImportsDir(resolve('./runtime/imports'));

    addPlugin(resolve('./runtime/plugin.ts'));
  },
});
