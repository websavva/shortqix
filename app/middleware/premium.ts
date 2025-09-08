import {
  useAuth,
  defineNuxtRouteMiddleware,
  createError,
} from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const { isPremium } = useAuth();

  if (!isPremium.value) {
    throw createError({
      statusCode: 403,
      statusMessage: "You're not premium user",
    });
  }
});
