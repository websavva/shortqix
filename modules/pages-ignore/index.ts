import { extname } from 'node:path';

import { defineNuxtModule } from '@nuxt/kit';
import type { NuxtPage } from '@nuxt/schema';

function findIgnoredPageIndex(pages: NuxtPage[]) {
  return pages.findIndex((page) => {
    if (!page.file) return false;

    // @ts-expect-error - skipIgnore is not typed
    const isIgnoreSkipped = page.skipIgnore;

    const hasIgnoredPrefix = page.file
      .split('/')
      .some((pathPart) => pathPart.startsWith('-'));

    const hasVueExtension = extname(page.file) === '.vue';

    return (
      !isIgnoreSkipped &&
      (hasIgnoredPrefix || !hasVueExtension)
    );
  });
}
function removeIgnoredPages(pages: NuxtPage[]) {
  let ignoredPageIndex: number;

  while (
    ~(ignoredPageIndex = findIgnoredPageIndex(pages))
  ) {
    pages.splice(ignoredPageIndex, 1);
  }

  for (const page of pages) {
    if (page.children?.length)
      removeIgnoredPages(page.children);
  }
}
export default defineNuxtModule({
  meta: {
    name: 'pages-ignore',
  },

  setup(_, nuxt) {
    nuxt.hook('modules:done', () => {
      nuxt.hook('pages:resolved', removeIgnoredPages);
    });
  },
});
