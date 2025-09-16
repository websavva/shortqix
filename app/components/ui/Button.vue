<template>
  <component
    :is="as"
    :class="
      cn(
        buttonVariants({ variant, size }),
        {
          ['flex-row-reverse']: isIconPositionRight,
        },
        $attrs.class ?? '',
      )
    "
  >
    <SizeTransition
      singular
      concurrent
      :fade-config="{ duration: 250 }"
      :size-config="{ duration: 250 }"
    >
      <div
        v-if="$slots.icon || pending"
        class="grid grid-rows-[auto] grid-cols-[auto] items-center text-[1em] overflow-hidden"
        :class="{
          [isIconPositionRight ? '*:ml-2' : '*:mr-2']:
            $slots.default,
        }"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-[100%]"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-[100%]"
        >
          <LoaderCircle
            v-if="pending"
            class="animate-spin text-current row-start-1 row-end-1 col-start-1 col-end-1"
          />

          <span
            v-else
            class="row-start-1 row-end-1 col-start-1 col-end-1"
          >
            <slot name="icon" />
          </span>
        </Transition>
      </div>
    </SizeTransition>

    <slot />
  </component>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import { cva } from 'class-variance-authority';
import { computed } from '#imports';

import { cn } from '@/utils';

import SizeTransition from './SizeTransition.vue';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-80 disabled:cursor-not-allowed font-bold',
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
  iconPosition?: 'right' | 'left';
}

// eslint-disable-next-line vue/define-macros-order
const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  iconPosition: 'left',
});

const isIconPositionRight = computed(
  () => props.iconPosition === 'right',
);
</script>
