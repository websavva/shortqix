import {
  useAuth,
  defineNuxtRouteMiddleware,
  navigateTo,
} from '#imports';

export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
