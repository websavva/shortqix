<template>
  <Html>
    <Head />
    <Body :style="main">
      <Preview>{{ preview }}</Preview>
      <Container :style="container">
        <EmailHeader />
        
        <Hr :style="hr" />
        
        <Section :style="body">
          <slot />
        </Section>
        
        <Text :style="paragraph">
          Best,
          <br />- {{ appName }} Team
        </Text>
        
        <Hr :style="hr" />
        
        <EmailFooter />
      </Container>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@vue-email/components';

import EmailHeader from './EmailHeader.vue';
import EmailFooter from './EmailFooter.vue';
import { useEmailStyles } from './useEmailStyles';

export interface Props {
  preview?: string;
}

const appName = process.env.APP_NAME;

withDefaults(defineProps<Props>(), {
  preview: `${process.env.APP_NAME} - Fast, reliable URL shortening service`,
});

const { main, container, body, paragraph, hr } = useEmailStyles();

</script>
