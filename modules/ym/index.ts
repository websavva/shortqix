import { defineNuxtModule } from '@nuxt/kit';
import { defu } from 'defu';

import { getYmHeadTags } from './config';

export interface ModuleOptions {
  id?: string | number;
  enabled?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'yandex-metrika',
    configKey: 'ym',
  },

  setup({ enabled, id }, nuxt) {
    if (!enabled || !id) return;

    nuxt.options.app.head = defu(
      nuxt.options.app.head || {},
      getYmHeadTags(id),
    );
  },
});
