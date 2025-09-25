<template>
  <div
    class="bg-card border border-border rounded-lg overflow-hidden"
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Bitcoin Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <!-- <TableHead>Expires</TableHead> -->
          <TableHead class="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="payment in payments"
          :key="payment.id"
          class="hover:bg-accent/50 transition-colors"
        >
          <TableCell>
            <div class="flex items-center space-x-2">
              <Zap class="w-4 h-4 text-primary" />
              <span class="font-medium">
                {{
                  getPremiumPlan(payment.plan)?.title ||
                  'Unknown'
                }}
              </span>
            </div>
          </TableCell>

          <TableCell>
            <div class="space-y-1">
              <div class="font-mono text-sm font-medium">
                ${{ payment.amountUsd }}
              </div>
              <div
                class="text-xs text-muted-foreground font-mono"
              >
                {{ payment.amountBtc }} BTC
              </div>
            </div>
          </TableCell>

          <TableCell>
            <div class="flex items-center space-x-2">
              <code
                class="text-xs font-mono bg-muted px-2 py-1 rounded max-w-32 truncate"
              >
                {{ payment.bitcoinAddress }}
              </code>

              <Button
                size="sm"
                variant="ghost"
                @click="
                  copyToClipboard(payment.bitcoinAddress)
                "
              >
                <Copy class="w-3 h-3" />
              </Button>
            </div>
          </TableCell>

          <TableCell>
            <div class="flex items-center space-x-2">
              <PaymentStatusBadge
                :status="payment.status"
              />
            </div>
          </TableCell>

          <TableCell>
            <div class="text-sm text-muted-foreground">
              <NuxtTime :datetime="payment.createdAt" />
            </div>
          </TableCell>

          <!-- <TableCell>
            <SizeTransition
              singular
              concurrent
              :fade-config="{ duration: 200 }"
              :size-config="{ duration: 200 }"
            >
              <NuxtTime
                v-if="shouldShowExpiresAt(payment.status)"
                :datetime="payment.expiresAt"
                relative
                class="block"
              />

              <div v-else class="block">&mdash;</div>
            </SizeTransition>
          </TableCell> -->

          <TableCell>
            <div class="flex items-center">
              <Button
                as="NuxtLink"
                :to="`/payments/${payment.id}`"
                size="sm"
                variant="ghost"
              >
                <template #icon>
                  <Eye />
                </template>
              </Button>

              <SizeTransition
                singular
                concurrent
                :fade-config="{ duration: 50 }"
                :size-config="{ duration: 100 }"
              >
                <div
                  v-if="
                    isPaymentWaitingForConfirmation(
                      payment.status,
                    )
                  "
                  class="overflow-hidden"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    :pending="
                      cancellingPaymentId === payment.id
                    "
                    @click="cancelPayment(payment.id)"
                  >
                    <template #icon>
                      <X />
                    </template>
                  </Button>
                </div>
              </SizeTransition>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Zap, Copy, X, Eye } from 'lucide-vue-next';
import type { InternalApi } from 'nitropack/types';
import { NuxtTime } from '#components';

import { useToast } from '@/components/ui/toast';
import PaymentStatusBadge from '@/components/PaymentStatusBadge.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Button from '@/components/ui/Button.vue';
import { getPremiumPlan } from '#shared/consts/premium-plans';
import {
  PaymentStatus,
  isPaymentWaitingForConfirmation,
} from '#shared/consts/payments';
import SizeTransition from '@/components/ui/SizeTransition';

type SerializedPayment =
  InternalApi['/api/payments']['default']['payments'][number];

defineProps<{
  payments: SerializedPayment[];
  cancellingPaymentId?: string | null;
}>();

// Emits
const emit = defineEmits<{
  cancel: [paymentId: string];
}>();

// State
const $toast = useToast();

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    $toast.toast({
      title: 'Copied!',
      description: 'Bitcoin address copied to clipboard.',
    });
  } catch (error) {
    console.error('Failed to copy:', error);
    $toast.toast({
      title: 'Copy failed',
      description: 'Please copy the address manually.',
    });
  }
}

async function cancelPayment(paymentId: string) {
  emit('cancel', paymentId);
}

function shouldShowExpiresAt(
  status: PaymentStatus,
): boolean {
  return (
    isPaymentWaitingForConfirmation(status) ||
    status === PaymentStatus.EXPIRED
  );
}
</script>
