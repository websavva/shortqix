import { defineComponent } from 'vue';
import {
  Img,
  Row,
  Column,
  Section,
  Text,
} from '@vue-email/components';

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import { useEmailStyles } from './useEmailStyles';

export default defineComponent({
  name: 'EmailHeader',
  setup() {
    const { paragraph } = useEmailStyles();
    const appName = process.env.SQX_APP_NAME;

    return () => (
      <Section>
        <Row
          style={{
            display: 'flex',
          }}
        >
          <Column>
            <Img
              src={toAbsoluteUrl('/logo-box.png')}
              width={48}
              height={48}
              alt={appName}
            />
          </Column>

          <Column style={{}}>
            <Text
              style={{
                ...paragraph,
                marginLeft: '5px',
                fontWeight: '600',
              }}
            >
              {appName}
            </Text>
          </Column>
        </Row>
      </Section>
    );
  },
});
