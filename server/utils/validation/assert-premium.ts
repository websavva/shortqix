import type { H3Event } from 'h3';

export function assertPremium(
  event: H3Event,
  message: string = 'User is not premium',
) {
  if (
    !event.user?.isPremium ||
    !event.user?.premiumExpiresAt ||
    event.user.premiumExpiresAt < new Date()
  ) {
    throw createError({
      statusCode: 403,
      message,
    });
  }
}
