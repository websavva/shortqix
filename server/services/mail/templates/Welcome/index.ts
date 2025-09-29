import { defineMailTemplate } from '../utils';

import Component from './Component.vue';

export const WelcomeMailTemplate = defineMailTemplate(
  Component,
  (_) => {
    return `Welcome to Shortqix`;
  },
);
