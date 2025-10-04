import { defineComponent } from 'vue';
import {
  Img,
  Row,
  Column,
  Section,
} from '@vue-email/components';

import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';

import { s, main } from './styles';
import { EmailText } from './base';

export default defineComponent({
  name: 'EmailHeader',
  setup() {
    const appName = process.env.SQX_APP_NAME;

    return () => (
      <Section>
        <Row
          style={s({
            display: 'flex',
          })}
        >
          <Column
            style={s(main, {
              width: '48px',
              height: '48px',
            })}
          >
            <Img
              src={toAbsoluteUrl('/logo-box.png')}
              width={48}
              height={48}
              alt={appName}
            />
          </Column>

          <Column style={main}>
            <EmailText
              style={{
                marginLeft: '5px',
                fontWeight: '600',
              }}
            >
              {appName}
            </EmailText>
          </Column>
        </Row>
      </Section>
    );
  },
});
