<template>
  <div :class="cn(props.class)">
    <div
      class="flex items-center justify-between text-sm text-muted-foreground mb-2"
    >
      <span>Payment Progress</span>
      <span>{{ formatedRemainingTime }}</span>
    </div>
    <div class="w-full bg-muted rounded-full h-2">
      <div
        class="bg-primary h-2 rounded-full transition-all duration-1000"
        :style="{
          width: progressPercentage,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useTimestamp, useMounted } from '@vueuse/core';

import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  createdAt: string | Date;
  expiresAt: string | Date;
}>();

const emit = defineEmits<{
  complete: [];
}>();

const {
  timestamp,
  pause: stopCountdown,
  resume: startCountdown,
} = useTimestamp({
  immediate: false,
  controls: true,

  interval: 1e3,
});

const isMounted = useMounted();

const remainingTimeInMilliseconds = computed(() => {
  if (!isMounted.value) return 0;

  const diff =
    new Date(props.expiresAt).getTime() - timestamp.value;

  return diff;
});

const overallRemainingTimeInMilliseconds = computed(() => {
  return (
    new Date(props.expiresAt).getTime() -
    new Date(props.createdAt).getTime()
  );
});

watch(remainingTimeInMilliseconds, () => {
  if (remainingTimeInMilliseconds.value <= 0) {
    stopCountdown();

    emit('complete');
  }
});

watch(
  () => [props.createdAt, props.expiresAt],
  () => {
    if (remainingTimeInMilliseconds.value > 0) {
      startCountdown();
    } else {
      emit('complete');
    }
  },
);

const progressPercentage = computed(() => {
  if (
    !remainingTimeInMilliseconds.value ||
    !overallRemainingTimeInMilliseconds.value
  )
    return 0;

  const percentage =
    (1 -
      remainingTimeInMilliseconds.value /
        overallRemainingTimeInMilliseconds.value) *
    100;

  return Math.min(Math.max(percentage, 0), 100) + '%';
});

const formatedRemainingTime = computed(() => {
  if (!remainingTimeInMilliseconds.value) return '';

  const minutes = Math.floor(
    remainingTimeInMilliseconds.value / (60 * 1000),
  );
  const seconds = Math.floor(
    (remainingTimeInMilliseconds.value % (60 * 1000)) /
      1000,
  );

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

onMounted(() => {
  if (remainingTimeInMilliseconds.value > 0) {
    startCountdown();
  } else {
    emit('complete');
  }
});

onUnmounted(() => {
  stopCountdown();
});
</script>
