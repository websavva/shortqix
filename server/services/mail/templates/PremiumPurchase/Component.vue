<template>
  <EmailLayout :preview="`Welcome to ${appName} Premium!`">
    <Heading :style="heading">
      🎉 Welcome to {{ appName }} Premium!
    </Heading>

    <Section :style="body">
      <Text :style="paragraph">
        Thank you for upgrading to {{ appName }} Premium! You now
        have access to all our advanced features to
        supercharge your link management.
      </Text>

      <EmailCard variant="highlighted">
        <Text
          :style="{
            ...paragraph,
            marginTop: '0',
            fontWeight: '600',
          }"
        >
          🚀 Your Premium Features:
        </Text>
        <Text :style="{ ...paragraph, marginBottom: '0' }">
          • Extended limits<br />
          • Custom slugs for links<br />
          • Advanced analytics & insights<br />
        </Text>
      </EmailCard>

      <Text :style="paragraph">
        Your subscription is now active and you can start
        using all premium features immediately.
      </Text>
    </Section>

    <Section :style="body">
      <EmailButton
        :href="toAbsoluteUrl('/dashboard')"
        variant="primary"
        size="lg"
      >
        Go to Dashboard
      </EmailButton>
    </Section>

    <Section :style="body">
      <Text :style="paragraph">
        <strong>Need help getting started?</strong>
      </Text>
      <Text :style="paragraph">
        Check out our
        <Link
          :style="link"
          :href="toAbsoluteUrl('/help/premium')"
        >
          Premium guide
        </Link>
        or explore the
        <Link
          :style="link"
          :href="toAbsoluteUrl('/dashboard/analytics')"
        >
          analytics dashboard
        </Link>
        to see your link performance.
      </Text>
    </Section>

    <EmailCard variant="outlined">
      <Text
        :style="{
          ...paragraph,
          marginTop: '0',
          fontWeight: '600',
        }"
      >
        💡 Pro Tip:
      </Text>
      <Text :style="{ ...paragraph, marginBottom: '0' }">
        Use custom short links to build your brand
        recognition. Instead of
        {{ createShortUrl('sh1a08z1') }}, you can now use
        {{ createShortUrl('your-slug') }} !
      </Text>
    </EmailCard>

    <EmailCard variant="outlined">
      <Text
        :style="{
          ...paragraph,
          marginTop: '0',
          fontWeight: '600',
        }"
      >
        📋 Purchase Details:
      </Text>
      <Text :style="{ ...paragraph, marginBottom: '0' }">
        <strong>Plan:</strong> {{ plan.title }}<br />
        <strong>Amount Paid:</strong> ${{
          spaceNumber(plan.priceUSD)
        }}
        <br />
        <strong>Billing Period:</strong>
        {{ plan.durationText }}
        <br />
        <strong>Purchase Date:</strong>
        {{ formatDate(purchasedAt) }}<br />
        <strong>Premium Expires:</strong>
        {{ formatDate(premiumExpiresAt) }}
      </Text>
    </EmailCard>
  </EmailLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Heading,
  Link,
  Section,
  Text,
} from '@vue-email/components';

import {
  PremiumPlanId,
  getPremiumPlan,
} from '#shared/consts/premium-plans';
import { spaceNumber } from '#shared/utils/space-number';
import { toAbsoluteUrl } from '#shared/utils/to-absolute-url';
import { createShortUrl } from '#shared/utils/create-short-url';

import {
  EmailLayout,
  EmailCard,
  EmailButton,
  useEmailStyles,
} from '../../components';

export interface Props {
  premiumExpiresAt: string | Date;
  purchasedAt: string | Date;
  planId: PremiumPlanId;
}

const props = withDefaults(defineProps<Props>(), {
  planId: PremiumPlanId.ONE_MONTH,
  premiumExpiresAt: () => new Date(),
  purchasedAt: () => new Date(),
});

const appName = process.env.APP_NAME;
  
const { heading, body, paragraph, link } = useEmailStyles();

const plan = computed(() => getPremiumPlan(props.planId)!);

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};
</script>
