export default defineNuxtRouteMiddleware((to, from) => {
  const { isPremium } = useAuth();

  if (!isPremium.value) {
    throw createError({
      statusCode: 403,
      statusMessage: "You're not premium user",
    });
  }
});
