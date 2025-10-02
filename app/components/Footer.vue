<template>
  <footer
    :class="
      cn(
        'border-t border-border bg-background',
        props.class ?? '',
      )
    "
  >
    <div class="mx-auto px-4 py-8">
      <div
        class="flex flex-col items-center justify-center gap-4 text-center"
      >
        <div class="flex items-center gap-2">
          <LogoBox
            class="size-8"
            data-test-id="logo-box"
          />

          <span
            class="font-semibold text-foreground"
            data-test-id="app-name"
          >
            {{ appName }}
          </span>
        </div>

        <p class="text-muted-foreground">
          Fast, reliable URL shortening service
        </p>

        <p
          class="text-xs text-muted-foreground"
          data-test-id="copyright"
        >
          © {{ currentYear }} {{ appName }}. All rights
          reserved.
        </p>

        <p class="text-xs text-primary">
          <a
            :href="`mailto:${supportEmail}`"
            data-test-id="support-email"
          >
            {{ supportEmail }}
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import LogoBox from '#shared/components/LogoBox';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const currentYear = new Date().getFullYear();
const appName = process.env.SQX_APP_NAME;

const supportEmail = process.env.SQX_SUPPORT_EMAIL;
</script>
