<template>
  <div>
    <Container
      class="fixed max-lg:top-0 top-3 left-0 right-0 z-50 max-lg:px-4"
    >
      <NavBar />
    </Container>

    <div
      class="min-h-[calc(100vh-23*var(--spacing))] mt-24"
    >
      <slot />
    </div>

    <Footer class="max-lg:px-4" />

    <ClientOnly>
      <Toaster />
    </ClientOnly>
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
      'max-3xl:text-[13px] max-4xl:text-[14.5px] text-[16px] [--nav-bar-height:calc(20*var(--spacing))]',
  },
});
</script>
