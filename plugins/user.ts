import { useAuth } from '@/composables/useAuth';

import { defineNuxtPlugin } from '#app';


export default defineNuxtPlugin(async () => {
  const { checkAuth } = useAuth();

  await checkAuth();
});
