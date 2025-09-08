<template>
  <div class="min-h-screen">
    <!-- Header with auth status -->
    <!-- Removed header/navbar, now handled by layout -->
    <div class="max-w-4xl mx-auto py-8 px-4">
      <!-- URL Input -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <input
          v-model="longUrl"
          type="url"
          placeholder="Enter your long URL here"
          class="w-full p-3 border rounded mb-4"
        />

        <div
          v-if="isAuthenticated && user?.isPremium"
          class="mb-4"
        >
          <input
            v-model="customSlug"
            type="text"
            placeholder="Custom slug (optional)"
            class="w-full p-3 border rounded"
          />
          <p class="text-sm text-gray-500 mt-1">
            Create a custom short URL like
            yoursite.com/s/mybrand
          </p>
        </div>

        <button
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition disabled:opacity-50"
          @click="shortenUrl"
        >
          {{ isLoading ? 'Shortening...' : 'Shorten URL' }}
        </button>

        <!-- Result -->
        <div
          v-if="shortUrl"
          class="mt-6 p-4 bg-gray-50 rounded"
        >
          <p class="font-medium">Your shortened URL:</p>
          <div class="flex items-center gap-2 mt-2">
            <input
              :value="shortUrl"
              readonly
              class="flex-1 p-2 border rounded"
            />
            <button
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              @click="copyUrl"
            >
              Copy
            </button>
            <button
              v-if="isAuthenticated && user?.isPremium"
              :disabled="isGeneratingQR"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              @click="generateQR"
            >
              {{
                isGeneratingQR ? 'Generating...' : 'QR Code'
              }}
            </button>
          </div>

          <!-- QR Code Display -->
          <div
            v-if="qrCode"
            class="mt-4 text-center"
          >
            <p class="text-sm text-gray-600 mb-2">
              QR Code for your shortened URL:
            </p>
            <img
              :src="qrCode"
              alt="QR Code"
              class="mx-auto border rounded"
            />
            <button
              class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              @click="downloadQR"
            >
              Download QR Code
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-4 p-3 bg-red-100 text-red-700 rounded"
        >
          {{ error }}
        </div>
      </div>

      <!-- Premium Features -->
      <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">
          {{
            isAuthenticated && user?.isPremium
              ? 'Premium Features'
              : 'Upgrade to Premium'
          }}
        </h2>
        <ul class="space-y-2">
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Custom URL slugs
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Click analytics
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            QR code generation
          </li>
        </ul>

        <div v-if="!isAuthenticated || !user?.isPremium">
          <button
            :disabled="isUpgrading"
            class="mt-4 w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 transition disabled:opacity-50"
            @click="upgradeToPremium"
          >
            {{
              isUpgrading
                ? 'Upgrading...'
                : 'Upgrade Now - Only $5/month'
            }}
          </button>
        </div>

        <div
          v-else
          class="mt-4 p-3 bg-green-50 text-green-700 rounded"
        >
          <p class="font-medium">Premium Active</p>
          <p class="text-sm">Enjoy all premium features!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, checkAuth } = useAuth();
const router = useRouter();

const longUrl = ref('');
const shortUrl = ref('');
const customSlug = ref('');
const error = ref('');
const isLoading = ref(false);
const isUpgrading = ref(false);
const qrCode = ref('');
const isGeneratingQR = ref(false);

// Check auth on page load
await checkAuth();

const shortenUrl = async () => {
  if (!longUrl.value) {
    error.value = 'Please enter a URL';
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';

    const data = await $fetch('/api/shorten', {
      method: 'POST',
      body: {
        url: longUrl.value,
        customSlug: customSlug.value || undefined,
      },
    });
    shortUrl.value = data.shortUrl;
    customSlug.value = '';
  } catch (e) {
    error.value =
      e.data?.message ||
      e.message ||
      'Something went wrong';
  } finally {
    isLoading.value = false;
  }
};

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.value);
  } catch (e) {
    error.value = 'Failed to copy URL';
  }
};

const upgradeToPremium = async () => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }

  try {
    isUpgrading.value = true;
    error.value = '';

    await $fetch('/api/premium/upgrade', {
      method: 'POST',
    });

    // Refresh user data
    await checkAuth();
  } catch (e) {
    error.value =
      e.data?.message ||
      e.message ||
      'Failed to upgrade to premium';
  } finally {
    isUpgrading.value = false;
  }
};

const generateQR = async () => {
  if (!shortUrl.value) return;

  try {
    isGeneratingQR.value = true;
    error.value = '';

    const shortCode = shortUrl.value.split('/s/')[1];
    const data = await $fetch('/api/qr/generate', {
      method: 'POST',
      body: { shortCode },
    });

    qrCode.value = data.qrCode;
  } catch (e) {
    error.value =
      e.data?.message ||
      e.message ||
      'Failed to generate QR code';
  } finally {
    isGeneratingQR.value = false;
  }
};

const downloadQR = async () => {
  if (!qrCode.value) return;

  try {
    const link = document.createElement('a');
    link.href = qrCode.value;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    error.value = 'Failed to download QR code';
  }
};
</script>
