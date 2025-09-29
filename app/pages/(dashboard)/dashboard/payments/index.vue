<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Payments
      </h1>
      <p class="text-muted-foreground">
        Manage your payments and subscription status
      </p>
    </div>

    <div class="mt-5">
      <SizeTransition
        singular
        concurrent
        height-only
        :fade-config="{ duration: 200 }"
        :size-config="{ duration: 200 }"
      >
        <!-- URLs Table -->
        <TablePlaceholder v-if="pending" />

        <ErrorPane
          v-else-if="error"
          title="Failed to load payments"
          :message="
            error?.data?.message ||
            'Failed to load payments'
          "
          :pending="pending"
          @retry="fetchPayments"
        />

        <div v-else-if="paymentsResponse && paymentsResponse.payments.length > 0">
          <PaymentsTable
            :payments="paymentsResponse.payments"
            :cancelling-payment-id
            @cancel="onCancel"
          />

          <Pagination
            v-if="paymentsResponse.pagination.count > 1"
            class="mt-5"
            v-bind="paymentsResponse.pagination"
            @change="onPageChange"
          />
        </div>

        <div v-else>
          <p class="text-muted-foreground">
            No payments found
          </p>
        </div>
      </SizeTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useLazyFetch,
  useRouter,
  useRoute,
} from '#imports';

import ErrorPane from '@/components/ErrorPane.vue';
import SizeTransition from '@/components/ui/SizeTransition';
import Pagination from '@/components/ui/pagination/Pagination.vue';
import { PaginationParamsSchema } from '#shared/dtos/pagination';
import TablePlaceholder from '@/components/ui/table/TablePlaceholder.vue';
import { useToast } from '@/components/ui/toast';

import PaymentsTable from './-components/PaymentsTable.vue';

const $router = useRouter();
const $route = useRoute();
const $toast = useToast();

const cancellingPaymentId = ref<string | null>(null);

const query = computed(() =>
  PaginationParamsSchema.parse($route.query),
);

const {
  data: paymentsResponse,
  pending,
  error,
  execute: fetchPayments,
} = await useLazyFetch('/api/payments', {
  credentials: 'include',
  query,
  // temporary enforced delay for smooth animation
  transform: (response) => sleep(500).then(() => response),
});

function onPageChange(page: number) {
  $router.push({
    query: {
      ...$route.query,
      page,
    },
  });
}

async function onCancel(paymentId: string) {
  if (cancellingPaymentId.value) return;

  cancellingPaymentId.value = paymentId;

  try {
    const updatedPayment = await $fetch(
      `/api/payments/${paymentId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    );

    // temporary enforced delay for smooth animation
    await sleep(500);

    paymentsResponse.value!.payments =
      paymentsResponse.value!.payments.map((payment) =>
        payment.id === paymentId ? updatedPayment : payment,
      );
  } catch (error: any) {
    $toast.toast({
      title: 'Failed to cancel payment',
      description:
        error?.data?.message || 'Please try again',
    });
  } finally {
    cancellingPaymentId.value = null;
  }
}
</script>
