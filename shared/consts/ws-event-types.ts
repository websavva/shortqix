import type { Payment, User } from '#server/db/schema';

import type { PremiumPlanId } from './premium-plans';



export enum WsEventTypes {
  PAYMENT_UPDATE_STATUS = 'payment-update-status',
  PREMIUM_PURCHASE = 'premium-purchase',
  PREMIUM_EXPIRATION = 'premium-expiration',
}

export interface WsEvents {
  [WsEventTypes.PAYMENT_UPDATE_STATUS]: Pick<
    Payment,
    'id' | 'status' | 'confirmedAt' | 'updatedAt'
  >;

  [WsEventTypes.PREMIUM_PURCHASE]: Pick<
    User,
    'premiumExpiresAt' | 'isPremium'
  > & {
    planId: PremiumPlanId;
  };

  [WsEventTypes.PREMIUM_EXPIRATION]: {
    isPremium: false;
    premiumExpiresAt: null;
  };
}
