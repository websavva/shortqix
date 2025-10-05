import { defineComponent, computed } from 'vue';

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
  EmailHeading,
  EmailSection,
  EmailText,
  EmailLink,
} from '../../components';

export default defineComponent({
  name: 'PremiumPurchaseEmail',
  props: {
    premiumExpiresAt: {
      type: [String, Date],
      required: true,
    },
    purchasedAt: {
      type: [String, Date],
      required: true,
    },
    planId: {
      type: String as () => PremiumPlanId,
      default: PremiumPlanId.ONE_MONTH,
    },
  },
  setup(props) {
    const appName = process.env.SQX_APP_NAME;

    const plan = computed(
      () => getPremiumPlan(props.planId)!,
    );

    const formatDate = (date: string | Date) => {
      return new Date(date).toLocaleString();
    };

    return () => (
      <EmailLayout
        preview={`Welcome to ${appName} Premium!`}
      >
        <EmailHeading>
          🎉 Welcome to {appName} Premium!
        </EmailHeading>

        <EmailSection>
          <EmailText>
            Thank you for upgrading to {appName} Premium!
            You now have access to all our advanced features
            to supercharge your link management.
          </EmailText>

          <EmailCard>
            <EmailText
              style={{
                marginTop: '0',
                fontWeight: '600',
                backgroundColor: 'inherit',
              }}
            >
              🚀 Your Premium Features:
            </EmailText>
            <EmailText
              style={{
                marginBottom: '0',
                backgroundColor: 'inherit',
              }}
            >
              • Extended limits
              <br />
              • Custom slugs for links
              <br />
              • Advanced analytics & insights
              <br />
            </EmailText>
          </EmailCard>

          <EmailText>
            Your subscription is now active and you can
            start using all premium features immediately.
          </EmailText>
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

        <EmailSection>
          <EmailText>
            <strong>Need help getting started?</strong>
          </EmailText>
          <EmailText>
            Check out our{' '}
            <EmailLink
              href={toAbsoluteUrl('/help/premium')}
            >
              Premium guide
            </EmailLink>{' '}
            or explore the{' '}
            <EmailLink
              href={toAbsoluteUrl('/dashboard/analytics')}
            >
              analytics dashboard
            </EmailLink>{' '}
            to see your link performance.
          </EmailText>
        </EmailSection>

        <EmailCard>
          <EmailText
            style={{
              marginTop: '0',
              fontWeight: '600',
              backgroundColor: 'inherit',
            }}
          >
            💡 Pro Tip:
          </EmailText>
          <EmailText
            style={{
              marginBottom: '0',
              backgroundColor: 'inherit',
            }}
          >
            Use custom short links to build your brand
            recognition. Instead of{' '}
            {createShortUrl('sh1a08z1')} , you can now use{' '}
            {createShortUrl('your-slug')} !
          </EmailText>
        </EmailCard>

        <EmailCard>
          <EmailText
            style={{
              marginTop: '0',
              fontWeight: '600',
              backgroundColor: 'inherit',
            }}
          >
            📋 Purchase Details:
          </EmailText>
          <EmailText
            style={{
              marginBottom: '0',
              backgroundColor: 'inherit',
            }}
          >
            <strong>Plan:</strong>
            {plan.value.title}
            <br />
            <strong>Amount Paid:</strong>$
            {spaceNumber(plan.value.priceUSD)}
            <br />
            <strong>Billing Period:</strong>
            {plan.value.durationText}
            <br />
            <strong>Purchase Date:</strong>
            {formatDate(props.purchasedAt)}
            <br />
            <strong>Premium Expires:</strong>
            {formatDate(props.premiumExpiresAt)}
          </EmailText>
        </EmailCard>
      </EmailLayout>
    );
  },
});
