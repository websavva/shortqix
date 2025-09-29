<template>
  <EmailLayout preview="Log in with this magic link.">
    <Heading :style="heading">
      🪄 Your magic link
    </Heading>
    
    <Section :style="body">
      <Text :style="paragraph">
        <Link
          :style="link"
          :href="magicLink"
        >
          👉 Click here to sign in 👈
        </Link>
      </Text>
      <Text :style="paragraph">
        If you didn't request this, please ignore this
        email.
      </Text>
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
import { computed } from 'vue';

import { EmailLayout, useEmailStyles } from '../../components';

export interface Props {
  token: string;
}

const props = withDefaults(defineProps<Props>(), {
  token: 'test-token',
});

const magicLink = computed(
  () => `${baseUrl}/auth/verify?token=${props.token}`,
);

const baseUrl = process.env.BASE_URL;
const { heading, body, paragraph, link } = useEmailStyles();
</script>
