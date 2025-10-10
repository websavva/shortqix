<template>
  <Dialog v-model:open="compOpened">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Premium Plan Purchase</DialogTitle>

        <DialogDescription class="mt-5">
          Do you want to purchase a premium plan?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="mt-5">
        <Button
          :pending
          @click="onConfirm"
        >
          Purchase
        </Button>

        <Button
          variant="outline"
          :disabled="pending"
          @click="onCancel"
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from '#imports';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from '#components';

const props = defineProps<{
  pending?: boolean;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'confirm', onSuccess: () => void): void;
}>();

const compOpened = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

function onConfirm() {
  emit('confirm', () => {
    compOpened.value = false;
  });
}

function onCancel() {
  compOpened.value = false;
}
</script>
