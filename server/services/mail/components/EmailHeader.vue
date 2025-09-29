<template>
  <Section>
    <Row
      :style="{
        display: 'flex',
      }"
    >
      <Column>
        <Img
          :src="`${baseUrl}/logo-box.png`"
          :width="48"
          :height="48"
          alt="Shortqix"
        />
      </Column>

      <Column :style="{}">
        <Text
          :style="{
            ...paragraph,
            marginLeft: '5px',
            fontWeight: '600',
          }"
        >
          Shortqix
        </Text>
      </Column>
    </Row>
  </Section>
</template>

<script setup lang="ts">
import {
  Img,
  Row,
  Column,
  Section,
  Text,
} from '@vue-email/components';

import { useEmailStyles } from './useEmailStyles';

const { paragraph } = useEmailStyles();
const baseUrl = process.env.BASE_URL;
</script>
