import {
  useRequestFetch,
  useRouter,
  computed,
  readonly,
  useState,
  ref,
} from '#imports';
import type { Serialize } from 'nitropack';
import { FetchError } from 'ofetch';

import type { User } from '#server/db/entities';

export const useAuth = () => {
  let abortController: AbortController | null = null;

  const pending = ref(false);

  const localFetch = useRequestFetch();

  const user = useState<ReturnType<
    typeof normalizeUser
  > | null>('user', () => null);

  const isGuest = computed(() => !user.value);

  function normalizeUser(user: User | Serialize<User>) {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      premiumExpiresAt: user.premiumExpiresAt
        ? new Date(user.premiumExpiresAt)
        : null,
    };
  }

  const router = useRouter();

  const isAuthenticated = computed(
    () => user.value != null,
  );

  const isPremium = computed(() => {
    if (!user.value) return false;

    const { isPremium, premiumExpiresAt } = user.value;

    return Boolean(
      isPremium &&
        premiumExpiresAt &&
        new Date(premiumExpiresAt) > new Date(),
    );
  });

  async function logout(redirectTo: string | false = '/') {
    try {
      pending.value = true;

      await sleep(3e3);

      await localFetch('/api/auth/logout', {
        method: 'POST',
      });

      if (redirectTo) router.push(redirectTo);

      resetUser();
    } finally {
      pending.value = false;
    }
  }

  async function updateUser(partialUser: Partial<User>) {
    user.value = normalizeUser({
      ...(user.value as User),
      ...partialUser,
    });
  }

  async function resetUser() {
    user.value = null;
  }

  async function cancelFetchUser() {
    abortController?.abort();

    abortController = null;

    pending.value = false;
  }

  async function fetchUser() {
    cancelFetchUser();

    pending.value = true;

    abortController = new AbortController();

    return localFetch('/api/auth/me', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then((response) => {
        user.value = normalizeUser(response.user);
      })
      .catch((err) => {
        if (
          err instanceof FetchError &&
          err.statusCode !== 401
        ) {
          throw err;
        }
      })
      .finally(() => {
        pending.value = false;
      });
  }

  return {
    user: readonly(user),
    pending: readonly(pending),
    isAuthenticated,
    isPremium,
    isGuest,

    logout,
    fetchUser,
    cancelFetchUser,
    resetUser,
    updateUser,
  };
};
