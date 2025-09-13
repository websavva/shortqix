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
      <div class="relative">
        <div
          class="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-inner"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex-shrink-0 size-2 bg-green-500 rounded-full animate-pulse"
            ></div>
            <code
              class="text-sm font-mono text-foreground flex-1 truncate"
            >
              {{ url }}
            </code>
          </div>
        </div>

        <!-- Copy Button -->
        <Button
          class="absolute -right-2 -top-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          size="sm"
          type="button"
          @click="copyToClipboard"
        >
          <template #icon>
            <CopyIcon class="w-4 h-4" />
          </template>
          
          Copy Link
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyIcon, CheckIcon } from 'lucide-vue-next';

import Button from '@/components/ui/Button.vue';
import { useToast } from '@/components/ui/toast';

const $toast = useToast();

const props = defineProps<{
  url: string;
}>();

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
