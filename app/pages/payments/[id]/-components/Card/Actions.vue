<template>
  <div class="flex flex-col gap-4">
    <!-- Action Buttons -->
    <FadeTransition>
      <Button
        v-if="isPaymentWaitingForConfirmation"
        :disabled="props.pending"
        size="lg"
        @click="emit('refresh')"
      >
        <template #icon>
          <ArrowRight />
        </template>
        Check Status
      </Button>

      <!-- Check Status Button -->
      <Button
        v-else-if="props.status === PaymentStatus.SUCCESS"
        as="NuxtLink"
        to="/dashboard"
        size="lg"
      >
        <template #icon>
          <ArrowRight />
        </template>
        Go to Dashboard
      </Button>

      <Button
        v-else-if="
          props.status === PaymentStatus.EXPIRED ||
          props.status === PaymentStatus.CANCELLED
        "
        as="NuxtLink"
        to="/premium"
        size="lg"
      >
        <template #icon>
          <Plus />
        </template>

        Create New Payment
      </Button>

      <Button
        v-else
        variant="outline"
        as="NuxtLink"
        to="/premium"
        size="lg"
      >
        <template #icon>
          <ArrowLeft />
        </template>

        Back to Plans
      </Button>
    </FadeTransition>

    <SizeTransition
      v-if="isPaymentWaitingForConfirmation"
      singular
      concurrent
      :pending="props.pending"
      :fade-config="{ duration: 200 }"
      :size-config="{ duration: 200 }"
      @click="emit('cancel')"
    >
      <Button
        size="lg"
        variant="secondary"
      >
        <template #icon>
          <CopyX />
        </template>

        Cancel Payment
      </Button>
    </SizeTransition>

    <Button
      variant="outline"
      as="NuxtLink"
      size="lg"
      to="/dashboard/payments"
    >
      <template #icon>
        <History />
      </template>

      View All Payments
    </Button>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  History,
  CopyX,
} from 'lucide-vue-next';
import { computed } from 'vue';
import {
  FadeTransition,
  SizeTransition,
  Button,
} from '#components';

import {
  PaymentStatus,
  isPaymentWaitingForConfirmation as isPaymentWaitingForConfirmationFn,
} from '#shared/consts/payments';

const props = defineProps<{
  status: PaymentStatus;
  pending: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  cancel: [];
}>();

const isPaymentWaitingForConfirmation = computed(() =>
  isPaymentWaitingForConfirmationFn(props.status),
);
</script>
