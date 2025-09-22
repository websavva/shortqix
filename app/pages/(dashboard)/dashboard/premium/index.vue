<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Premium Management
      </h1>
      <p class="text-muted-foreground">
        Manage your premium subscription and billing
      </p>
    </div>

    <!-- Current Status -->
    <PremiumIntroCard />

    <!-- Plan Selection (for non-premium users) -->
    <div class="space-y-6">
      <div>
        <h2
          class="text-2xl font-semibold text-foreground mb-2"
        >
          Choose Your Plan
        </h2>
        <p class="text-muted-foreground">
          Select the plan that best fits your needs
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumPlanCard
          v-for="planId in Object.values(PremiumPlanId)"
          :key="planId"
          :plan-id="planId"
          :pending
          @select="onPlanSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PremiumPlanId } from '#shared/consts/premium-plans';
import { useToast } from '@/components/ui/toast';

import PremiumIntroCard from './-components/PremiumIntroCard.vue';
import PremiumPlanCard from './-components/PremiumPlanCard.vue';

// State
const pending = ref(false);
const $toast = useToast();

async function onPlanSelect(planId: PremiumPlanId) {
  pending.value = true;

  try {
    const response = await $fetch('/api/premium', {
      method: 'POST',
      body: { planId },
      credentials: 'include',
    });

    // Redirect to payment page
    if (response.payment) {
      await navigateTo(`/payments/${response.payment.id}`);
    }
  } catch (error: any) {
    console.error('Failed to select plan:', error);
    $toast.toast({
      title: 'Failed to select plan',
      description:
        error.data?.message || 'Please try again',
    });
  } finally {
    pending.value = false;
  }
}
</script>
