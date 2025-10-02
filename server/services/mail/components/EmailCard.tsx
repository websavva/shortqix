import { defineComponent, computed } from 'vue';
import { Section } from '@vue-email/components';

import palette from '#shared/consts/palette.json';

import { useEmailStyles } from './useEmailStyles';

export default defineComponent({
  name: 'EmailCard',
  props: {
    variant: {
      type: String as () =>
        | 'default'
        | 'highlighted'
        | 'outlined',
      default: 'default',
    },
  },
  setup(props, { slots }) {
    const { card } = useEmailStyles();

    const cardStyle = computed(() => {
      const baseStyle = { ...card };

      if (props.variant === 'highlighted') {
        baseStyle.backgroundColor = palette.accent;
        baseStyle.borderColor = palette.primary;
      } else if (props.variant === 'outlined') {
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = '2px';
      }

      return baseStyle;
    });

    return () => (
      <Section style={cardStyle.value}>
        {slots.default?.()}
      </Section>
    );
  },
});
