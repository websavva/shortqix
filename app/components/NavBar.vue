<template>
  <nav
    class="bg-background/80 py-3 px-2 max-lg:rounded-md flex items-center justify-between backdrop-blur-sm h-[var(--nav-bar-height)]"
  >
    <!-- Logo Section -->
    <NuxtLink
      to="/"
      class="flex items-center gap-2"
    >
      <LogoBox class="size-12" />

      <span class="text-lg font-medium">{{ appName }}</span>
    </NuxtLink>

    <!-- Desktop Navigation -->
    <div class="hidden sm:flex items-center">
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
          @click="onLogout"
        >
          <template #icon>
            <LogOut />
          </template>
        </Button>
      </SizeTransition>
    </div>

    <!-- Mobile Navigation -->
    <div class="flex sm:hidden items-center gap-2">
      <!-- Mobile Premium Button -->
      <Button
        as="NuxtLink"
        to="/premium"
        size="sm"
        variant="outline"
        class="px-3"
      >
        <Zap class="w-4" />

        <span class="hidden sm:block ml-2">Premium</span>
      </Button>

      <!-- Mobile Menu Button -->
      <Button
        size="icon"
        variant="ghost"
        class="text-xl"
        @click="toggleMobileMenu"
      >
        <template #icon>
          <span
            class="grid grid-cols-1 grid-rows-1 size-6 items-center justify-center overflow-hidden *:size-full *:row-start-1 *:row-end-1 *:col-start-1 *:col-end-1"
          >
            <RollTransition :duration="200">
              <Menu v-if="!isMobileMenuOpen" />

              <X v-else />
            </RollTransition>
          </span>
        </template>
      </Button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <SizeTransition
      singular
      concurrent
      :fade-config="{ duration: 250 }"
      :size-config="{ duration: 250 }"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border rounded-b-md shadow-lg z-inherit lg:hidden"
      >
        <SizeTransition
          concurrent
          :fade-config="{ duration: 150 }"
          :size-config="{ duration: 150 }"
        >
          <div
            :key="String(isGuest)"
            class="px-4 py-3 space-y-2"
          >
            <NuxtLink
              v-if="isGuest"
              to="/login"
              class="block rounded-md hover:bg-accent transition-colors"
              @click="closeMobileMenu"
            >
              Login
            </NuxtLink>

            <NuxtLink
              v-else
              to="/dashboard"
              class="block rounded-md hover:bg-accent transition-colors"
              @click="closeMobileMenu"
            >
              Dashboard
            </NuxtLink>

            <Button
              v-if="!isGuest"
              variant="ghost"
              class="w-full justify-start text-left px-0"
              :pending
              @click="onLogout"
            >
              <template #icon>
                <LogOut />
              </template>

              Logout
            </Button>
          </div>
        </SizeTransition>
      </div>
    </SizeTransition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NuxtLink } from '#components';
import { useAuth } from '#imports';
import { LogOut, Zap, Menu, X } from 'lucide-vue-next';

import LogoBox from '#shared/components/LogoBox';

import RollTransition from './ui/RollTransition';
import SizeTransition from './ui/SizeTransition';
import Button from './ui/Button.vue';

const appName = process.env.APP_NAME;

const { isGuest, isPremium, logout, pending } = useAuth();

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const onLogout = async () => {
  await logout();
};
</script>
