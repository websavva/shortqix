<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <h1 class="text-xl font-semibold">Verifying your account...</h1>
        <p class="text-gray-600">Please wait while we sign you in.</p>
      </div>
      
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-500 text-4xl">❌</div>
        <h1 class="text-xl font-semibold text-red-600">Verification Failed</h1>
        <p class="text-gray-600">{{ error }}</p>
        <NuxtLink 
          to="/login"
          class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </NuxtLink>
      </div>
      
      <div v-else class="space-y-4">
        <div class="text-green-500 text-4xl">✅</div>
        <h1 class="text-xl font-semibold text-green-600">Success!</h1>
        <p class="text-gray-600">You've been successfully signed in.</p>
        <p class="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  const { token } = route.query
  
  if (!token) {
    error.value = 'Invalid verification link'
    isLoading.value = false
    return
  }

  try {
    await $fetch(`/api/auth/verify?token=${token}`)
    // Success - redirect to home
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (e) {
    error.value = e.data?.message || e.message || 'Verification failed'
  } finally {
    isLoading.value = false
  }
})
</script> 