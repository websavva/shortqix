<template>
  <div class="space-y-6">
    <SizeTransition
      singular
      concurrent
      :fade-config="{ duration: 250 }"
      :size-config="{ duration: 200 }"
    >
      <PremiumBannerUpgrade v-if="!isPremium" />

      <div
        v-else-if="pending"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCardPlaceholder
          v-for="n in 3"
          :key="n"
        />
      </div>

      <Error
        v-else-if="error"
        :error-message="
          error.data?.message || 'Failed to load analytics'
        "
        :pending="pending"
        @retry="fetchStats"
      />

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <StatCard
          title="Total URLs"
          :value="stats!.totalUrls"
          description="Shortened links created"
          :icon="Link"
        />

        <StatCard
          title="Total Clicks"
          :value="stats!.totalClicks"
          description="All-time link clicks"
          :icon="MousePointer"
        />

        <StatCard
          title="Avg. Clicks"
          :value="stats!.averageClicks"
          description="Per shortened link"
          :icon="TrendingUp"
        />
      </div>
    </SizeTransition>
  </div>
</template>

<script setup lang="ts">
import {
  Link,
  MousePointer,
  TrendingUp,
} from 'lucide-vue-next';
import { useAuth, useLazyFetch } from '#imports';

import SizeTransition from '@/components/ui/SizeTransition';

import StatCard from './StatCard.vue';
import StatCardPlaceholder from './StatCardPlaceholder.vue';
import Error from './Error.vue';
import PremiumBannerUpgrade from './PremiumBannerUpgrade.vue';

const { isPremium } = useAuth();

const {
  data: stats,
  pending,
  error,
  execute: fetchStats,
} = await useLazyFetch(`/api/analytics/stats`, {
  credentials: 'include',
  immediate: isPremium.value,
});

// Watch for premium status changes
watch(isPremium, async (newIsPremium) => {
  if (newIsPremium && !stats.value) {
    await fetchStats();
  }
});
</script>
