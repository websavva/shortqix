import { MagicLinkMailTemplate } from './MagicLink';

export const mailTemplates = {
  'magic-link': MagicLinkMailTemplate,
};

export type MailTemplateName = keyof typeof mailTemplates;
