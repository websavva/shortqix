<template>
  <Container
    class="flex items-start justify-center min-h-[80vh]"
  >
    <LoginForm class="w-full max-w-2xl mt-10" />
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/ui/Container.vue';
import LoginForm from '@/components/forms/LoginForm.vue';

definePageMeta({
  middleware: 'guest',
});
</script>
