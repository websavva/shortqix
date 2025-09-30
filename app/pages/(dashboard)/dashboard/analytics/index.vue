<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <Heading>
      <template #title> Analytics </template>

      <template #description>
        Track your link performance and engagement metrics
      </template>
    </Heading>

    <!-- Stats Component -->
    <Stats />

    <div class="mt-5">
      <SizeTransition
        singular
        concurrent
        height-only
        :fade-config="{ duration: 200 }"
        :size-config="{ duration: 200 }"
      >
        <!-- URLs Table -->
        <TablePlaceholder v-if="pending" />

        <ErrorPane
          v-else-if="error"
          title="Failed to load URLs"
          :message="
            error?.data?.message || 'Failed to load URLs'
          "
          :pending="pending"
          @retry="fetchUrls"
        />

        <div v-else-if="urlsResponse && urlsResponse.urls.length > 0">
          <UrlsTable :urls="urlsResponse.urls" />

          <Pagination
            v-if="urlsResponse.pagination.count > 1"
            class="mt-5"
            v-bind="urlsResponse.pagination"
            @change="onPageChange"
          />
        </div>

        <div v-else>
          <p class="text-muted-foreground">
            No URLs found
          </p>
        </div>
      </SizeTransition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useLazyFetch,
  useRouter,
  useRoute,
} from '#imports';

import ErrorPane from '@/components/ErrorPane.vue';
import SizeTransition from '@/components/ui/SizeTransition';
import Pagination from '@/components/ui/pagination/Pagination.vue';
import { PaginationParamsSchema } from '#shared/dtos/pagination';
import TablePlaceholder from '@/components/ui/table/TablePlaceholder.vue';

import Heading from '../-components/Heading.vue';

import Stats from './-components/Stats/index.vue';
import UrlsTable from './-components/UrlsTable.vue';

const $router = useRouter();
const $route = useRoute();

const query = computed(() =>
  PaginationParamsSchema.parse($route.query),
);

const {
  data: urlsResponse,
  pending,
  error,
  execute: fetchUrls,
} = await useLazyFetch('/api/analytics/urls', {
  credentials: 'include',
  query,
  // temporary enforced delay for smooth animation
  transform: (response) => sleep(500).then(() => response),
});

function onPageChange(page: number) {
  $router.push({
    query: {
      ...$route.query,
      page,
    },
  });
}
</script>
