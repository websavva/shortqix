<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div class="flex space-x-4">
          <button 
            @click="goHome" 
            class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to Home
          </button>
          <button 
            v-if="!user?.isPremium"
            @click="goToPremium" 
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total URLs</h3>
        <p class="text-3xl font-bold text-blue-600">{{ analytics.totalUrls || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Clicks</h3>
        <p class="text-3xl font-bold text-green-600">{{ analytics.totalClicks || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Average Clicks</h3>
        <p class="text-3xl font-bold text-purple-600">{{ analytics.totalUrls ? Math.round(analytics.totalClicks / analytics.totalUrls) : 0 }}</p>
      </div>
    </div>

    <!-- URLs Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Your URLs</h2>
      
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="!analytics.urls?.length" class="text-center py-8">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-700">No URLs found. Create your first shortened URL to see analytics.</p>
        </div>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short URL</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="url in analytics.urls" :key="url.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-sm text-gray-900 font-mono">{{ getShortUrl(url) }}</span>
                  <button 
                    @click="copyUrl(getShortUrl(url))"
                    class="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy URL"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-xs truncate">
                  <span class="text-sm text-gray-900">{{ url.longUrl }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900 font-medium">{{ url.clicks }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ formatDate(url.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-700">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: ['auth', 'premium']
});

const runtimeConfig = useRuntimeConfig()

const { user, isAuthenticated, checkAuth } = useAuth()
const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goToPremium = () => {
  router.push('/premium')
}

// Fetch analytics
const {
  data: analytics,
  error,
  pending: isLoading,
} = await useFetch('/api/analytics/urls')

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
  } catch (e) {
    error.value = 'Failed to copy URL'
  }
}

const getShortUrl = (row) => {
  return `${runtimeConfig.public.baseUrl}/s/${row.customSlug || row.code}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script> 