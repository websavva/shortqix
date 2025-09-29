<template>
  <div>
    <div
      class="relative bg-gradient-to-t from-primary/5 from-10% to-transparent to-35%"
    >
      <Container
        class="flex flex-col items-center pt-20 pb-20"
      >
        <LogoBox
          class="size-18 p-3"
        />

        <h1
          class="text-5xl font-bold mt-10 text-center leading-tight max-w-2xl"
        >
          <span class="text-primary">Shortqix.</span> Link
          Shortener

          <br />

          Create short links

          <br />

          for fast and easy sharing
        </h1>

        <ShortenLinkForm class="w-1/2 mt-10 relative" />

        <Advantages class="mt-18 relative" />
      </Container>
    </div>

    <PremiumPlanShowcase
      class="mt-10 w-6xl pt-20 pb-30 bg-background mx-auto"
    />
  </div>
</template>

<script setup lang="ts">
import LogoBox from '@/components/LogoBox.vue';
import Container from '@/components/ui/Container.vue';
import ShortenLinkForm from '@/components/forms/ShortenLinkForm.vue';
import PremiumPlanShowcase from '@/components/PremiumPlanShowcase.vue';

import Advantages from './-index/advantages/index.vue';
</script>
