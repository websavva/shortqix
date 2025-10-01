<template>
  <EmailLayout preview="Log in with this magic link.">
    <Heading :style="heading">🪄 Your magic link</Heading>

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

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import {
  EmailLayout,
  useEmailStyles,
} from '../../components';

export interface Props {
  token: string;
}

const props = withDefaults(defineProps<Props>(), {
  token: 'test-token',
});

const magicLink = computed(() =>
  toAbsoluteUrl(`/verify/${props.token}`),
);

const { heading, body, paragraph, link } = useEmailStyles();
</script>
