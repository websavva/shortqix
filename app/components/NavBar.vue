<template>
  <nav class="bg-background/80 py-3 px-2 rounded-md flex items-center justify-between backdrop-blur-sm h-20">
    <NuxtLink to="/" class="flex items-center gap-2">
      <LogoBox class="text-primary bg-primary/10 size-12 p-3" />

      <span class="text-lg font-medium">Shortqix</span>
    </NuxtLink>

    <div class="flex items-center gap-4">
      <NuxtLink to="/login">Login</NuxtLink>

      <Button as="a" href="/premium">
        Premium +
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import LogoBox from './LogoBox.vue';
import Button from './ui/Button.vue';

import { NuxtLink } from '#components';
</script>