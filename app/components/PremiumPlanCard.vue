<template>
  <div
    :class="
      cn(
        'relative p-6 bg-gradient-to-br from-background via-background to-primary/5 rounded-xl border border-border shadow-md shadow-primary/10 backdrop-blur-sm transition-all duration-300 group flex flex-col',
        {
          'border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10':
            isPopular,
        },
        props.class,
      )
    "
  >
    <!-- Popular Badge -->
    <div
      v-if="isPopular"
      class="absolute -top-3 left-1/2 transform -translate-x-1/2"
    >
      <div
        class="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg"
      >
        Popular
      </div>
    </div>

    <!-- Plan Icon -->
    <div class="flex justify-center mb-4">
      <div
        class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
      >
        <ZapIcon class="size-6 text-primary" />
      </div>
    </div>

    <!-- Plan Title -->
    <h3
      class="text-xl font-semibold text-foreground text-center mb-2"
    >
      {{ plan.title }}
    </h3>

    <!-- Plan Description -->
    <p
      class="text-sm text-muted-foreground text-center mb-6"
    >
      {{ plan.description }}
    </p>

    <!-- Price -->
    <div class="text-center mb-6">
      <div class="flex items-baseline justify-center gap-1">
        <span class="text-3xl font-bold text-foreground">
          ${{ plan.priceUSD }}
        </span>
        <span class="text-sm text-muted-foreground">
          /{{ plan.durationText }}
        </span>
      </div>

      <!-- Savings -->
      <div
        v-if="savingsPercentage > 0"
        class="mt-2 inline-block bg-foreground/10 text-xs font-medium px-3 py-1 rounded-full"
      >
        Save {{ savingsPercentage }}%
      </div>
    </div>

    <!-- Features -->
    <div class="space-y-2 mb-6 mt-auto">
      <div
        v-for="feature in features"
        :key="feature"
        class="flex items-center gap-2"
      >
        <div
          class="size-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <CheckIcon class="size-4 text-primary" />
        </div>
        <span class="text-sm text-foreground">
          {{ feature }}
        </span>
      </div>
    </div>

    <!-- Action Button -->
    <Button
      :class="
        cn('w-full', {
          'bg-primary hover:bg-primary/90 text-primary-foreground':
            !isPopular,
          'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg':
            isPopular,
        })
      "
      :pending="pending"
      icon-position="right"
      @click="onSelect"
    >
      Choose
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed } from '#imports';
import { CheckIcon, ZapIcon } from 'lucide-vue-next';

import {
  PremiumPlanId,
  PREMIUM_PLANS,
} from '#shared/consts/premium-plans';
import { cn } from '@/utils';
import Button from '@/components/ui/Button.vue';

interface Props {
  planId: PremiumPlanId;
  isPopular?: boolean;
  pending?: boolean;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  isPopular: false,
  pending: false,
  currentPlanId: undefined,
});

const emit = defineEmits<{
  (e: 'select', planId: PremiumPlanId): void;
}>();

const plan = computed(() => {
  return PREMIUM_PLANS[props.planId];
});

// Calculate savings percentage
const savingsPercentage = computed(() => {
  if (plan.value.id === PremiumPlanId.ONE_MONTH) return 0;

  const monthlyPrice =
    PREMIUM_PLANS[PremiumPlanId.ONE_MONTH].priceUSD;

  const equivalentMonthlyPrice =
    plan.value.priceUSD / (plan.value.duration / 30);
  const savings =
    ((monthlyPrice - equivalentMonthlyPrice) /
      monthlyPrice) *
    100;

  return Math.round(savings);
});

// Features based on plan
const features = [
  'Unlimited URL shortening',
  'Advanced analytics dashboard',
  'URLs list',
  'Custom short URLs',
];

// Check if current plan

// Handle selection
const onSelect = () => {
  emit('select', plan.value.id);
};
</script>
