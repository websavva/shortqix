<template>
  <div
    :class="
      cn(
        'grid grid-cols-1 md:grid-cols-2 gap-6',
        props.class,
      )
    "
  >
    <!-- Left Column -->
    <div class="space-y-4">
      <div>
        <label
          class="text-sm font-medium text-muted-foreground"
          >Plan</label
        >
        <p class="text-lg font-semibold text-foreground">
          {{ planTitle }}
        </p>
      </div>

      <div>
        <label
          class="text-sm font-medium text-muted-foreground"
          >Amount</label
        >
        <div class="flex items-baseline gap-2">
          <p class="text-lg font-semibold text-foreground">
            ${{ payment.amountUsd }}
          </p>
          <span class="text-sm text-muted-foreground">
            ({{ payment.amountBtc }} BTC)
          </span>
        </div>
      </div>

      <div>
        <label
          class="text-sm font-medium text-muted-foreground"
          >Payment ID</label
        >
        <p
          class="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded"
        >
          {{ payment.id }}
        </p>
      </div>
    </div>

    <!-- Right Column -->
    <div class="space-y-4">
      <div>
        <label
          class="text-sm font-medium text-muted-foreground"
          >Created</label
        >
        <p class="text-sm text-foreground">
          {{ formatDate(payment.createdAt) }}
        </p>
      </div>

      <div>
        <label
          class="text-sm font-medium text-muted-foreground"
          >Expires</label
        >
        <p class="text-sm text-foreground">
          {{ formatDate(payment.expiresAt) }}
        </p>
      </div>

      <div v-if="payment.confirmedAt">
        <label
          class="text-sm font-medium text-muted-foreground"
          >Confirmed</label
        >
        <p class="text-sm text-foreground">
          {{ formatDate(payment.confirmedAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { PREMIUM_PLANS } from '#shared/consts/premium-plans';
import type { Payment } from '#server/db/entities';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  payment: Payment;
}>();

const planTitle = computed(() => {
  return PREMIUM_PLANS[props.payment.plan].title;
});

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};
</script>
