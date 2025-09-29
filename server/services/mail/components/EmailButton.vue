<template>
  <Link
    :style="buttonStyle"
    :href="href"
  >
    <slot />
  </Link>
</template>

<script setup lang="ts">
import { Link } from '@vue-email/components';
import { computed } from 'vue';

import palette from '#shared/consts/palette.json';

import { useEmailStyles } from './useEmailStyles';

export interface Props {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
});

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
</script>
