import { defineMailTemplate } from '../utils';

import Component from './Component.vue';

export const MagicLinkMailTemplate = defineMailTemplate(
  Component,
  (_) => {
    return `Magic Link`;
  },
);
