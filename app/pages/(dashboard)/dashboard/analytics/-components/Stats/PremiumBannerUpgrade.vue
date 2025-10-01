<template>
  <div
    class="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6"
  >
    <div class="flex space-x-4">
      <!-- Premium Icon -->
      <div
        class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0"
      >
        <BarChart3 class="w-6 h-6 text-primary" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-foreground">
            Analytics Locked
          </h3>
          <span
            class="text-sm font-medium text-primary max-sm:hidden"
          >
            Starting at ${{ startingPrice }}/mo
          </span>
        </div>

        <p class="text-sm text-muted-foreground mb-4">
          Get detailed insights into your link performance
          with comprehensive analytics.
        </p>

        <!-- CTA Button -->
        <Button
          as="NuxtLink"
          to="/premium"
          size="sm"
          class="w-fit"
          icon-position="right"
        >
          Upgrade Now
          <template #icon>
            <ArrowRight class="w-3 h-3" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3, ArrowRight } from 'lucide-vue-next';

import {
  PremiumPlanId,
  PREMIUM_PLANS,
} from '#shared/consts/premium-plans';
import Button from '@/components/ui/Button.vue';

const startingPrice =
  PREMIUM_PLANS[PremiumPlanId.ONE_MONTH].priceUSD;
</script>
