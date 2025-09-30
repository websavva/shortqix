<template>
  <div>
    <h1 class="text-3xl max-sm:text-2xl font-bold text-foreground mb-2">
      <slot name="title" />
    </h1>
    <p class="text-muted-foreground max-sm:text-sm">
      <slot name="description" />
    </p>
  </div>
</template>
