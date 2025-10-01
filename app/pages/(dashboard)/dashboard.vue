<template>
  <div class="min-h-screen bg-background">
    <Container class="py-4 sm:py-6 lg:py-8 max-lg:px-5">
      <!-- Header Section -->
      <div class="mb-6 sm:mb-8">
        <h1
          class="text-2xl sm:text-3xl font-bold text-foreground mb-2"
        >
          Dashboard
        </h1>
        <p
          class="text-sm sm:text-base text-muted-foreground"
        >
          Manage your links, analytics, and premium features
        </p>
      </div>

      <div
        class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8"
      >
        <!-- Sidebar Navigation -->
        <NavSideBar
          class="lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-[calc(5*var(--spacing)+var(--nav-bar-height))] lg:self-start"
        />

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          <div
            class="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border"
          >
            <div class="p-4 sm:p-6 lg:p-8">
              <NuxtPage />
            </div>
          </div>
        </main>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { NuxtPage } from '#components';

import Container from '@/components/ui/Container.vue';

import NavSideBar from './-components/NavSideBar/index.vue';

definePageMeta({
  middleware: ['auth'],

  redirect: '/dashboard/analytics',
});
</script>
