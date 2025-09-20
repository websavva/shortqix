<template>
  <div class="flex flex-col gap-4">
    <!-- Action Buttons -->
    <FadeTransition>
      <Button
        v-if="
          props.status === PaymentStatus.PROCESSING ||
          props.status ===
            PaymentStatus.CONFIRMATION_PENDING
        "
        :disabled="props.pending"
        size="lg"
        @click="emit('refresh')"
      >
        <template #icon>
          <ArrowRight class="w-4 h-4" />
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
          <ArrowRight class="w-4 h-4" />
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
          <Plus class="w-4 h-4" />
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
          <ArrowLeft class="w-4 h-4" />
        </template>

        Back to Plans
      </Button>
    </FadeTransition>

    <!-- Payment History Link -->
    <Button
      variant="secondary"
      as="NuxtLink"
      size="lg"
      to="/payments"
    >
      <template #icon>
        <History class="w-4 h-4" />
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
} from 'lucide-vue-next';

import { PaymentStatus } from '#shared/consts/payments';
import Button from '@/components/ui/Button.vue';
import FadeTransition from '@/components/ui/FadeTransition';

const props = defineProps<{
  status: PaymentStatus;
  pending: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();
</script>
