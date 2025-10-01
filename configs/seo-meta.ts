import type { NuxtConfig } from 'nuxt/config';

const description = `${process.env.APP_NAME} is a URL shortening service that allows you to shorten long URLs into short, easy-to-remember links.`;

export const staticSeoMeta: Required<NuxtConfig>['app']['head'] =
  {
    title: 'Home',

    titleTemplate: `%s | ${process.env.APP_NAME} - Fast, reliable URL shortening service`,

    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'og:image',
        content: `${process.env.BASE_URL}/og.png`,
      },
      {
        name: 'og:title',
        content: process.env.APP_NAME,
      },
      {
        name: 'og:description',
        content: description,
      },
      {
        name: 'og:url',
        content: process.env.BASE_URL,
      },
      {
        name: 'og:type',
        content: 'website',
      },
    ],

    htmlAttrs: {
      lang: 'en',
    },

    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: `${process.env.BASE_URL}/logo-box.png`,
      },
    ],
  };
