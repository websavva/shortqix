<template>
  <EmailLayout preview="Welcome to Shortqix!">
    <Heading :style="heading">
      🎉 Welcome to Shortqix!
    </Heading>

    <Section :style="body">
      <Text :style="paragraph">
        Thank you for joining Shortqix! We're excited to
        help you create short, memorable links that work
        everywhere.
      </Text>

      <EmailCard variant="highlighted">
        <Text :style="{ ...paragraph, marginTop: '0' }">
          <strong>Get started:</strong>
        </Text>
        <Text :style="{ ...paragraph, marginBottom: '0' }">
          1. Paste your long URL<br />
          2. Customize your short link (optional)<br />
          3. Share your shortened link anywhere!
        </Text>
      </EmailCard>
    </Section>

    <Section :style="body">
      <EmailButton
        :href="`${baseUrl}/dashboard`"
        variant="primary"
        size="lg"
      >
        Go to Dashboard
      </EmailButton>
    </Section>
  </EmailLayout>
</template>

<script setup lang="ts">
import {
  Heading,
  Link,
  Section,
  Text,
} from '@vue-email/components';

import {
  EmailLayout,
  EmailCard,
  EmailButton,
  useEmailStyles,
} from '../../components';

const baseUrl = process.env.BASE_URL;
const { heading, body, paragraph, link } = useEmailStyles();
</script>
