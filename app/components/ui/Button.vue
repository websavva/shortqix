<template>
  <component
    :is="as"
    :class="derivedClassName"
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
        <RollTransition>
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
        </RollTransition>
      </div>
    </SizeTransition>

    <slot />
  </component>
</template>

<script lang="ts">
import { LoaderCircle } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';
import {
  cva,
  type VariantProps,
} from 'class-variance-authority';
import { computed, defineComponent } from '#imports';

import { cn } from '@/utils';

import SizeTransition from './SizeTransition';
import RollTransition from './RollTransition';

export const buttonVariants = cva(
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

export type ButtonVariants = VariantProps<
  typeof buttonVariants
>;

export default defineComponent({
  components: {
    LoaderCircle,
    SizeTransition,
    RollTransition,
  },

  props: {
    class: {
      type: String as PropType<HTMLAttributes['class']>,
      default: '',
    },

    variant: {
      type: String as PropType<
        NonNullable<
          Parameters<typeof buttonVariants>[0]
        >['variant']
      >,
      default: 'default',
    },

    size: {
      type: String as PropType<
        NonNullable<
          Parameters<typeof buttonVariants>[0]
        >['size']
      >,
      default: 'default',
    },

    as: {
      type: String,
      default: 'button',
    },

    pending: Boolean,

    disabled: Boolean,

    iconPosition: {
      type: String as PropType<'right' | 'left'>,
      default: 'left',
    },
  },

  setup(props) {
    const isIconPositionRight = computed(
      () => props.iconPosition === 'right',
    );

    const derivedClassName = computed(() =>
      cn(
        buttonVariants({
          variant: props.variant,
          size: props.size,
        }),
        {
          ['flex-row-reverse']: isIconPositionRight.value,
        },
        props.class,
      ),
    );

    return {
      isIconPositionRight,
      buttonVariants,
      cn,
      derivedClassName,
    };
  },
});
</script>
