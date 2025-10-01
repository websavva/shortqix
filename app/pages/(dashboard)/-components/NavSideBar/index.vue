<template>
  <nav
    :class="
      cn(
        'bg-card rounded-lg sm:rounded-xl shadow-sm border border-border overflow-hidden p-3 sm:p-4',
        'lg:flex lg:flex-col',
        'max-lg:flex max-lg:flex-col max-lg:space-y-4',
        props.class,
      )
    "
  >
    <!-- Mobile: Horizontal layout -->
    <div
      class="lg:hidden flex sm:items-center justify-between max-sm:flex-col max-sm:gap-4"
    >
      <UserInfo />

      <PremiumStatus />
    </div>

    <!-- Desktop: Vertical layout -->
    <div class="hidden lg:block">
      <UserInfo />
      <PremiumStatus class="mt-5" />
    </div>

    <!-- Navigation Menu -->
    <NavMenu
      :class="
        cn(
          'pt-4 mt-4 border-t border-muted',
          'lg:pt-5 lg:mt-5',
        )
      "
    />
  </nav>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@/utils';

import UserInfo from './UserInfo.vue';
import PremiumStatus from './PremiumStatus.vue';
import NavMenu from './NavMenu.vue';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>
