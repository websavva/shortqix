<template>
  <div
    :class="
      cn(
        'px-3 py-1 rounded-full text-sm font-medium',
        badgeConfig.class,
        props.class,
      )
    "
  >
    {{ badgeConfig.label }}
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from 'vue';

import { PaymentStatus } from '#shared/consts/payments';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  status: PaymentStatus;
}>();

const configs = {
  [PaymentStatus.PROCESSING]: {
    label: 'Processing',
    class: 'bg-primary/10 text-primary',
  },
  [PaymentStatus.CONFIRMATION_PENDING]: {
    label: 'Pending',
    class: 'bg-yellow-200/20 text-yellow-200',
  },
  [PaymentStatus.SUCCESS]: {
    label: 'Success',
    class: 'bg-green-300/10 text-green-300',
  },
  [PaymentStatus.EXPIRED]: {
    label: 'Expired',
    class: 'bg-destructive/10 text-destructive',
  },
  [PaymentStatus.CANCELLED]: {
    label: 'Cancelled',
    class: 'bg-muted-foreground/20 text-muted-foreground',
  },
};

// Status configuration
const badgeConfig = computed(() => {
  return configs[props.status];
});
</script>
