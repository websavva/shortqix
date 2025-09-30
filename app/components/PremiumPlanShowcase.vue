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
      <span> Premium Subscription </span>
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

      <ClientOnly>
        <Dialog
          :open="isModalOpened"
          @update:open="onModalOpenedUpdate"
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle
                >Premium Plan Purchase</DialogTitle
              >

              <DialogDescription class="mt-5">
                Do you want to purchase a premium plan?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter class="mt-5">
              <Button
                :pending
                @click="onPurchase"
              >
                Purchase
              </Button>

              <Button
                variant="outline"
                :disabled="pending"
                @click="onCancel"
                >Cancel</Button
              >
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ClientOnly>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ClientOnly } from '#components';
import { ref, useAuth, useRouter } from '#imports';

import {
  PREMIUM_PLANS,
  PremiumPlanId,
} from '#shared/consts/premium-plans';
import PremiumPlanCard from '@/components/PremiumPlanCard.vue';
import { cn } from '@/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from '@/components/ui/Button.vue';
import { useToast } from '@/components/ui/toast';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const $router = useRouter();
const $toast = useToast();

const { isAuthenticated } = useAuth();

const isModalOpened = ref(false);
const pending = ref(false);
const selectedPlanId = ref<PremiumPlanId | null>(null);

const onSelect = (planId: PremiumPlanId) => {
  if (!isAuthenticated.value) {
    $router.push('/login');
  } else {
    isModalOpened.value = true;
    selectedPlanId.value = planId;
  }
};

const onPurchase = async () => {
  if (pending.value) return;

  pending.value = true;
  try {
    const { payment } = await $fetch('/api/premium', {
      method: 'POST',
      body: {
        planId: selectedPlanId.value!,
      },

      credentials: 'include',
    });

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

const onModalOpenedUpdate = (isOpened: boolean) => {
  if (!isOpened) {
    if (!pending.value) isModalOpened.value = false;
  } else {
    isModalOpened.value = true;
  }
};

const onCancel = () => {
  isModalOpened.value = false;
};
</script>
