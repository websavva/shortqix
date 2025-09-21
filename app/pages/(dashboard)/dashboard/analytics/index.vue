<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-foreground mb-2">
        Analytics
      </h1>
      <p class="text-muted-foreground">
        Track your link performance and engagement metrics
      </p>
    </div>

    <!-- Stats Component -->
    <Stats />
  </div>
</template>

<script setup lang="ts">
import Stats from './-components/Stats/index.vue';
</script>
