import { defineComponent, computed } from 'vue';
import {
  Heading,
  Link,
  Section,
  Text,
} from '@vue-email/components';

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import {
  EmailLayout,
  useEmailStyles,
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

    const { heading, body, paragraph, link } =
      useEmailStyles();

    return () => (
      <EmailLayout preview="Log in with this magic link.">
        <Heading style={heading}>
          🪄 Your magic link
        </Heading>

        <Section style={body}>
          <Text style={paragraph}>
            <Link
              style={link}
              href={magicLink.value}
            >
              👉 Click here to sign in 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you didn't request this, please ignore this
            email.
          </Text>
        </Section>
      </EmailLayout>
    );
  },
});
