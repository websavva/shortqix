<template>
  <Component
    :is="tag"
    :class="cn('mx-auto  max-lg:w-full max-xl:max-w-screen-lg max-w-screen-xl', props.class)"
  >
    <slot />
  </Component>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@/utils/cn';

const props = withDefaults(defineProps<{
  tag?: string;
  class?: HTMLAttributes['class'];
}>(), {
  tag: 'div' as const,
});
</script>
