<template>
  <Container class="py-10 max-sm:pt-0 max-sm:px-5">
    <PremiumPlanShowcase />
  </Container>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

import Container from '@/components/ui/Container.vue';
import PremiumPlanShowcase from '@/components/PremiumPlanShowcase.vue';

useSeoMeta({
  title: 'Premium',
  description: 'Buy premium plan to get more features',
});
</script>
