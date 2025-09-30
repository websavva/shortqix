import { type H3Event, createError } from 'h3';

export function assertPremium(
  event: H3Event,
  message: string = 'User is not premium',
) {
  if (
    !event.context.user?.isPremium ||
    !event.context.user?.premiumExpiresAt ||
    event.context.user.premiumExpiresAt < new Date()
  ) {
    throw createError({
      statusCode: 403,
      message,
    });
  }
}
