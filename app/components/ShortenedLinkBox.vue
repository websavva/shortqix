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

        <!-- Action Buttons -->
        <div
          class="flex justify-center gap-2 max-xs:flex-col"
        >
          <!-- Share Button (Web Share API) -->
          <Button
            v-if="canShare"
            variant="secondary"
            :pending="isSharing"
            type="button"
            @click="shareUrl"
          >
            <template #icon>
              <ShareIcon />
            </template>
            Share
          </Button>

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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  CopyIcon,
  CheckIcon,
  ShareIcon,
} from 'lucide-vue-next';

import Button from '@/components/ui/Button.vue';
import { useToast } from '@/components/ui/toast';

const props = defineProps<{
  url: string;
  title?: string;
  text?: string;
}>();

const $toast = useToast();

// State
const isSharing = ref(false);
const canShare = ref(false);

// Check if Web Share API is available
onMounted(() => {
  canShare.value = 'share' in navigator;
});

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
        variant: 'destructive',
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
</script>
