import { defineMailTemplate } from '../utils';

import Component from './Component';

export const MagicLinkMailTemplate = defineMailTemplate(
  Component,
  () => {
    return `Magic Link`;
  },
);
