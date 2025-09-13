import { defineNuxtPlugin, useAuth } from '#imports';

export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth();

  await fetchUser();
});
