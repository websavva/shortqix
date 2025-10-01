import { defineMailTemplate } from '../utils';

import Component from './Component.vue';

export const WelcomeMailTemplate = defineMailTemplate(
  Component,
  () => {
    return `Welcome to ${process.env.APP_NAME}`;
  },
);
