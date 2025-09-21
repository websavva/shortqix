<template>
  <div
    :class="
      cn(
        'bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20',
        props.class,
      )
    "
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Zap class="w-4 h-4 text-primary" />

        <span
          class="text-sm font-medium text-card-foreground"
        >
          {{ isPremium ? 'Premium Active' : 'Free Plan' }}
        </span>
      </div>
      <div
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="{
          'bg-primary text-primary-foreground': isPremium,
          'bg-muted text-muted-foreground': !isPremium,
        }"
      >
        {{ isPremium ? 'Active' : 'Upgrade' }}
      </div>
    </div>
    <p class="text-xs text-muted-foreground mt-1">
      {{
        isPremium
          ? `Expires ${timeAgo(user!.premiumExpiresAt!)}`
          : 'Unlock premium features'
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Zap } from 'lucide-vue-next';
import { useAuth } from '#imports';

import { timeAgo } from '#shared/utils/time-ago';
import { cn } from '@/utils';

const { isPremium, user } = useAuth();

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>
