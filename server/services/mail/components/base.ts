import {
  Body,
  Container,
  Hr,
  Section,
  Heading,
  Text,
  Link,
} from '@vue-email/components';

import { styles } from './styles';
import { defineEmailComponent } from './utils';

export const EmailHeading = defineEmailComponent(
  Heading,
  styles.heading,
);

export const EmailBody = defineEmailComponent(
  Body,
  styles.body,
);

export const EmailSection = defineEmailComponent(
  Section,
  styles.body,
);

export const EmailContainer = defineEmailComponent(
  Container,
  styles.container,
);

export const EmailText = defineEmailComponent(
  Text,
  styles.paragraph,
);

export const EmailLink = defineEmailComponent(
  Link,
  styles.link,
);

export const EmailHr = defineEmailComponent(Hr, styles.hr);
