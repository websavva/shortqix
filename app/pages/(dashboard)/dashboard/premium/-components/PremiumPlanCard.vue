<template>
  <div
    :class="
      cn(
        'bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors relative',
        props.class,
      )
    "
  >
    <div class="text-center mb-6">
      <h3
        class="text-xl font-semibold text-foreground mb-2"
      >
        {{ plan.title }}
      </h3>
      <p class="text-sm text-muted-foreground mb-4">
        {{ plan.description }}
      </p>
      <div class="flex items-baseline justify-center">
        <span class="text-3xl font-bold text-foreground">
          ${{ plan.priceUSD }}
        </span>
        <span class="text-sm text-muted-foreground ml-1">
          /{{ plan.durationText }}
        </span>
      </div>
    </div>

    <Button
      class="w-full"
      :pending="pending"
      @click="onPlanSelect(plan.id)"
    >
      Choose {{ plan.title }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import Button from '@/components/ui/Button.vue';
import {
  PREMIUM_PLANS,
  type PremiumPlanId,
} from '#shared/consts/premium-plans';

const props = defineProps<{
  planId: PremiumPlanId;
  pending: boolean;
  class?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{
  select: [planId: PremiumPlanId];
}>();

const plan = computed(() => {
  return PREMIUM_PLANS[props.planId];
});

const onPlanSelect = (planId: PremiumPlanId) => {
  emit('select', planId);
};
</script>
