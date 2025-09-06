import type {
  Component,
  VNodeProps,
  AllowedComponentProps,
} from 'vue';
import { render } from '@vue-email/render';

type ExtractComponentProps<TComponent> =
  TComponent extends new () => {
    $props: infer P;
  }
    ? Omit<
        P,
        keyof VNodeProps | keyof AllowedComponentProps
      >
    : never;

export const defineMailTemplate = <C extends Component>(
  template: C,
  getSubject: (
    props: ExtractComponentProps<C>,
  ) => Promise<string> | string,
) => {
  return async (props: ExtractComponentProps<C>) => {
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
