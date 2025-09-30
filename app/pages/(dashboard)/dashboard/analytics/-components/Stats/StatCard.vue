<template>
  <div
    class="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
  >
    <div class="flex sm:items-center justify-between">
      <div>
        <p
          class="text-sm font-medium text-muted-foreground mb-2"
        >
          {{ title }}
        </p>
        <p class="text-3xl font-bold text-foreground">
          {{ formattedValue }}
        </p>
        <p class="text-xs text-muted-foreground mt-1">
          {{ description }}
        </p>
      </div>
      <div
        class="size-12 max-sm:size-10 bg-primary/10 rounded-lg flex items-center justify-center"
      >
        <component
          :is="icon"
          class="size-1/2 text-primary"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

import { spaceNumber } from '#shared/utils/space-number';

interface Props {
  title: string;
  value: number;
  description: string;
  icon: Component;
}

const props = defineProps<Props>();
const formattedValue = computed(() =>
  spaceNumber(props.value),
);
</script>
