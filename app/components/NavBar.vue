<template>
  <nav
    class="bg-background/80 py-3 px-2 rounded-md flex items-center justify-between backdrop-blur-sm h-20"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2"
    >
      <LogoBox
        class="text-primary bg-primary/10 size-12 p-3"
      />

      <span class="text-lg font-medium">Shortqix</span>
    </NuxtLink>

    <div class="flex items-center gap-4">
      <NuxtLink
        v-if="isGuest"
        to="/login"
      >
        Login
      </NuxtLink>

      <NuxtLink
        v-else
        to="/dashboard"
      >
        Dashboard
      </NuxtLink>

      <Button
        as="NuxtLink"
        href="/premium"
      >
        Premium +
      </Button>

      <Button
        v-if="!isGuest"
        size="icon"
        variant="ghost"
        class="text-xl"
        :pending
        @click="logout()"
      >
        <template #icon>
          <LogOut />
        </template>
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { useAuth } from '#imports';
import { LogOut } from 'lucide-vue-next';

import LogoBox from './LogoBox.vue';
import Button from './ui/Button.vue';

const { isGuest, logout, pending } = useAuth();
</script>
