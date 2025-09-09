<template>
  <footer
    :class="
      cn(
        'border-t border-border bg-background',
        $attrs.class ?? '',
      )
    "
  >
    <div class="mx-auto px-4 py-8">
      <div
        class="flex flex-col items-center justify-center gap-4 text-center"
      >
        <div class="flex items-center gap-2">
          <LogoBox
            class="text-primary bg-primary/10 size-8 p-2"
          />

          <span class="font-semibold text-foreground">
            Shortqix
          </span>
        </div>

        <p class="text-muted-foreground">
          Fast, reliable URL shortening service
        </p>

        <p class="text-xs text-muted-foreground">
          © {{ currentYear }} Shortqix. All rights
          reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { cn } from '@/utils';

import LogoBox from './LogoBox.vue';

const currentYear = new Date().getFullYear();
</script>
