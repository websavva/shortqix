import {
  defineNuxtModule,
  addComponent,
  addComponentsDir,
  tryResolveModule,
  createResolver,
  addPlugin,
} from '@nuxt/kit';

export interface ShadcnVueOptions {
  /**
   * Prefix for all the imported component
   */
  prefix: string;

  /**
   * Directory that the component lives in.
   * @default "~/components/ui"
   */
  componentDir: string;
}

export default defineNuxtModule<ShadcnVueOptions>({
  defaults: {
    prefix: 'Ui',
    componentDir: '~/components/ui',
  },
  meta: {
    name: 'ShadcnVue',
    configKey: 'shadcn',
    version: '0.0.1',
    compatibility: {
      nuxt: '>=3.9.0',
      bridge: false,
    },
  },
  async setup({ componentDir, prefix }) {
    const { resolve } = createResolver(import.meta.url);

    addPlugin(resolve('runtime/plugins/ssr-width.ts'));

    const veeValidate = await tryResolveModule(
      'vee-validate',
      import.meta.url,
    );
    const vaulVue = await tryResolveModule(
      'vaul-vue',
      import.meta.url,
    );

    addComponentsDir(
      {
        path: componentDir,
        extensions: ['.vue'],
        prefix,
        pathPrefix: false,
      },
      {
        prepend: true,
      },
    );

    if (veeValidate !== undefined) {
      addComponent({
        filePath: 'vee-validate',
        export: 'Form',
        name: `${prefix}Form`,
        priority: 999,
      });

      addComponent({
        filePath: 'vee-validate',
        export: 'Field',
        name: `${prefix}FormField`,
        priority: 999,
      });
    }

    if (vaulVue !== undefined) {
      [
        'DrawerPortal',
        'DrawerTrigger',
        'DrawerClose',
      ].forEach((item) => {
        addComponent({
          filePath: 'vaul-vue',
          export: item,
          name: prefix + item,
          priority: 999,
        });
      });
    }

    addComponent({
      filePath: 'reka-ui',
      export: 'PaginationRoot',
      name: `${prefix}Pagination`,
      priority: 999,
    });

    addComponent({
      filePath: 'reka-ui',
      export: 'PaginationList',
      name: `${prefix}PaginationList`,
      priority: 999,
    });

    addComponent({
      filePath: 'reka-ui',
      export: 'PaginationListItem',
      name: `${prefix}PaginationListItem`,
      priority: 999,
    });
  },
});

declare module '@nuxt/schema' {
  interface NuxtConfig {
    shadcn?: ShadcnVueOptions;
  }
  interface NuxtOptions {
    shadcn?: ShadcnVueOptions;
  }
}
