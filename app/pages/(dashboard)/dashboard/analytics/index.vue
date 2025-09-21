<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Analytics
      </h1>
      <p class="text-muted-foreground">
        Track your link performance and engagement metrics
      </p>
    </div>

    <!-- Stats Component -->
    <Stats />

    <div class="mt-5">
      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 200 }"
        :size-config="{ duration: 150 }"
      >
        <!-- URLs Table -->
        <UrlsTablePlaceholder v-if="pending" />

        <ErrorPane
          v-else-if="error"
          title="Failed to load URLs"
          :message="
            error?.data?.message || 'Failed to load URLs'
          "
          :pending="pending"
          @retry="fetchUrls"
        />

        <div v-else-if="urlsResponse">
          <UrlsTable :urls="urlsResponse.urls" />

          <Pagination
            v-if="urlsResponse.pagination.count > 1"
            class="mt-5"
            v-bind="urlsResponse.pagination"
            @change="onPageChange"
          />
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

import Stats from './-components/Stats/index.vue';
import UrlsTable from './-components/UrlsTable.vue';
import UrlsTablePlaceholder from './-components/UrlsTablePlaceholder.vue';

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
