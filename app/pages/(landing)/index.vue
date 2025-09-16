<template>
  <div>
    <div class="relative bg-gradient-to-t from-primary/5 from-10% to-transparent to-35%">
      <Container class="flex flex-col items-center pt-20 pb-20">

        <LogoBox class="text-primary bg-primary/10 size-18 p-3" />
  
        <h1 class="text-5xl font-bold mt-10 text-center leading-tight max-w-2xl">
          <span class="text-primary">Shortqix.</span> Link Shortener
  
          <br />
  
          Create short links
  
          <br />
  
          for fast and easy sharing
        </h1>

        <ShortenLinkForm class="w-1/2 mt-10 relative" />

        <Advantages class="mt-18 relative"/>
      </Container>
    </div>
    
    <div class="flex flex-col items-center pt-20 pb-30 bg-background">
      <span class="bg-foreground/10 text-foreground/80 rounded-lg px-4 py-2 text-sm block uppercase">
        Feature
      </span>
      
      <h2 class="text-3xl mt-5 flex flex-col items-center font-bold text-center">
        <span>
          Premium Subscription
        </span>
      </h2>

      <PremiumPlanShowcase class="mt-10 w-6xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoBox from '@/components/LogoBox.vue';
import Container from '@/components/ui/Container.vue';
import ShortenLinkForm from '@/components/forms/ShortenLinkForm.vue';
import PremiumPlanShowcase from '@/components/PremiumPlanShowcase.vue';

import Advantages from './-index/advantages/index.vue';
</script>