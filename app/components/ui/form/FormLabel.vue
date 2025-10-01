<template>
  <Label
    :class="cn(error && 'text-destructive', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>

<script lang="ts" setup>
import type { LabelProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { cn } from '@/utils';
import Label from '@/components/ui/Label.vue';

import { useFormField } from './useFormField';

const props = defineProps<
  LabelProps & { class?: HTMLAttributes['class'] }
>();

const { error, formItemId } = useFormField();
</script>
