import {
  defineComponent,
  computed,
  type PropType,
} from 'vue';
import { Section } from '@vue-email/components';

import palette from '#shared/consts/palette.json';
import { hslToHex } from '#shared/utils/hsl-to-hex';

import { card as baseCardStyle } from './styles';

export default defineComponent({
  name: 'EmailCard',
  props: {
    variant: {
      type: String as PropType<
        'default' | 'highlighted' | 'outlined'
      >,
      default: 'default',
    },
  },
  setup(props, { slots }) {
    const cardStyle = computed(() => {
      const baseStyle = { ...baseCardStyle };

      if (props.variant === 'highlighted') {
        baseStyle.backgroundColor = hslToHex(
          palette.accent,
        );
        baseStyle.borderColor = hslToHex(palette.primary);
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
