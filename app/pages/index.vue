<template>
  <div>
    <div class="relative">
      <Container class="flex flex-col items-center pt-5 h-[500px]">
        <LogoBox class="text-primary bg-primary/10 size-18 p-3" />
  
        <h1 class="text-5xl font-bold mt-10 text-center leading-tight max-w-2xl">
          <span class="text-primary">Shortqix.</span> Link Shortener
  
          <br />
  
          Create short links
  
          <br />
  
          for fast and easy sharing
        </h1>
      </Container>

      <div />
    </div>
    
    <div class="flex flex-col items-center pt-5 h-[400px] bg-foreground/10">

      
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoBox from '~/components/LogoBox.vue';
import Container from '~/components/ui/Container.vue';
</script>