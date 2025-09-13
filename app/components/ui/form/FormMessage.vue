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
      class="text-sm ml-2 font-medium text-destructive"
    />
  </SizeTransition>
</template>

<script lang="ts" setup>
import { ErrorMessage } from 'vee-validate';
import { toValue } from 'vue';

import SizeTransition from '@/components/ui/SizeTransition.vue';

import { useFormField } from './useFormField';

const { name, formMessageId, isFormDirty } = useFormField();
</script>
