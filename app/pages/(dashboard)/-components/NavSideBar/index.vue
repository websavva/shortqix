<template>
  <nav
    :class="
      cn(
        'bg-card rounded-xl shadow-sm border border-border overflow-hidden p-4',
        props.class,
      )
    "
  >
    <UserInfo />

    <PremiumStatus class="mt-5" />

    <NavMenu class="pt-5 mt-5 border-t border-muted" />
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
