import { z } from 'zod';

import { PremiumPlanId } from '~/shared/consts/premium-plans';

export const BuyPremiumDtSchema = z.object({
  planId: z.enum(PremiumPlanId, { error: 'Invalid plan' }),
});

export type BuyPremiumDto = z.infer<
  typeof BuyPremiumDtSchema
>;
