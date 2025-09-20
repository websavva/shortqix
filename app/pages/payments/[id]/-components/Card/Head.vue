<template>
  <div
    :class="
      cn('flex items-center justify-between', props.class)
    "
  >
    <div class="flex items-center gap-3">
      <FadeTransition :duration="100">
        <div :key="statusConfig!.class">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="statusConfig!.class"
          >
            <component
              :is="statusConfig!.icon"
              class="size-6"
            />
          </div>
        </div>
      </FadeTransition>

      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 200 }"
        :size-config="{ duration: 200 }"
      >
        <div :key="statusConfig!.title" class="whitespace-nowrap">
          <h2 class="text-xl font-semibold text-foreground">
            {{ statusConfig!.title }}
          </h2>

          <p class="text-sm text-muted-foreground">
            {{ statusConfig!.description }}
          </p>
        </div>
      </SizeTransition>
    </div>

    <FadeTransition>
      <div
        :key="statusConfig!.badge"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="statusConfig!.badgeClass"
      >
        {{ statusConfig!.badge }}
      </div>
    </FadeTransition>
  </div>
</template>

<script setup lang="ts">
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';

import SizeTransition from '@/components/ui/SizeTransition';
import FadeTransition from '@/components/ui/FadeTransition';
import { PaymentStatus } from '#shared/consts/payments';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  status: PaymentStatus;
}>();

const configs = {
  [PaymentStatus.PROCESSING]: {
    icon: Clock,
    title: 'Payment Processing',
    description: 'Waiting for Bitcoin payment',
    badge: 'Processing',
    badgeClass: 'bg-primary/10 text-primary',
    class: 'bg-primary/10 text-primary',
  },
  [PaymentStatus.CONFIRMATION_PENDING]: {
    icon: Loader2,
    title: 'Confirmation Pending',
    description:
      'Payment received, waiting for confirmation',
    badge: 'Pending',
    badgeClass: 'bg-yellow-200/20 text-yellow-200',
    class: 'bg-yellow-200/20 text-yellow-200 animate-spin',
  },
  [PaymentStatus.SUCCESS]: {
    icon: CheckCircle,
    title: 'Payment Successful',
    description: 'Your premium subscription is now active',
    badge: 'Success',
    badgeClass: 'bg-green-300/10 text-green-300',
    class: 'bg-green-300/10 text-green-300',
  },
  [PaymentStatus.EXPIRED]: {
    icon: XCircle,
    title: 'Payment Expired',
    description: 'This payment has expired',
    badge: 'Expired',
    badgeClass: 'bg-destructive/10 text-destructive',
    class: 'bg-destructive/10 text-destructive',
  },
  [PaymentStatus.CANCELLED]: {
    icon: AlertCircle,
    title: 'Payment Cancelled',
    description: 'This payment was cancelled',
    badge: 'Cancelled',
    badgeClass:
      'bg-muted-foreground/20 text-muted-foreground',
    class: 'bg-muted-foreground/20 text-muted-foreground',
  },
};

// Status configuration
const statusConfig = computed(() => {
  return configs[props.status];
});
</script>
