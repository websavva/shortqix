<template>
  <div>
    <Container class="fixed top-3 left-0 right-0 z-50">
      <NavBar />
    </Container>

    <NuxtPage class="min-h-[calc(100vh-23*var(--spacing))] mt-24" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from '#imports';

import NavBar from '~/components/NavBar.vue';
import Container from '~/components/ui/Container.vue';

useHead({
    htmlAttrs: {
        class: 'text-[16px]',
    },
});
</script>
