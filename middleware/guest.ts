import {
  useAuth,
  defineNuxtRouteMiddleware,
  navigateTo,
} from '#imports';

export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated.value) {
    return navigateTo('/');
  }
});
