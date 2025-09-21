<template>
  <div :class="cn(props.class)">
    <div
      class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4"
    >
      Navigation
    </div>

    <div class="space-y-2">
      <Button
        v-for="{
          label,
          icon,
          to,
          description,
        } in menuItems"
        :key="to"
        :to="to"
        variant="ghost"
        size="lg"
        as="NuxtLink"
        class="w-full justify-start h-auto p-3 group hover:bg-accent transition-all duration-200"
        :class="{
          'bg-accent text-primary': $route.path === to,
          'text-card-foreground': $route.path !== to,
        }"
      >
        <div class="flex items-center space-x-3">
          <div
            class="p-2 rounded-lg transition-colors duration-200"
            :class="{
              'bg-primary/10 text-primary':
                $route.path === to,
              'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary':
                $route.path !== to,
            }"
          >
            <Component
              :is="icon"
              class="w-4 h-4"
            />
          </div>

          <div class="flex flex-col items-start">
            <span class="font-medium text-sm">{{
              label
            }}</span>
            <span
              class="text-xs transition-colors duration-200"
              :class="{
                'text-primary/70': $route.path === to,
                'text-muted-foreground group-hover:text-primary/70':
                  $route.path !== to,
              }"
            >
              {{ description }}
            </span>
          </div>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { LineChart, Zap, Coins } from 'lucide-vue-next';

import Button from '@/components/ui/Button.vue';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const menuItems = [
  {
    label: 'Analytics',
    icon: LineChart,
    to: '/dashboard/analytics',
    description: 'View link performance',
  },
  {
    label: 'Premium',
    icon: Zap,
    to: '/dashboard/premium',
    description: 'Upgrade features',
  },
  {
    label: 'Payments',
    icon: Coins,
    to: '/dashboard/payments',
    description: 'Manage subscriptions',
  },
];
</script>
