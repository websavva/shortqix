import { defineComponent } from 'vue';
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

import EmailHeader from './EmailHeader';
import EmailFooter from './EmailFooter';
import { useEmailStyles } from './useEmailStyles';

export default defineComponent({
  name: 'EmailLayout',
  props: {
    preview: {
      type: String,
      default: `${process.env.SQX_APP_NAME} - Fast, reliable URL shortening service`,
    },
  },
  setup(props, { slots }) {
    const appName = process.env.SQX_APP_NAME;
    const { main, container, body, paragraph, hr } =
      useEmailStyles();

    return () => (
      <Html>
        <Head />
        <Body style={main}>
          <Preview>{props.preview}</Preview>
          <Container style={container}>
            <EmailHeader />
            <Hr style={hr} />
            <Section style={body}>
              {slots.default?.()}
            </Section>
            <Text style={paragraph}>
              Best,
              <br />- {appName} Team
            </Text>
            <Hr style={hr} />
            <EmailFooter />
          </Container>
        </Body>
      </Html>
    );
  },
});
