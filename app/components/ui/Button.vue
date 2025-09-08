<template>
  <component
    :is="as"
    :class="
      cn(
        buttonVariants({ variant, size }),
        $attrs.class ?? '',
      )
    "
    :disabled="pending || $attrs.disabled"
  >
    <div
      v-if="$slots.icon || pending"
      class="flex items-center text-[1em]"
      :class="{
        ['mr-2']: $slots.default,
      }"
    >
      <LoaderCircle
        v-if="pending"
        class="animate-spin text-current"
      />

      <span v-else>
        <slot name="icon" />
      </span>
    </div>

    <slot />
  </component>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-80 disabled:cursor-not-allowed font-bold',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface Props {
  variant?: NonNullable<
    Parameters<typeof buttonVariants>[0]
  >['variant'];
  size?: NonNullable<
    Parameters<typeof buttonVariants>[0]
  >['size'];
  as?: string;
  pending?: boolean;
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
  as: 'button',
});
</script>
