<template>
  <Container
    class="flex items-start justify-center min-h-[80vh]"
  >
    <LoginForm class="w-full max-w-2xl my-10 max-lg:mt-5 max-lg:mx-10 max-sm:mx-7 max-xs:mt-3" />
  </Container>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

import Container from '@/components/ui/Container.vue';
import LoginForm from '@/components/forms/LoginForm.vue';

definePageMeta({
  middleware: 'guest',
});

useSeoMeta({
  title: 'Login',
  description: 'Login to your account',
});
</script>
