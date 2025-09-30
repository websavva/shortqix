<template>
  <footer
    :class="
      cn(
        'border-t border-border bg-background',
        $attrs.class ?? '',
      )
    "
  >
    <div class="mx-auto px-4 py-8">
      <div
        class="flex flex-col items-center justify-center gap-4 text-center"
      >
        <div class="flex items-center gap-2">
          <LogoBox class="size-8" />

          <span class="font-semibold text-foreground">
            {{ appName }}
          </span>
        </div>

        <p class="text-muted-foreground">
          Fast, reliable URL shortening service
        </p>

        <p class="text-xs text-muted-foreground">
          © {{ currentYear }} {{ appName }}. All rights
          reserved.
        </p>

        <p class="text-xs text-primary">
          <a :href="`mailto:${supportEmail}`">
            {{ supportEmail }}
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import LogoBox from '#shared/components/LogoBox';
import { cn } from '@/utils';

const currentYear = new Date().getFullYear();
const appName = process.env.APP_NAME;

const supportEmail = process.env.SUPPORT_EMAIL;
</script>
