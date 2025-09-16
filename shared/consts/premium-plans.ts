// Premium subscription plans enum
export enum PremiumPlanId {
  ONE_MONTH = '1month',
  THREE_MONTHS = '3months',
  ONE_YEAR = '1year',
}

// Premium subscription plans configuration
export const PREMIUM_PLANS = {
  [PremiumPlanId.ONE_MONTH]: {
    id: PremiumPlanId.ONE_MONTH,
    duration: 30,
    priceUSD: 9.99,
    title: 'Monthly',
    description: 'Try premium features',
    durationText: 'month',
  },
  [PremiumPlanId.THREE_MONTHS]: {
    id: PremiumPlanId.THREE_MONTHS,
    duration: 90,
    priceUSD: 24.99,
    title: 'Quarterly',
    description: 'Great value choice',
    durationText: '3 months',
  },
  [PremiumPlanId.ONE_YEAR]: {
    id: PremiumPlanId.ONE_YEAR,
    duration: 365,
    priceUSD: 89.99,
    title: 'Yearly',
    description: 'Best long-term value',
    durationText: 'year',
  },
} as const;

// Type for plan configuration
export type PremiumPlan =
  (typeof PREMIUM_PLANS)[PremiumPlanId];

// Helper function to get plan by ID
export function getPremiumPlan(
  planId: string,
): PremiumPlan | null {
  return PREMIUM_PLANS[planId as PremiumPlanId] || null;
}
