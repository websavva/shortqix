<template>
  <Html>
    <Head />
    <Body :style="main">
      <Preview>Log in with this magic link.</Preview>
      <Container :style="container">
        <Img
          :src="`${baseUrl}/static/raycast-logo.png`"
          :width="48"
          :height="48"
          alt="Raycast"
        />
        <Heading :style="heading"
          >🪄 Your magic link</Heading
        >
        <Section :style="body">
          <Text :style="paragraph">
            <Link
              :style="link"
              :href="magicLink"
            >
              �� Click here to sign in ��
            </Link>
          </Text>
          <Text :style="paragraph">
            If you didn't request this, please ignore this
            email.
          </Text>
        </Section>
        <Text :style="paragraph">
          Best,
          <br />- Raycast Team
        </Text>
        <Hr :style="hr" />
        <Img
          :src="`${baseUrl}/static/raycast-logo.png`"
          :width="32"
          :height="32"
          :style="footerLogo"
        />
        <Text :style="footer"
          >Raycast Technologies Inc.</Text
        >
        <Text :style="footer">
          2093 Philadelphia Pike #3222, Claymont, DE 19703
        </Text>
      </Container>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@vue-email/components';
import { computed } from 'vue';

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

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px',
  backgroundImage: 'url("/static/raycast-bg.png")',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
};

const body = {
  margin: '24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const link = {
  color: '#FF6363',
};

const hr = {
  borderColor: '#dddddd',
  marginTop: '48px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginLeft: '4px',
};

const footerLogo = {
  WebkitFilter: 'grayscale(100%)',
  filter: 'grayscale(100%)',
  margin: '20px 0',
};
</script>
