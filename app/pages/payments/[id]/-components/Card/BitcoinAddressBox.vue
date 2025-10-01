<template>
  <div
    :class="
      cn(
        'bg-gradient-to-b from-primary/0 from-20% to-primary/20 rounded-xl border border-border p-6',
        props.class,
      )
    "
  >
    <div class="flex items-center gap-3 mb-4">
      <div
        class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
      >
        <Bitcoin class="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground">
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
      >
        Bitcoin Address
      </label>
      <div
        class="flex items-center gap-2 p-3 bg-muted rounded-lg"
      >
        <code
          class="flex-1 text-sm font-mono text-foreground break-all"
        >
          {{ props.address }}
        </code>
        <Button
          size="sm"
          variant="outline"
          class="flex-shrink-0"
          @click="copyAddress"
        >
          <Copy class="size-4" />

          <span class="max-sm:hidden ml-2">Copy</span>
        </Button>
      </div>

      <div class="text-center">
        <p class="text-sm text-muted-foreground">
          Send exactly
          <span class="font-semibold text-foreground">
            {{ props.amount }} BTC
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Bitcoin, Copy } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useCssVar } from '@vueuse/core';
import { toString as renderQRCode } from 'qrcode';

import { hslToHex, cn } from '@/utils';
import { useToast } from '@/components/ui/toast';
import Button from '@/components/ui/Button.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  address: string;
  amount: number | string;
}>();

const $toast = useToast();

// Reactive state
const qrCode = ref('');
const qrCodeBgColor = useCssVar('--background');
const qrCodeFgColor = useCssVar('--primary');

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
}

watch(
  () => props.address,
  async (newBitcoinAddress) => {
    qrCode.value = '';

    await generateQRCode(newBitcoinAddress);
  },
);

// Copy address function
const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(props.address);

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

onMounted(() => {
  generateQRCode(props.address);
});
</script>
