<template>
  <div class="min-h-screen bg-background py-8">
    <Container class="px-4">
      <!-- Loading State -->
      <div
        v-if="pending"
        class="flex items-center justify-center min-h-[400px]"
      >
        <div class="text-center space-y-4">
          <div
            class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"
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

        <!-- Payment Status Card -->
        <div
          class="bg-gradient-to-br from-background via-background to-primary/5 rounded-xl border border-border shadow-lg p-6"
        >
          <!-- Status Header -->
          <div
            class="flex items-center justify-between mb-6"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="statusConfig!.class"
              >
                <component
                  :is="statusConfig!.icon"
                  class="w-6 h-6"
                />
              </div>
              <div>
                <h2
                  class="text-xl font-semibold text-foreground"
                >
                  {{ statusConfig!.title }}
                </h2>
                <p class="text-sm text-muted-foreground">
                  {{ statusConfig!.description }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="statusConfig!.badgeClass"
            >
              {{ statusConfig!.badge }}
            </div>
          </div>

          <!-- Payment Progress (for processing payments) -->
          <div
            v-if="
              payment.status === PaymentStatus.PROCESSING ||
              payment.status ===
                PaymentStatus.CONFIRMATION_PENDING
            "
            class="mb-6"
          >
            <div
              class="flex items-center justify-between text-sm text-muted-foreground mb-2"
            >
              <span>Payment Progress</span>
              <span>{{ formatedRemainingTime }}</span>
            </div>
            <div class="w-full bg-muted rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-1000"
                :style="{
                  width: remainingTimePercentage + '%',
                }"
              ></div>
            </div>
          </div>

          <!-- Payment Information -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <!-- Left Column -->
            <div class="space-y-4">
              <div>
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Plan</label
                >
                <p
                  class="text-lg font-semibold text-foreground"
                >
                  {{ planTitle }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Amount</label
                >
                <div class="flex items-baseline gap-2">
                  <p
                    class="text-lg font-semibold text-foreground"
                  >
                    ${{ payment.amountUsd }}
                  </p>
                  <span
                    class="text-sm text-muted-foreground"
                  >
                    ({{ payment.amountBtc }} BTC)
                  </span>
                </div>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Payment ID</label
                >
                <p
                  class="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded"
                >
                  {{ payment.id }}
                </p>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div>
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Created</label
                >
                <p class="text-sm text-foreground">
                  {{ formatDate(payment.createdAt) }}
                </p>
              </div>

              <div>
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Expires</label
                >
                <p class="text-sm text-foreground">
                  {{ formatDate(payment.expiresAt) }}
                </p>
              </div>

              <div v-if="payment.confirmedAt">
                <label
                  class="text-sm font-medium text-muted-foreground"
                  >Confirmed</label
                >
                <p class="text-sm text-foreground">
                  {{ formatDate(payment.confirmedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bitcoin Payment Details (for processing payments) -->
        <div
          v-if="
            payment.status === PaymentStatus.PROCESSING ||
            payment.status ===
              PaymentStatus.CONFIRMATION_PENDING
          "
          class="bg-gradient-to-b from-primary/0 from-20% to-primary/20 rounded-xl border border-border p-6"
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Bitcoin class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3
                class="text-lg font-semibold text-foreground"
              >
                Bitcoin Payment
              </h3>
              <p class="text-sm text-muted-foreground">
                Send the exact amount to the address below
              </p>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center mb-4">
            <div
              class="bg-background border border-border rounded-lg p-4"
            >
              <div
                v-if="qrCode"
                class="size-48 *:size-full p-2"
                v-html="qrCode"
              />

              <div
                v-else
                class="w-48 h-48 bg-muted flex items-center justify-center rounded"
              >
                <div
                  class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
                ></div>
              </div>
            </div>
          </div>

          <!-- Bitcoin Address -->
          <div class="space-y-3">
            <label
              class="text-sm font-medium text-muted-foreground"
              >Bitcoin Address</label
            >
            <div
              class="flex items-center gap-2 p-3 bg-muted rounded-lg"
            >
              <code
                class="flex-1 text-sm font-mono text-foreground break-all"
              >
                {{ payment.bitcoinAddress }}
              </code>
              <Button
                size="sm"
                variant="outline"
                class="flex-shrink-0"
                @click="copyAddress"
              >
                <template #icon>
                  <Copy class="w-4 h-4" />
                </template>
                Copy
              </Button>
            </div>

            <div class="text-center">
              <p class="text-sm text-muted-foreground">
                Send exactly
                <span class="font-semibold text-foreground"
                  >{{ payment.amountBtc }} BTC</span
                >
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            v-if="
              payment.status === PaymentStatus.PROCESSING ||
              payment.status ===
                PaymentStatus.CONFIRMATION_PENDING
            "
            class="flex-1"
            @click="checkPaymentStatus"
          >
            <template #icon>
              <ArrowRight class="w-4 h-4" />
            </template>
            Check Status
          </Button>

          <!-- Check Status Button -->
          <Button
            v-if="payment.status === PaymentStatus.SUCCESS"
            as="NuxtLink"
            to="/analytics"
            class="flex-1"
          >
            <template #icon>
              <ArrowRight class="w-4 h-4" />
            </template>
            Go to Analytics
          </Button>

          <Button
            v-if="
              payment.status === PaymentStatus.EXPIRED ||
              payment.status === PaymentStatus.CANCELLED
            "
            as="NuxtLink"
            to="/premium"
            class="flex-1"
          >
            <template #icon>
              <Plus class="w-4 h-4" />
            </template>
            Create New Payment
          </Button>

          <Button
            variant="outline"
            as="NuxtLink"
            to="/premium"
            class="flex-1"
          >
            <template #icon>
              <ArrowLeft class="w-4 h-4" />
            </template>
            Back to Plans
          </Button>
        </div>

        <!-- Payment History Link -->
        <div class="text-center">
          <Button
            variant="ghost"
            as="NuxtLink"
            to="/payments"
          >
            <template #icon>
              <History class="w-4 h-4" />
            </template>

            View All Payments
          </Button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from '#imports';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Bitcoin,
  Copy,
  ArrowRight,
  ArrowLeft,
  Plus,
  History,
} from 'lucide-vue-next';
import { useTimestamp, useCssVar } from '@vueuse/core';
import { toString as renderQRCode } from 'qrcode';

import type { Payment } from '#server/db/entities';
import { PaymentStatus } from '#shared/consts/payments';
import { getPremiumPlan } from '#shared/consts/premium-plans';
import Button from '@/components/ui/Button.vue';
import Container from '@/components/ui/Container.vue';
import { useToast } from '@/components/ui/toast';

definePageMeta({
  middleware: 'auth',
});

const $route = useRoute();
const $toast = useToast();

const {
  data: payment,
  pending,
  error,
  refresh: refreshPayment,
} = await useFetch<Payment>(
  `/api/payments/${$route.params.id}`,
  {
    credentials: 'include',
  },
);

const {
  timestamp,
  pause: pauseTimestamp,
  resume: resumeTimestamp,
} = useTimestamp({
  immediate: false,
  controls: true,

  interval: 1e3,
});

// Reactive state
const qrCode = ref('');
const qrCodeBgColor = useCssVar('--background');
const qrCodeFgColor = useCssVar('--primary');

function hslToHex(hslString: string) {
  let [h = 0, s = 0, l = 0] = hslString
    .match(/\d+/g)!
    .map(Number);

  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color =
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

async function generateQRCode(newBitcoinAddress?: string) {
  if (!newBitcoinAddress) return;

  qrCode.value = await renderQRCode(newBitcoinAddress, {
    type: 'svg',
    margin: 0,
    color: {
      light: hslToHex(qrCodeBgColor.value!),
      dark: hslToHex(qrCodeFgColor.value!),
    },
  });

  console.log(qrCode.value);
}

watch(
  () => payment.value?.bitcoinAddress,
  async (newBitcoinAddress) => {
    qrCode.value = '';

    await generateQRCode(newBitcoinAddress);
  },
);

// Status configuration
const statusConfig = computed(() => {
  if (!payment.value) return null;

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
      class:
        'bg-yellow-200/20 text-yellow-200 animate-spin',
    },
    [PaymentStatus.SUCCESS]: {
      icon: CheckCircle,
      title: 'Payment Successful',
      description:
        'Your premium subscription is now active',
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

  return configs[payment.value.status] || {};
});

// Plan title
const planTitle = computed(() => {
  if (!payment.value) return '';
  const plan = getPremiumPlan(payment.value.plan);

  return plan?.title || 'Premium Plan';
});

const remainingTimeInMilliseconds = computed(() => {
  if (!payment.value) return 0;

  const diff =
    new Date(payment.value.expiresAt).getTime() -
    timestamp.value;

  return diff;
});

const overallRemainingTimeInMilliseconds = computed(() => {
  if (!payment.value) return 0;

  return (
    new Date(payment.value.expiresAt).getTime() -
    new Date(payment.value.createdAt).getTime()
  );
});

const remainingTimePercentage = computed(() => {
  if (
    !remainingTimeInMilliseconds.value ||
    !overallRemainingTimeInMilliseconds.value
  )
    return 0;

  return (
    (1 -
      remainingTimeInMilliseconds.value /
        overallRemainingTimeInMilliseconds.value) *
    100
  );
});

const formatedRemainingTime = computed(() => {
  if (!remainingTimeInMilliseconds.value) return '';

  const minutes = Math.floor(
    remainingTimeInMilliseconds.value / (60 * 1000),
  );
  const seconds = Math.floor(
    (remainingTimeInMilliseconds.value % (60 * 1000)) /
      1000,
  );

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

watch(remainingTimeInMilliseconds, () => {
  if (remainingTimeInMilliseconds.value <= 0) {
    stopCountdown();

    if (
      payment.value?.status === PaymentStatus.PROCESSING ||
      payment.value?.status ===
        PaymentStatus.CONFIRMATION_PENDING
    ) {
      payment.value.status = PaymentStatus.EXPIRED;
    }
  }
});

// Format date helper
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};

// Copy address function
const copyAddress = async () => {
  if (!payment.value) return;

  try {
    await navigator.clipboard.writeText(
      payment.value.bitcoinAddress,
    );

    $toast.toast({
      title: 'Copied!',
      description: 'Bitcoin address copied to clipboard',
    });
  } catch {
    $toast.toast({
      title: 'Failed to copy',
      description: 'Please copy the address manually',
      variant: 'destructive',
    });
  }
};

// Check payment status
const checkPaymentStatus = async () => {
  if (!payment.value) return;

  try {
    await refreshPayment();

    if (error.value) throw error.value;

    $toast.toast({
      title: 'Status Updated',
      description: 'Payment status has been refreshed',
    });
  } catch (error: any) {
    $toast.toast({
      title: 'Update Failed',
      description:
        error.data?.message ||
        'Failed to check payment status',
      variant: 'destructive',
    });
  }
};

// Timer for processing payments
const startCountdown = () => {
  if (
    !payment.value ||
    !(
      payment.value.status === PaymentStatus.PROCESSING ||
      payment.value.status ===
        PaymentStatus.CONFIRMATION_PENDING
    )
  )
    return;

  resumeTimestamp();
};

const stopCountdown = () => {
  pauseTimestamp();
};

// Lifecycle
onMounted(() => {
  startCountdown();

  generateQRCode(payment.value?.bitcoinAddress);
});

onUnmounted(() => {
  stopCountdown();
});
</script>
