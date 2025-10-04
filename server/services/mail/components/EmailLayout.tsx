import { defineComponent } from 'vue';
import { Head, Html, Preview } from '@vue-email/components';

import EmailHeader from './EmailHeader';
import EmailFooter from './EmailFooter';
import {
  EmailBody,
  EmailContainer,
  EmailHr,
  EmailSection,
  EmailText,
} from './base';

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

    return () => (
      <Html>
        <Head />
        <EmailBody>
          <Preview>{props.preview}</Preview>
          <EmailContainer>
            <EmailHeader />
            <EmailHr />
            <EmailSection>{slots.default?.()}</EmailSection>
            <EmailText>
              Best,
              <br />- {appName} Team
            </EmailText>
            <EmailHr />
            <EmailFooter />
          </EmailContainer>
        </EmailBody>
      </Html>
    );
  },
});
