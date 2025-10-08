<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :class="
      cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        props.class,
      )
    "
  >
    <slot />
  </PaginationListItem>
</template>

<script setup lang="ts">
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { PaginationListItem } from 'reka-ui';
import { reactiveOmit } from '@vueuse/core';

import {
  type ButtonVariants,
  buttonVariants,
} from '@/components/ui/Button.vue';
import { cn } from '@/utils';

const props = withDefaults(
  defineProps<
    PaginationListItemProps & {
      size?: ButtonVariants['size'];
      class?: HTMLAttributes['class'];
      isActive?: boolean;
    }
  >(),
  {
    size: 'icon',
  },
);

const delegatedProps = reactiveOmit(
  props,
  'class',
  'size',
  'isActive',
);
</script>
