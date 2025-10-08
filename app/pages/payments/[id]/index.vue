<template>
  <div class="min-h-screen bg-background py-8 max-sm:pt-2">
    <Container class="px-4">
      <!-- Loading State -->
      <div
        v-if="pending"
        class="flex items-center justify-center min-h-[400px]"
      >
        <div class="text-center space-y-4">
          <div
            class="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"
          ></div>

          <p class="text-muted-foreground">
            Loading payment details...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex items-center justify-center min-h-[400px]"
      >
        <div class="text-center space-y-4 max-w-md">
          <div
            class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto"
          >
            <XCircle class="w-8 h-8 text-destructive/90" />
          </div>
          <h2 class="text-xl font-semibold text-foreground">
            Payment Not Found
          </h2>
          <p class="text-muted-foreground">
            The payment you're looking for doesn't exist or
            you don't have permission to view it.
          </p>
          <Button
            as="NuxtLink"
            to="/premium"
            class="mt-4"
          >
            <template #icon>
              <ArrowLeft class="w-4 h-4" />
            </template>
            Back to Premium Plans
          </Button>
        </div>
      </div>

      <!-- Payment Details -->
      <div
        v-else-if="payment"
        class="max-w-2xl mx-auto space-y-6"
      >
        <!-- Payment Header -->
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-bold text-foreground">
            Payment Details
          </h1>
          <p class="text-muted-foreground">
            Track your premium subscription payment
          </p>
        </div>

        <PaymentCard
          v-model:payment="payment"
          :pending="isBeingRefreshed"
          @refresh="onRefresh"
          @cancel="onCancel"
        />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import {
  onWsEvent,
  ref,
  useHead,
  useToast,
} from '#imports';
import { XCircle, ArrowLeft } from 'lucide-vue-next';
import { Container, Button } from '#components';

import { WsEventTypes } from '#shared/consts/ws-event-types';

import PaymentCard from './-components/Card/index.vue';

definePageMeta({
  middleware: 'auth',
});

const $route = useRoute();
const $toast = useToast();

const isBeingRefreshed = ref(false);

const {
  data: payment,
  pending,
  error,
} = await useFetch(`/api/payments/${$route.params.id}`, {
  method: 'get',
  credentials: 'include',
  deep: true,
});

// Check payment status
async function onRefresh() {
  if (!payment.value || isBeingRefreshed.value) return;

  isBeingRefreshed.value = true;

  try {
    const updatedPayment = await $fetch(
      `/api/payments/${$route.params.id}`,
      {
        method: 'get',
        credentials: 'include',
      },
    );

    payment.value = updatedPayment;
  } catch (err: any) {
    $toast.toast({
      title: 'Update Failed',
      description:
        err?.data?.message ||
        'Failed to check payment status',
    });
  } finally {
    isBeingRefreshed.value = false;
  }
}

async function onCancel() {
  if (!payment.value || isBeingRefreshed.value) return;

  isBeingRefreshed.value = true;

  try {
    const updatedPayment = await $fetch(
      `/api/payments/${$route.params.id}`,
      {
        method: 'delete',
        credentials: 'include',
      },
    );

    payment.value = updatedPayment;
  } catch (err: any) {
    $toast.toast({
      title: 'Failed to cancel payment',
      description:
        err?.data?.message || 'Failed to cancel payment',
    });
  } finally {
    isBeingRefreshed.value = false;
  }
}

onWsEvent(
  WsEventTypes.PAYMENT_UPDATE_STATUS,
  (updatedPayment) => {
    if (updatedPayment.id === payment.value?.id) {
      // @ts-expect-error serializable date issue
      payment.value = {
        ...payment.value,
        ...updatedPayment,
      };
    }
  },
);

useHead(() => ({
  title: payment.value
    ? `Payment Details - ${payment.value.id}`
    : 'Not Found Payment',
  meta: [
    {
      name: 'description',
      content: payment.value
        ? 'Track your premium subscription payment'
        : 'Not Found Payment',
    },
  ],
}));
</script>
