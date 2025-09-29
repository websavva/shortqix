<template>
  <nav
    class="bg-background/80 py-3 px-2 rounded-md flex items-center justify-between backdrop-blur-sm h-[var(--nav-bar-height)]"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-2"
    >
      <LogoBox
        class="size-12"
      />

      <span class="text-lg font-medium">Shortqix</span>
    </NuxtLink>

    <div class="flex items-center">
      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 250 }"
        :size-config="{ duration: 250 }"
      >
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
      </SizeTransition>

      <Button
        as="NuxtLink"
        to="/premium"
        icon-position="right"
        class="mx-4"
      >
        Premium

        <template #icon>
          <SizeTransition
            singular
            concurrent
            :fade-config="{ duration: 250 }"
            :size-config="{ duration: 250 }"
          >
            <span
              v-if="!isPremium"
              class="-translate-y-[1px] block"
            >
              +
            </span>

            <span
              v-else
              class="block"
            >
              <Zap />
            </span>
          </SizeTransition>
        </template>
      </Button>

      <SizeTransition
        singular
        concurrent
        :fade-config="{ duration: 250 }"
        :size-config="{ duration: 250 }"
      >
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
      </SizeTransition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { useAuth } from '#imports';
import { LogOut, Zap } from 'lucide-vue-next';

import LogoBox from '#shared/components/LogoBox';

import SizeTransition from './ui/SizeTransition';
import Button from './ui/Button.vue';

const { isGuest, isPremium, logout, pending } = useAuth();
</script>
