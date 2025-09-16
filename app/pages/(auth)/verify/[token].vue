<template>
  <div class="min-h-screen flex items-start justify-center">
    <Container class="w-xl mt-10">
      <SizeTransition concurrent>
        <div
          :key="status"
          :class="
            cn(
              'rounded-3xl border border-primary/20 p-12 relative overflow-hidden shadow-lg shadow-primary/20',
              {
                'border-destructive/20': verificationError,
                'shadow-destructive/20': verificationError,
              },
            )
          "
        >
          <!-- Pending State -->
          <div class="relative text-center space-y-8">
            <template v-if="pending">
              <div
                class="mx-auto size-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-lg"
              >
                <div
                  class="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                ></div>
              </div>
              <div class="space-y-5">
                <h1
                  class="text-3xl font-bold text-foreground"
                >
                  Verifying Your Email
                </h1>
                <p
                  class="text-md text-muted-foreground max-w-md mx-auto"
                >
                  Please wait while we verify your email
                  address. This may take a few moments.
                </p>
              </div>

              <!-- Progress Steps -->
              <div
                class="flex items-center justify-center space-x-4 pt-4"
              >
                <div class="flex items-center space-x-2">
                  <div
                    class="w-3 h-3 bg-primary rounded-full animate-pulse"
                  ></div>
                  <span
                    class="text-sm text-muted-foreground"
                    >Processing</span
                  >
                </div>
                <div class="w-8 h-0.5 bg-border"></div>
                <div class="flex items-center space-x-2">
                  <div
                    class="w-3 h-3 bg-border rounded-full"
                  ></div>
                  <span
                    class="text-sm text-muted-foreground"
                    >Verifying</span
                  >
                </div>
                <div class="w-8 h-0.5 bg-border"></div>
                <div class="flex items-center space-x-2">
                  <div
                    class="w-3 h-3 bg-border rounded-full"
                  ></div>
                  <span
                    class="text-sm text-muted-foreground"
                    >Complete</span
                  >
                </div>
              </div>
            </template>

            <template v-else-if="isVerified">
              <!-- Success Icon -->
              <div
                class="mx-auto size-20 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <CheckIcon class="size-10 text-primary" />
              </div>

              <!-- Success Content -->
              <div class="space-y-6">
                <div class="space-y-3">
                  <h1
                    class="text-3xl font-bold text-foreground"
                  >
                    Email Verified Successfully
                  </h1>
                  <p
                    class="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
                  >
                    Your account is now active and ready to
                    use. You can start creating short links
                    and managing your analytics.
                  </p>
                </div>

                <!-- Status Indicators -->
                <div
                  class="flex items-center justify-center space-x-8 py-4"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-2 h-2 bg-green-500 rounded-full"
                    ></div>
                    <span
                      class="text-sm font-medium text-foreground"
                      >Email Verified</span
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-2 h-2 bg-green-500 rounded-full"
                    ></div>
                    <span
                      class="text-sm font-medium text-foreground"
                      >Account Active</span
                    >
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="pt-4">
                <Button
                  as="NuxtLink"
                  href="/dashboard"
                  class="w-full h-12 text-base font-medium"
                >
                  Go to Dashboard
                </Button>
              </div>
            </template>

            <template v-else>
              <div
                class="mx-auto size-20 bg-destructive/10 rounded-3xl flex items-center justify-center"
              >
                <MailWarningIcon
                  class="size-10 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
              <div class="space-y-4">
                <h1
                  class="text-4xl font-bold text-foreground"
                >
                  Verification Failed
                </h1>
                <p
                  class="text-xl text-muted-foreground max-w-lg mx-auto"
                >
                  {{
                    verificationError?.data?.message ||
                    'The verification link is invalid or has expired.'
                  }}
                </p>
              </div>

              <!-- Error Details -->
              <div
                class="bg-destructive/5 border border-destructive/20 rounded-xl p-6 text-left max-w-md mx-auto"
              >
                <h3
                  class="font-semibold text-foreground mb-3"
                >
                  What can you do?
                </h3>
                <ul
                  class="space-y-2 text-sm text-muted-foreground"
                >
                  <li class="flex items-start space-x-2">
                    <div
                      class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"
                    ></div>
                    <span
                      >Check if the link is complete and not
                      truncated</span
                    >
                  </li>
                  <li class="flex items-start space-x-2">
                    <div
                      class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"
                    ></div>
                    <span
                      >Verify the link hasn't expired</span
                    >
                  </li>
                  <li class="flex items-start space-x-2">
                    <div
                      class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"
                    ></div>
                    <span
                      >Request a new verification email if
                      needed</span
                    >
                  </li>
                </ul>
              </div>

              <div class="space-y-4 pt-4">
                <Button
                  as="NuxtLink"
                  href="/login"
                  class="w-full h-14 text-lg"
                >
                  Back to Sign In
                </Button>

                <Button
                  variant="outline"
                  class="w-full h-12"
                  :disabled="pending"
                  @click="onVerify"
                >
                  Try Again
                </Button>
              </div>
            </template>
          </div>
        </div>
      </SizeTransition>
    </Container>
  </div>
</template>

<script setup lang="ts">
import {
  CheckIcon,
  MailWarningIcon,
} from 'lucide-vue-next';
import {
  useRoute,
  useRouter,
  onMounted,
  useAuth,
} from '#imports';

import { cn } from '@/utils';
import SizeTransition from '@/components/ui/SizeTransition.vue';
import Container from '@/components/ui/Container.vue';
import { useToast } from '@/components/ui/toast';
import Button from '@/components/ui/Button.vue';

definePageMeta({
  middleware: 'guest',
});

const $route = useRoute();
const $toast = useToast();

const token = computed(() => $route.params.token);

const {
  execute: verify,
  error: verificationError,
  pending,
  data: isVerified,
  status,
} = useFetch('/api/auth/verify', {
  method: 'POST',
  body: {
    token,
  },
  immediate: false,
  server: false,
  credentials: 'include',
  watch: false,
});

const { fetchUser } = useAuth();

status.value = 'pending';

async function onVerify() {
  try {
    verificationError.value = undefined;
    status.value = 'pending';

    await sleep(1000);

    await verify();

    if (verificationError.value) {
      throw verificationError.value;
    }

    await fetchUser();

    $toast.toast({
      title: 'Verification completed',
      description: 'You are now signed in',
    });
  } catch (err: any) {
    verificationError.value = err;
    $toast.toast({
      title: 'Verification failed',
      description: err?.data?.message || 'Please try again',
    });
  }
}

onMounted(onVerify);
</script>
