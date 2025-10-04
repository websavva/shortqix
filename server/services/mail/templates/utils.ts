import type { Component } from 'vue';
import {
  render,
  type ExtractComponentProps,
} from '@vue-email/render';

export interface MailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

export const defineMailTemplate = <C extends Component>(
  template: C,
  getSubject: (
    props: ExtractComponentProps<C>,
  ) => Promise<string> | string,
) => {
  return async (
    props: ExtractComponentProps<C>,
  ): Promise<MailTemplateResult> => {
    const [subject, html, text] = await Promise.all([
      Promise.resolve(getSubject(props)),
      render(template, props),
      render(template, props, {
        plainText: true,
      }),
    ]);

    return {
      subject,
      html,
      text,
    };
  };
};
