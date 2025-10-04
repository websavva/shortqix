import { defineComponent, computed } from 'vue';
import { Link } from '@vue-email/components';

import palette from '#shared/consts/palette.json';
import { hslToHex } from '#shared/utils/hsl-to-hex';

import { button as baseButtonStyle } from './styles';

export default defineComponent({
  name: 'EmailButton',
  props: {
    href: {
      type: String,
      required: true,
    },
    variant: {
      type: String as () =>
        | 'primary'
        | 'secondary'
        | 'outline',
      default: 'primary',
    },
    size: {
      type: String as () => 'sm' | 'md' | 'lg',
      default: 'md',
    },
  },
  setup(props, { slots }) {
    const buttonStyle = computed(() => {
      const baseStyle = { ...baseButtonStyle };

      // Size variants
      if (props.size === 'sm') {
        baseStyle.padding = '8px 16px';
        baseStyle.fontSize = '14px';
      } else if (props.size === 'lg') {
        baseStyle.padding = '16px 32px';
        baseStyle.fontSize = '18px';
      }

      // Color variants
      if (props.variant === 'secondary') {
        baseStyle.backgroundColor = hslToHex(
          palette.secondary,
        );
        baseStyle.color = hslToHex(
          palette['secondary-foreground'],
        );
      } else if (props.variant === 'outline') {
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = hslToHex(palette.primary);
        baseStyle.border = `2px solid ${hslToHex(palette.primary)}`;
      }

      return baseStyle;
    });

    return () => (
      <Link
        style={buttonStyle.value}
        href={props.href}
      >
        {slots.default?.()}
      </Link>
    );
  },
});
