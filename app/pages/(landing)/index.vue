<template>
  <div>
    <div
      class="relative bg-gradient-to-t from-primary/5 from-10% to-transparent to-35%"
    >
      <Container
        class="flex flex-col items-center max-sm:pt-5 max-lg:pt-10 max-xl:pt-15 pt-20 pb-20"
      >
        <LogoBox
          class="size-18"
          :scale="0.85"
        />

        <h1
          class="max-sm:text-3xl max-xl:text-4xl text-5xl font-bold mt-10 max-sm:mt-5 text-center leading-tight max-w-2xl"
        >
          <span class="text-primary">{{ appName }}.</span>
          Link Shortener

          <br />

          Create short links

          <br />

          for fast and easy sharing
        </h1>

        <ShortenLinkForm
          class="max-xs:w-[90%] max-lg:w-md w-1/2 mt-10 relative max-lg:px-5"
        />

        <Advantages
          class="max-sm:max-w-sm max-xl:mt-12 mt-18 relative max-lg:px-10"
        />
      </Container>
    </div>

    <PremiumPlanShowcase
      class="max-w-6xl w-full my-30 max-lg:my-15 bg-background mx-auto max-lg:px-5"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '#imports';

import LogoBox from '#shared/components/LogoBox';
import Container from '@/components/ui/Container.vue';
import ShortenLinkForm from '@/components/forms/ShortenLinkForm.vue';
import PremiumPlanShowcase from '@/components/PremiumPlanShowcase.vue';

import Advantages from './-index/advantages/index.vue';

const appName = process.env.APP_NAME;

useSeoMeta({
  title: 'Home',
  description: 'Shorten your links with ease',
});
</script>
