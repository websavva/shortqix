<template>
  <div
    :class="
      cn(
        'bg-card border border-border rounded-xl p-6',
        props.class,
      )
    "
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="{
            'bg-primary/10 text-primary': isPremium,
            'bg-muted text-muted-foreground': !isPremium,
          }"
        >
          <Zap class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-foreground">
            {{ isPremium ? 'Premium Active' : 'Free Plan' }}
          </h2>
          <p
            class="text-sm text-muted-foreground max-xs:text-xs"
          >
            {{
              isPremium && user?.premiumExpiresAt
                ? `Expires ${timeAgo(user.premiumExpiresAt)}`
                : 'Upgrade to unlock premium features'
            }}
          </p>
        </div>
      </div>
      <div
        class="px-3 py-1 rounded-full text-sm font-medium max-sm:hidden"
        :class="{
          'bg-primary text-primary-foreground': isPremium,
          'bg-muted text-muted-foreground': !isPremium,
        }"
      >
        {{ isPremium ? 'Active' : 'Free' }}
      </div>
    </div>

    <!-- Premium Features List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <h3 class="font-medium text-foreground mb-3">
          Premium Features
        </h3>
        <div class="space-y-2">
          <div
            v-for="feature in features"
            :key="feature"
            class="flex items-center space-x-2"
          >
            <Check
              class="w-4 h-4"
              :class="
                isPremium
                  ? 'text-primary'
                  : 'text-muted-foreground'
              "
            />
            <span
              class="text-sm"
              :class="
                isPremium
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              "
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <h3 class="font-medium text-foreground mb-3">
          Benefits
        </h3>
        <div class="space-y-2">
          <div
            v-for="benefit in benefits"
            :key="benefit"
            class="flex items-center space-x-2"
          >
            <Check
              class="w-4 h-4"
              :class="
                isPremium
                  ? 'text-primary'
                  : 'text-muted-foreground'
              "
            />
            <span
              class="text-sm"
              :class="
                isPremium
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              "
            >
              {{ benefit }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Check, Zap } from 'lucide-vue-next';
import { useAuth } from '#imports';

import { timeAgo } from '#shared/utils/time-ago';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { isPremium, user } = useAuth();

const benefits = [
  'Priority Support',
  'Unlimited Links',
  'API Access',
];

const features = [
  'Advanced Analytics',
  'Click Tracking',
  'Custom Domains',
];
</script>
