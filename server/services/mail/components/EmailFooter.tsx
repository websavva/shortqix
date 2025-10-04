import { defineComponent } from 'vue';
import { Text } from '@vue-email/components';

import { footer as baseFooterStyle } from './styles';

export default defineComponent({
  name: 'EmailFooter',
  setup() {
    const appName = process.env.SQX_APP_NAME;

    return () => (
      <>
        <Text
          style={{ ...baseFooterStyle, marginBottom: '0' }}
        >
          {appName} Inc.
        </Text>
        <Text
          style={{ ...baseFooterStyle, marginTop: '0' }}
        >
          Fast, reliable URL shortening service
        </Text>
      </>
    );
  },
});
