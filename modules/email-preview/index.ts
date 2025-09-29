import {
  defineNuxtModule,
  addServerHandler,
  createResolver,
} from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'email-preview',
  },

  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (nuxt.options.dev) {
      addServerHandler({
        route: '/api/dev/email-preview',
        handler: resolver.resolve('./runtime/handler.ts'),
      });
    }
  },
});
