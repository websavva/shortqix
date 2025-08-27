<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-xl shadow-xl p-12">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-8">Sign In</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-8">
          <div>
            <label for="email" class="block text-lg font-medium text-gray-700 mb-3">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email address"
              autocomplete="email"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': emailError }"
              @blur="validateEmail"
            />
            <p v-if="emailError" class="mt-2 text-base text-red-600">{{ emailError }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Sending magic link...' : 'Send Magic Link' }}
          </button>
          
          <div v-if="isLoading" class="flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          </div>
        </form>
        
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-base text-red-700">{{ error }}</p>
        </div>
        
        <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p class="text-base text-green-700">{{ success }}</p>
        </div>
        
        <div class="mt-8 text-center">
          <p class="text-base text-gray-600">
            We'll send you a secure link to sign in to your account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

const email = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)
const emailError = ref('')
const isFormValid = ref(false)

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email.value) {
    emailError.value = 'Email is required'
    isFormValid.value = false
    return false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    isFormValid.value = false
    return false
  } else {
    emailError.value = ''
    isFormValid.value = true
    return true
  }
}

const handleLogin = async () => {
  if (!validateEmail()) {
    return
  }

  try {
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    await $fetch('/api/auth/magic-link', {
      method: 'POST',
      body: { email: email.value }
    })
    
    success.value = 'Magic link sent! Check your email and click the link to sign in.'
    email.value = ''
    emailError.value = ''
    isFormValid.value = false
  } catch (e) {
    error.value = e.data?.message || e.message || 'An error occurred'
  } finally {
    isLoading.value = false
  }
}

// Watch for email changes to clear errors
watch(email, () => {
  if (emailError.value) {
    validateEmail()
  }
})
</script> 