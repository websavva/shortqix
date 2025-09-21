<template>
  <div
    :class="
      cn('flex items-center space-x-3', props.class)
    "
  >
    <div
      class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
    >
      <span
        class="text-primary-foreground font-semibold text-lg"
      >
        {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
      </span>
    </div>
    <div class="flex-1 min-w-0">
      <p
        class="text-sm font-medium text-card-foreground truncate"
      >
        {{ user?.email || 'User' }}
      </p>
      <p class="text-xs text-muted-foreground">
        {{
          user?.createdAt
            ? `Joined ${timeAgo(user.createdAt)}`
            : 'Member'
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useAuth } from '#imports';

import { timeAgo } from '#shared/utils/time-ago';
import { cn } from '@/utils';

const { user } = useAuth();

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>
