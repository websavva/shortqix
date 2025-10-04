import { defineComponent } from 'vue';

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import {
  EmailLayout,
  EmailCard,
  EmailButton,
  EmailHeading,
  EmailSection,
  EmailText,
} from '../../components';

export default defineComponent({
  name: 'WelcomeEmail',
  setup() {
    const appName = process.env.SQX_APP_NAME;

    return () => (
      <EmailLayout preview={`Welcome to ${appName}!`}>
        <EmailHeading>
          🎉 Welcome to {appName}!
        </EmailHeading>

        <EmailSection>
          <EmailText>
            Thank you for joining {appName}! We're excited
            to help you create short, memorable links that
            work everywhere.
          </EmailText>

          <EmailCard variant="highlighted">
            <EmailText style={{ marginTop: '0' }}>
              <strong>Get started:</strong>
            </EmailText>
            <EmailText style={{ marginBottom: '0' }}>
              1. Paste your long URL
              <br />
              2. Customize your short link (optional)
              <br />
              3. Share your shortened link anywhere!
            </EmailText>
          </EmailCard>
        </EmailSection>

        <EmailSection>
          <EmailButton
            href={toAbsoluteUrl('/dashboard')}
            variant="primary"
            size="lg"
          >
            Go to Dashboard
          </EmailButton>
        </EmailSection>
      </EmailLayout>
    );
  },
});
