<template>
  <div
    class="bg-destructive/10 border border-destructive/20 rounded-lg p-6"
  >
    <div class="flex space-x-3">
      <div
        class="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center"
      >
        <AlertCircle
          class="w-5 h-5 text-destructive"
          data-test-id="alert-circle"
        />
      </div>
      <div>
        <div
          class="font-semibold text-destructive mb-1"
          data-test-id="title"
        >
          {{ title }}
        </div>

        <p
          class="text-sm text-muted-foreground"
          data-test-id="message"
        >
          {{ message }}
        </p>

        <Button
          v-if="isRetryable"
          size="sm"
          variant="outline"
          :pending="pending"
          class="mt-4"
          data-test-id="retry-button"
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
import { Button } from '#components';

interface Props {
  title: string;
  message: string;
  pending?: boolean;
  isRetryable?: boolean;
}

withDefaults(defineProps<Props>(), {
  isRetryable: true,
});

defineEmits<{
  retry: [];
}>();
</script>
