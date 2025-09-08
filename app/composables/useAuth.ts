import {
  useRequestFetch,
  useFetch,
  useRouter,
  computed,
  readonly,
} from '#imports';

export const useAuth = () => {
  const localFetch = useRequestFetch();

  const {
    data: user,
    execute: checkAuth,
    pending: isLoading,
  } = useFetch('/api/auth/me', {
    immediate: false,
    transform: ({ user }) => user,
  });

  const router = useRouter();

  const isAuthenticated = computed(
    () => user.value != null,
  );

  const isPremium = computed(() => {
    return user.value?.isPremium;
  });

  const logout = async () => {
    await localFetch('/api/auth/logout', {
      method: 'POST',
    });
    user.value = null;

    router.push('/login');
  };

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    isPremium,

    logout,
    checkAuth,
  };
};
