<template>
  <DialogPortal to="body">
    <DialogOverlay
      class="fixed inset-0 z-50 bg-muted/60 backdrop-blur-[2px] transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full xs:max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 rounded-xl max-xs:rounded-none',
          // Opening animations - slide in from bottom with scale and fade
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=open]:duration-300',
          // Closing animations - slide out to bottom with scale and fade
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=closed]:duration-200',
          // Hover and focus effects
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          props.class,
        )
      "
    >
      <!-- Subtle animated background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-xl opacity-30"
      />

      <!-- Content wrapper -->
      <div class="relative space-y-4">
        <slot />
      </div>

      <!-- Enhanced close button -->
      <DialogClose
        class="absolute right-4 top-4 rounded-lg p-2 opacity-70 ring-offset-background transition-all duration-200 hover:opacity-100 hover:bg-accent/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground group"
      >
        <X
          class="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
        />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>

<script setup lang="ts">
import type {
  DialogContentEmits,
  DialogContentProps,
} from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from 'reka-ui';

import { cn } from '@/utils';

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes['class'] }
>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(
  delegatedProps,
  emits,
);
</script>
