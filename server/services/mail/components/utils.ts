import type { ExtractComponentProps } from '@vue-email/components';
import {
  type FunctionalComponent,
  type Component,
  h,
  type CSSProperties,
} from 'vue';

export function defineEmailComponent<C extends Component>(
  Component: C,
  style: CSSProperties,
) {
  const WrappedComponent: FunctionalComponent<
    ExtractComponentProps<C> & {
      style?: CSSProperties;
    }
  > = (props, { slots }) =>
    h(
      Component,
      {
        ...props,
        style: {
          ...style,
          ...props.style,
        },
      },
      slots,
    );

  return WrappedComponent;
}
