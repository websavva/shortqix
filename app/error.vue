<template>
  <TheApp>
    <div class="max-w-4xl w-full mx-auto px-6 py-12 max-sm:pt-5">
      <!-- Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6"
        >
          <Bug class="w-12 h-12 text-primary" />
        </div>
        <h1 class="text-4xl max-sm:text-2xl font-bold text-foreground mb-4">
          {{ errorTitle }}
        </h1>
        <p
          class="text-xl max-sm:text-base text-muted-foreground max-w-2xl mx-auto"
        >
          {{ errorDescription }}
        </p>
      </div>

      <!-- Error Details Card -->
      <div
        class="bg-card border border-border rounded-xl p-8 mb-8 shadow-sm"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Error Information -->
          <div>
            <h2
              class="text-lg font-semibold text-foreground mb-4 flex items-center"
            >
              <Info class="w-5 h-5 mr-2 text-primary" />
              Error Details
            </h2>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center py-2 border-b border-border"
              >
                <span
                  class="text-sm font-medium text-muted-foreground"
                  >Status Code</span
                >
                <code
                  class="text-sm font-mono bg-muted px-2 py-1 rounded"
                >
                  {{ error?.statusCode || 'Unknown' }}
                </code>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-border"
              >
                <span
                  class="text-sm font-medium text-muted-foreground"
                  >Error Type</span
                >
                <span
                  class="text-sm font-medium text-foreground"
                >
                  {{ getErrorType(error?.statusCode) }}
                </span>
              </div>
              <div
                class="flex justify-between items-start py-2"
              >
                <span
                  class="text-sm font-medium text-muted-foreground"
                  >Timestamp</span
                >
                <NuxtTime
                  :datetime="new Date()"
                  class="text-sm text-foreground"
                />
              </div>
            </div>
          </div>

          <!-- Suggested Actions -->
          <div>
            <h2
              class="text-lg font-semibold text-foreground mb-4 flex items-center"
            >
              <Lightbulb
                class="w-5 h-5 mr-2 text-primary"
              />
              What you can do
            </h2>

            <div class="space-y-3">
              <div
                class="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
              >
                <RefreshCw
                  class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p
                    class="text-sm font-medium text-foreground"
                  >
                    Try Again
                  </p>

                  <p class="text-xs text-muted-foreground">
                    Refresh the page or retry your action
                  </p>
                </div>
              </div>
              <div
                class="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
              >
                <Home
                  class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p
                    class="text-sm font-medium text-foreground"
                  >
                    Go Home
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Return to the main dashboard
                  </p>
                </div>
              </div>
              <div
                class="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
              >
                <MessageCircle
                  class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p
                    class="text-sm font-medium text-foreground"
                  >
                    Get Support
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Contact our support team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <Button
          size="lg"
          class="flex-1 sm:flex-none sm:min-w-[160px]"
          @click="handleRetry"
        >
          <template #icon>
            <RefreshCw />
          </template>
          Try Again
        </Button>

        <Button
          variant="outline"
          size="lg"
          as="NuxtLink"
          to="/"
          class="sm:flex-1 sm:flex-none sm:min-w-[160px]"
        >
          <template #icon>
            <Home />
          </template>

          Go Home
        </Button>

        <Button
          variant="outline"
          size="lg"
          class="sm:flex-1 sm:flex-none sm:min-w-[160px]"
          @click="reportIssue"
        >
          <template #icon>
            <MessageCircle />
          </template>

          Report Issue
        </Button>
      </div>
    </div>
  </TheApp>
</template>

<script setup lang="ts">
import {
  Bug,
  RefreshCw,
  Home,
  MessageCircle,
  Info,
  Lightbulb,
} from 'lucide-vue-next';
import { clearError, useRoute, computed } from '#imports';
import { NuxtTime } from '#components';

import Button from '@/components/ui/Button.vue';
import TheApp from '@/components/TheApp.vue';

// Props from Nuxt error handling
interface Props {
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };
}

const props = defineProps<Props>();

const errorTitle = computed(() => {
  const statusCode = props.error?.statusCode;

  switch (statusCode) {
    case 404:
      return 'Page Not Found';
    case 403:
      return 'Access Denied';
    case 401:
      return 'Authentication Required';
    case 500:
      return 'Internal Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      return 'An Error Occurred';
  }
});

const errorDescription = computed(() => {
  const statusCode = props.error?.statusCode;
  const message =
    props.error?.message || props.error?.statusMessage;

  if (message && message !== 'An error occurred') {
    return message;
  }

  switch (statusCode) {
    case 404:
      return "The page you're looking for doesn't exist or may have been moved to a different location.";
    case 403:
      return "You don't have the necessary permissions to access this resource. Please check your account status.";
    case 401:
      return 'You need to be logged in to access this page. Please sign in and try again.';
    case 500:
      return 'Our servers encountered an unexpected error while processing your request. Our team has been notified.';
    case 502:
      return "We're experiencing connectivity issues with our backend services. Please try again in a few moments.";
    case 503:
      return "Our services are temporarily unavailable for maintenance. We'll be back online shortly.";
    case 504:
      return 'The request timed out while waiting for a response from our servers. Please try again.';
    default:
      return "Something unexpected happened. Don't worry, we're here to help you get back on track.";
  }
});

const errorId = computed(() => {
  return Math.random().toString(36).substring(2, 15);
});

// Methods
function getErrorType(statusCode?: number): string {
  if (!statusCode) return 'Unknown';

  if (statusCode >= 400 && statusCode < 500) {
    return 'Client Error';
  } else if (statusCode >= 500 && statusCode < 600) {
    return 'Server Error';
  }

  return 'Other';
}

function handleRetry() {
  const route = useRoute();

  clearError({ redirect: route.fullPath });
}

function reportIssue() {
  const subject = encodeURIComponent(
    `Error Report - ${errorTitle.value}`,
  );
  const body = encodeURIComponent(`
Error Report Details:

Error Information:
- Status Code: ${props.error?.statusCode || 'Unknown'}
- Error Type: ${getErrorType(props.error?.statusCode)}
- Message: ${props.error?.message || 'No message provided'}

Page Information:
- URL: ${window.location.href}
- User Agent: ${window.navigator.userAgent}
- Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
[Your description here]

Thank you for helping us improve our service!
  `);

  window.open(
    `mailto:support@shortqix.com?subject=${subject}&body=${body}`,
    '_blank',
  );
}
</script>
