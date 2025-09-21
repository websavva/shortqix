<template>
  <div
    class="bg-destructive/10 border border-destructive/20 rounded-lg p-6"
  >
    <div class="flex items-center space-x-3">
      <div
        class="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center"
      >
        <AlertCircle class="w-5 h-5 text-destructive" />
      </div>
      <div>
        <div class="font-semibold text-destructive mb-1">
          Failed to load analytics
        </div>

        <p class="text-sm text-muted-foreground mb-4">
          {{ message }}
        </p>

        <Button
          size="sm"
          variant="outline"
          :pending="pending"
          @click="$emit('retry')"
        >
          Try Again
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';

import Button from '@/components/ui/Button.vue';

interface Props {
  title: string;
  message: string;
  pending?: boolean;
  isRetryable?: boolean;
}

defineProps<Props>();

defineEmits<{
  retry: [];
}>();
</script>
