<template>
  <Text :style="{ ...footer, marginBottom: '0' }">
    {{ appName }} Inc.
  </Text>
  <Text :style="{ ...footer, marginTop: '0' }">
    Fast, reliable URL shortening service
  </Text>
</template>

<script setup lang="ts">
import { Text } from '@vue-email/components';

import { useEmailStyles } from './useEmailStyles';

const { footer } = useEmailStyles();

const appName = process.env.APP_NAME;
</script>
