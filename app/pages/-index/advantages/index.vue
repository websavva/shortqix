<template>
  <Container
    tag="ul"
    class="flex gap-8 justify-center"
  >
    <li
      v-for="{ label, Icon } in ADVANTAGES"
      :key="label"
      class="flex flex-col items-center"
    >
      <Component :is="Icon" class="size-7 mb-3"/>

      <span class="text-sm text-foreground/50 max-w-32 text-center">
        {{ label }}
      </span>
    </li>
  </Container>
</template>

<script lang="ts" setup>
import {
  PackageOpen,
  SquareMousePointer,
  Gauge,
  ExternalLink,
  ShieldCheck
} from 'lucide-vue-next';

import Container from '~/components/ui/Container.vue'

const ADVANTAGES = [
  {
    label: 'Open source',
    Icon: PackageOpen,
  },
  {
    label: 'Easy to use',
    Icon: SquareMousePointer,
  },
  {
    label: 'Fast redirects',
    Icon: Gauge,
  },
  {
    label: 'Tiny URLs',
    Icon: ExternalLink,
  },
  {
    label: 'Data protection',
    Icon: ShieldCheck,
  }
];
</script>
