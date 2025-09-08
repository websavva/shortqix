<template>
  <form
    class="flex items-center rounded-lg border border-2 border-input focus-within:ring-2 focus-within:ring-ring transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md h-13"
    @submit.prevent="onSubmit"
  >
    <Input
      v-model="url"
      :disabled="pending"
      placeholder="Enter your long URL here"
      class="border-0 rounded-none focus-visible:ring-0 flex-1 bg-transparent h-full"
    />

    <Button
      :pending
      class="rounded-none h-full border-0 shadow-none cursor-pointer text-xl"
    >
      <template #icon>
        <ArrowRight />
      </template>
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { ref } from '#imports';

import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const url = ref('');
const pending = ref(false);

function onSubmit() {
  pending.value = !pending.value;
}
</script>
