<template>
  <div
    :class="
      cn('flex flex-col items-center', props.class ?? '')
    "
  >
    <span
      class="bg-foreground/10 text-foreground/80 rounded-lg px-4 py-2 text-sm max-lg:text-xs block uppercase"
    >
      Feature
    </span>

    <h2
      class="text-3xl max-lg:text-2xl mt-5 flex flex-col items-center font-bold text-center"
    >
      <span>Premium Subscription</span>
    </h2>

    <ul
      class="w-full flex gap-[var(--premium-plan-showcase-gap,_calc(var(--spacing)_*_8))] *:flex-1 mt-10 max-lg:flex-col max-lg:max-w-md max-lg:w-full"
    >
      <li
        v-for="plan in PREMIUM_PLANS"
        :key="plan.id"
      >
        <PremiumPlanCard
          :plan-id="plan.id"
          :is-popular="plan.id === PremiumPlanId.ONE_YEAR"
          class="h-full"
          @select="onSelect"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { PremiumPlanCard } from '#components';
import {
  ref,
  useAuth,
  useRouter,
  useToast,
  cn,
  usePremiumPurchaseConfirmModal,
} from '#imports';

import {
  PREMIUM_PLANS,
  PremiumPlanId,
} from '#shared/consts/premium-plans';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const $router = useRouter();
const $toast = useToast();

const { isAuthenticated } = useAuth();
const { open: openPremiumPurchaseConfirmModal } =
  usePremiumPurchaseConfirmModal();

const pending = ref(false);

const onSelect = async (planId: PremiumPlanId) => {
  if (!isAuthenticated.value) {
    $router.push('/login');
  } else if (!pending.value) {
    openPremiumPurchaseConfirmModal({
      planId,
      pending,
      onConfirm: (onSuccess) => {
        onPurchase(planId, onSuccess);
      },
    });
  }
};

const onPurchase = async (
  planId: PremiumPlanId,
  onSuccess: () => void,
) => {
  if (pending.value) return;

  pending.value = true;

  try {
    const { payment } = await $fetch('/api/premium', {
      method: 'POST',
      body: {
        planId,
      },

      credentials: 'include',
    });

    onSuccess();

    $router.push(`/payments/${payment!.id}`);
  } catch (err: any) {
    $toast.toast({
      title: 'Failed to purchase premium plan',
      description: err.data?.message || 'Please try again',
    });
  } finally {
    pending.value = false;
  }
};
</script>
