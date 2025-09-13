<template>
  <Transition v-bind="transitionProps">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import {
  type PropType,
  computed,
  useSizeTransition,
  SIZE_TRANSITION_DEFAULT_OPTIONS,
  type UseSizeTransitionOptions,
} from '#imports';

const props = defineProps({
  fadeConfig: {
    type: Object as PropType<
      UseSizeTransitionOptions['fade']
    >,
    default: () => SIZE_TRANSITION_DEFAULT_OPTIONS.fade,
  },

  sizeConfig: {
    type: Object as PropType<
      UseSizeTransitionOptions['size']
    >,
    default: () => SIZE_TRANSITION_DEFAULT_OPTIONS.size,
  },

  concurrent: Boolean,
  disabled: Boolean,

  singular: Boolean,
});

const options = computed(() => {
  const {
    concurrent,
    disabled,
    fadeConfig: fade,
    sizeConfig: size,
    singular,
  } = props;

  return {
    concurrent,
    disabled,
    fade,
    size,
    singular,
  };
});

const transitionProps = useSizeTransition(options);
</script>
