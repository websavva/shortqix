import { defineComponent, computed } from 'vue';
import { Link } from '@vue-email/components';

import palette from '#shared/consts/palette.json';

import { useEmailStyles } from './useEmailStyles';

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
    const { button } = useEmailStyles();

    const buttonStyle = computed(() => {
      const baseStyle = { ...button };

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
        baseStyle.backgroundColor = palette.secondary;
        baseStyle.color = palette['secondary-foreground'];
      } else if (props.variant === 'outline') {
        baseStyle.backgroundColor = 'transparent';
        baseStyle.color = palette.primary;
        baseStyle.border = `2px solid ${palette.primary}`;
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
