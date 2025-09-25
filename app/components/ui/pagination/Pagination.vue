<template>
  <PaginationBase
    v-slot="{ page }"
    :page="props.page"
    :items-per-page="props.limit"
    :total="props.totalCount"
    :default-page="1"
    :class="props.class"
    :show-edges="true"
    :sibling-count="1"
    @update:page="onPageChange"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />

      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>

        <PaginationEllipsis
          v-else-if="item.type === 'ellipsis'"
        />
      </template>

      <PaginationNext />
    </PaginationContent>
  </PaginationBase>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import type { PaginationMetadata } from '#shared/dtos/pagination';

import PaginationBase from './PaginationBase.vue';
import PaginationContent from './PaginationContent.vue';
import PaginationEllipsis from './PaginationEllipsis.vue';
import PaginationItem from './PaginationItem.vue';
import PaginationNext from './PaginationNext.vue';
import PaginationPrevious from './PaginationPrevious.vue';

const props = defineProps<
  Pick<
    PaginationMetadata,
    'page' | 'limit' | 'totalCount'
  > & {
    class?: HTMLAttributes['class'];
  }
>();

const emit = defineEmits<{
  change: [value: number];
}>();

defineOptions({
  inheritAttrs: false,
});

const onPageChange = (value: number) => {
  emit('change', value);
};
</script>
