import {
  defineNuxtModule,
  addComponent,
  createResolver,
  addPlugin,
} from '@nuxt/kit';
import type { ComponentsDir } from '@nuxt/schema';

export default defineNuxtModule({
  meta: {
    name: 'custom-components',
  },
  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addPlugin(resolve('runtime/plugins/ssr-width.ts'));

    const componentsDir = resolve(
      nuxt.options.srcDir,
      'components',
    );

    const scanComponentsDirs: ComponentsDir[] = [
      {
        path: componentsDir,
        extensions: ['.vue'],
        pathPrefix: false,
        priority: 999,
      },
    ];

    addComponent({
      filePath: 'vee-validate',
      export: 'Form',
      name: 'Form',
      priority: 999,
    });

    addComponent({
      filePath: 'vee-validate',
      export: 'Field',
      name: 'FormField',
      priority: 999,
    });

    nuxt.hook('components:dirs', (dirs) => {
      let localDirIndex: number;

      while (
        ~(localDirIndex = dirs.findIndex((dir) => {
          if (typeof dir === 'object') dir = dir.path;

          return dir.startsWith(componentsDir);
        }))
      ) {
        dirs.splice(localDirIndex, 1);
      }

      for (const componentsDir of scanComponentsDirs) {
        dirs.push(componentsDir);
      }
    });
  },
});
