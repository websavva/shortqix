<template>
  <SizeTransition
    singular
    :fade-config="{ duration: 50 }"
    :size-config="{ duration: 50 }"
  >
    <ErrorMessage
      v-if="isFormDirty"
      :id="formMessageId"
      as="p"
      :name="toValue(name)"
      :class="
        cn(
          'text-sm ml-2 font-medium text-destructive',
          props.class,
        )
      "
    />
  </SizeTransition>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';

import { cn } from '@/utils';
import SizeTransition from '@/components/ui/SizeTransition';

import { useFormField } from './useFormField';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { name, formMessageId, isFormDirty } = useFormField();
</script>
