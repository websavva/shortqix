import { promisify } from 'node:util';

import {
  defineNuxtModule,
  addTemplate,
  createResolver,
} from '@nuxt/kit';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import _svg2img, { type svg2imgOptions } from 'svg2img';

import LogoBox from '../../shared/components/LogoBox';

const svg2img = promisify(_svg2img) as (
  svg: string,
  options?: svg2imgOptions,
) => Promise<Buffer>;

export default defineNuxtModule({
  meta: {
    name: 'logo-box-png-generator',
  },

  async setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    const app = createSSRApp(LogoBox, {
      scale: 0.8,
    });
    const svg = await renderToString(app);
    const logoBuffer = await svg2img(svg, {
      resvg: {
        fitTo: { mode: 'zoom', value: 1.5 },
        background: 'transparent',
      },
    });

    addTemplate({
      filename: 'dynamic-static/logo-box.png',
      write: true,
      // @ts-expect-error Buffer is implicitly supported by Nuxt
      // as under the hood it uses Node.js's fs module
      getContents: () => logoBuffer,
    });

    nuxt.hook('nitro:config', (config) => {
      if (!config.publicAssets) config.publicAssets = [];

      config.publicAssets.push({
        maxAge: 0,

        dir: resolve(
          nuxt.options.buildDir,
          'dynamic-static',
        ),
      });
    });
  },
});
