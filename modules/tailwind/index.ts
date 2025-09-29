import {
  defineNuxtModule,
  createResolver,
  installModule,
  addTemplate,
} from '@nuxt/kit';
import TailwindModule from '@nuxtjs/tailwindcss';

import palette from '../../shared/consts/palette.json';

export default defineNuxtModule({
  meta: {
    name: 'tailwind-setup',
  },

  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // creating css file for css color variables declaration

    const { dst: colorVariablesCssPath } = addTemplate({
      filename: 'css/color-variables.css',
      write: true,
      getContents: () =>
        [
          '@layer base {',
          ':root {',
          ...Object.entries(palette).map(
            ([key, value]) => `--${key}: ${value};`,
          ),
          '}',
          '}',
        ].join('\n'),
    });

    nuxt.options.css.push(colorVariablesCssPath);

    const tailwindCssPath = resolve(
      'runtime/css/tailwind.css',
    );

    nuxt.options.css.push(tailwindCssPath);

    await installModule(TailwindModule, {
      cssPath: tailwindCssPath,
    });
  },
});
