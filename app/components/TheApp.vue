<template>
  <div>
    <Container class="fixed top-3 left-0 right-0 z-50">
      <NavBar />
    </Container>

    <div
      class="min-h-[calc(100vh-23*var(--spacing))] mt-24"
    >
      <slot />
    </div>

    <Footer />

    <Toaster />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#imports';

import NavBar from '@/components/NavBar.vue';
import Container from '@/components/ui/Container.vue';
import Footer from '@/components/Footer.vue';
import { Toaster } from '@/components/ui/toast';

useHead({
  htmlAttrs: {
    class:
      'text-[16px] [--nav-bar-height:calc(20*var(--spacing))]',
  },
});
</script>
