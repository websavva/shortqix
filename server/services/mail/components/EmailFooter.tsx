import { defineComponent } from 'vue';
import { Text } from '@vue-email/components';

import { useEmailStyles } from './useEmailStyles';

export default defineComponent({
  name: 'EmailFooter',
  setup() {
    const { footer } = useEmailStyles();
    const appName = process.env.SQX_APP_NAME;

    return () => (
      <>
        <Text style={{ ...footer, marginBottom: '0' }}>
          {appName} Inc.
        </Text>
        <Text style={{ ...footer, marginTop: '0' }}>
          Fast, reliable URL shortening service
        </Text>
      </>
    );
  },
});
