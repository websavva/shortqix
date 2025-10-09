import { defineComponent, computed } from 'vue';

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import {
  EmailLayout,
  EmailHeading,
  EmailSection,
  EmailText,
  EmailLink,
} from '../../components';

export default defineComponent({
  name: 'MagicLinkEmail',
  props: {
    token: {
      type: String,
      default: 'test-token',
    },
  },
  setup(props) {
    const magicLink = computed(() =>
      toAbsoluteUrl(`/verify/${props.token}`),
    );

    return () => (
      <EmailLayout preview="Log in with this magic link.">
        <EmailHeading>🪄 Your magic link</EmailHeading>

        <EmailSection>
          <EmailText>
            <EmailLink href={magicLink.value}>
              👉 Click here to sign in 👈
            </EmailLink>
          </EmailText>
          <EmailText>
            If you didn't request this, please ignore this
            email.
          </EmailText>
        </EmailSection>
      </EmailLayout>
    );
  },
});
