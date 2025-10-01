<template>
  <Section :style="cardStyle">
    <slot />
  </Section>
</template>

<script setup lang="ts">
import { Section } from '@vue-email/components';
import { computed } from 'vue';

import palette from '#shared/consts/palette.json';

import { useEmailStyles } from './useEmailStyles';

export interface Props {
  variant?: 'default' | 'highlighted' | 'outlined';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

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
</script>
