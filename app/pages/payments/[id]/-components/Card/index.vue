<template>
  <div>
    <div
      class="bg-gradient-to-br from-background via-background to-primary/5 rounded-xl border border-border shadow-lg p-6"
    >
      <Head :status="props.payment.status" />

      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 300 }"
        :size-config="{ duration: 300 }"
      >
        <div v-if="isCurrentPaymentWaitingForConfirmation">
          <ProgressBar
            :created-at="props.payment.createdAt"
            :expires-at="props.payment.expiresAt"
            class="mt-6"
            @complete="onExpire"
          />
        </div>
      </SizeTransition>

      <Info
        :payment="payment"
        class="mt-6"
      />
    </div>

    <SizeTransition
      singular
      concurrent
      :fade-config="{ duration: 200 }"
      :size-config="{ duration: 300 }"
    >
      <div v-if="props.payment.status === PaymentStatus.PROCESSING">
        <BitcoinAddressBox
          :address="props.payment.bitcoinAddress"
          :amount="props.payment.amountBtc"
          class="mt-6"
        />
      </div>
    </SizeTransition>

    <Actions
      :status="props.payment.status"
      :pending="props.pending"
      class="mt-6"
      @refresh="emit('refresh')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Payment } from '#server/db/entities';
import {
  isPaymentWaitingForConfirmation,
  PaymentStatus,
} from '#shared/consts/payments';
import SizeTransition from '@/components/ui/SizeTransition';

import Head from './Head.vue';
import Info from './Info.vue';
import Actions from './Actions.vue';
import BitcoinAddressBox from './BitcoinAddressBox.vue';
import ProgressBar from './ProgressBar.vue';

const props = defineProps<{
  payment: Payment;
  pending: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
  'update:payment': [Payment];
}>();

const isCurrentPaymentWaitingForConfirmation = computed(
  () => {
    return isPaymentWaitingForConfirmation(
      props.payment.status,
    );
  },
);

function onExpire() {
  if (!isCurrentPaymentWaitingForConfirmation.value) return;

  emit('update:payment', {
    ...props.payment,
    status: PaymentStatus.EXPIRED,
  });
}
</script>
