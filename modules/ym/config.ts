import type { NuxtAppConfig } from 'nuxt/schema';

export const getYmHeadTags = (
  id: string | number,
): NuxtAppConfig['head'] => ({
  script: [
    {
      key: 'ym-init',
      type: 'text/javascript',
      innerHTML: `(function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${id}', 'ym');

    ym(${id}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`,
      tagPosition: 'bodyClose',
    },
  ],

  noscript: [
    {
      key: 'ym-fallback-init',
      innerHTML: `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      tagPosition: 'bodyClose',
    },
  ],
});
