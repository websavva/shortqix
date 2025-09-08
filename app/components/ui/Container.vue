<template>
  <Component
    :is="tag"
    class="mx-auto max-w-screen-xl"
  >
    <slot />
  </Component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  tag?: string;
}>(), {
  tag: 'div' as const,
});
</script>
