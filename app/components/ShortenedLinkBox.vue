<template>
  <div
    class="p-6 bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-xl border border-primary/20 shadow-lg backdrop-blur-sm"
  >
    <div class="text-center space-y-4">
      <!-- Success Icon -->
      <div
        class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
      >
        <CheckIcon class="size-6 text-primary" />
      </div>

      <!-- Title -->
      <div>
        <h3
          class="text-lg font-semibold text-foreground mb-1"
        >
          Link Shortened Successfully!
        </h3>
        <p class="text-sm text-muted-foreground">
          Your shortened URL is ready to share
        </p>
      </div>

      <!-- URL Display -->
      <div class="space-y-3">
        <div
          class="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-inner"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 size-2 bg-green-500 rounded-full animate-pulse"
            ></div>
            <code
              class="text-sm font-mono text-foreground flex-1 break-all"
            >
              {{ url }}
            </code>
          </div>
        </div>

        <!-- QR Code -->
        <div class="flex justify-center py-3">
          <div
            class="p-3 rounded-lg shadow-sm border bg-background"
          >
            <div
              class="size-40 flex items-center justify-center"
            >
              <div
                v-if="!qrCodeDataUrl"
                class="size-full bg-muted rounded-lg animate-pulse"
              />

              <img
                v-else
                :src="qrCodeDataUrl"
                alt="QR Code"
                class="size-full"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex justify-center gap-2 flex-col xs:w-xs mx-auto"
        >
          <!-- Copy Button -->
          <Button
            type="button"
            @click="copyToClipboard"
          >
            <template #icon>
              <CopyIcon />
            </template>

            Copy Link
          </Button>

          <!-- Download QR Code Button -->
          <SizeTransition
            singular
            concurrent
            :fade-config="{ duration: 250 }"
            :size-config="{ duration: 250 }"
          >
            <Button
              v-if="qrCodeDataUrl"
              variant="secondary"
              type="button"
              @click="downloadQRCode"
            >
              <template #icon>
                <DownloadIcon />
              </template>
              Download QR
            </Button>
          </SizeTransition>

          <!-- Share Button (Web Share API) -->
          <Button
            v-if="canShare"
            variant="outline"
            :pending="isSharing"
            type="button"
            @click="shareUrl"
          >
            <template #icon>
              <ShareIcon />
            </template>
            Share
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import QRCode from 'qrcode';
import {
  CopyIcon,
  CheckIcon,
  ShareIcon,
  DownloadIcon,
} from 'lucide-vue-next';
import { useLogger } from '#imports';

import Button from '@/components/ui/Button.vue';
import { useToast } from '@/components/ui/toast';
import palette from '#shared/consts/palette.json';
import SizeTransition from '@/components/ui/SizeTransition';
import { hslToHex } from '#shared/utils/hsl-to-hex';

const props = defineProps<{
  url: string;
  code?: string;
  title?: string;
  text?: string;
}>();

const $toast = useToast();
const $logger = useLogger();

// State
const isSharing = ref(false);
const canShare = ref(false);

const qrCodeDataUrl = ref<string>('');

// Check if Web Share API is available and generate QR code
onMounted(async () => {
  canShare.value = 'share' in navigator;
  await generateQRCode();
});

watch(
  () => props.url,
  async () => {
    await generateQRCode();
  },
);

// Generate QR code
async function generateQRCode() {
  try {
    const qrDataUrl = await QRCode.toDataURL(props.url, {
      width: 320,
      margin: 2,
      color: {
        dark: hslToHex(palette.primary),
        light: hslToHex(palette.background),
      },
    });

    qrCodeDataUrl.value = qrDataUrl;
  } catch (error) {
    $toast.toast({
      title: 'Failed to generate QR code',
      description: 'Please try again.',
    });
  }
}

// Share using Web Share API
async function shareUrl() {
  if (!canShare.value) return;

  isSharing.value = true;

  try {
    const shareData = {
      title: props.title || 'Check out this shortened link',
      text: props.text || 'I found this interesting link',
      url: props.url,
    };

    await navigator.share(shareData);

    $toast.toast({
      title: 'Shared successfully!',
      description:
        "The link has been shared using your device's native sharing.",
    });
  } catch (error) {
    // User cancelled sharing or error occurred
    if (
      error instanceof Error &&
      error.name !== 'AbortError'
    ) {
      $toast.toast({
        title: 'Share failed',
        description:
          'Unable to share the link. Please try copying it instead.',
      });
    }
  } finally {
    isSharing.value = false;
  }
}

// Copy to clipboard function
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.url);
    $toast.toast({
      title: 'Copied to clipboard!',
      description: 'The shortened URL has been copied.',
    });
  } catch {
    $toast.toast({
      title: 'Failed to copy',
      description: 'Please copy the URL manually.',
    });
  }
}

// Download QR code
function downloadQRCode() {
  if (!qrCodeDataUrl.value) return;

  try {
    const link = document.createElement('a');
    link.download = `${process.env.SQX_APP_NAME!.toLowerCase()}-qr-code${props.code ? `-${props.code}` : ''}.png`;
    link.href = qrCodeDataUrl.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    $toast.toast({
      title: 'QR code downloaded!',
      description:
        'The QR code has been saved to your downloads.',
    });
  } catch (error) {
    $logger.error('Failed to download QR code:', error);
    $toast.toast({
      title: 'Download failed',
      description: 'Unable to download the QR code.',
      variant: 'destructive',
    });
  }
}
</script>
