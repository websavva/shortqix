<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
        <p class="text-xl text-gray-600">Unlock advanced analytics and unlimited URL shortening</p>
      </div>

      <!-- Premium Features -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Premium Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Advanced Analytics</h3>
              <p class="text-gray-600">Detailed click tracking and performance insights</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Unlimited URLs</h3>
              <p class="text-gray-600">Create as many shortened URLs as you need</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Custom Slugs</h3>
              <p class="text-gray-600">Create custom, memorable short URLs</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">Priority Support</h3>
              <p class="text-gray-600">Get help when you need it most</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div v-if="!payment" class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Payment</h2>
          <p class="text-gray-600 mb-6">Pay with Bitcoin to upgrade your account</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-blue-700 font-medium">Price: 0.001 BTC (~$40-50 USD)</p>
            <p class="text-blue-600 text-sm">Payment expires in 30 minutes</p>
          </div>
          <button 
            :disabled="isCreating"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            @click="createPayment"
          >
            <span v-if="isCreating">Creating Payment...</span>
            <span v-else>Pay with Bitcoin</span>
          </button>
        </div>

        <!-- Payment Details -->
        <div v-else class="space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Bitcoin Payment</h2>
            <p class="text-gray-600">Send exactly <span class="font-bold">{{ payment.amount }} BTC</span> to the address below</p>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center">
            <div class="bg-white border border-gray-300 rounded-lg p-4">
              <div v-if="qrCode" class="w-48 h-48" v-html="qrCode"></div>
              <div v-else class="w-48 h-48 bg-gray-100 flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>

          <!-- Bitcoin Address -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Bitcoin Address:</label>
            <div class="flex items-center space-x-2">
              <input 
                :value="payment.bitcoinAddress" 
                readonly 
                class="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
              />
              <button 
                class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                @click="copyAddress"
              >
                Copy
              </button>
            </div>
          </div>

          <!-- Payment Status -->
          <div class="text-center">
            <div v-if="paymentStatus === 'pending'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-yellow-700">Waiting for payment...</p>
              <p class="text-yellow-600 text-sm">This page will automatically update when payment is received</p>
            </div>
            <div v-else-if="paymentStatus === 'paid'" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-green-700 font-medium">Payment received! Your account has been upgraded to premium.</p>
              <button 
                class="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                @click="goToAnalytics"
              >
                Go to Analytics
              </button>
            </div>
            <div v-else-if="paymentStatus === 'expired'" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-700">Payment expired. Please create a new payment request.</p>
              <button 
                class="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                @click="resetPayment"
              >
                Try Again
              </button>
            </div>
          </div>

          <!-- Timer -->
          <div v-if="paymentStatus === 'pending'" class="text-center">
            <p class="text-sm text-gray-600">
              Expires in: {{ timeRemaining }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const { user, isAuthenticated } = useAuth()

// Redirect if already premium
if (user.value?.isPremium) {
  router.push('/analytics')
}

const payment = ref(null)
const paymentStatus = ref('pending')
const qrCode = ref('')
const error = ref('')
const isCreating = ref(false)
const timeRemaining = ref('')
let checkInterval = null
let timerInterval = null

const createPayment = async () => {
  try {
    isCreating.value = true
    error.value = ''
    
    const { data } = await $fetch('/api/crypto/create-payment', {
      method: 'POST'
    })
    
    if (data.success) {
      payment.value = data.payment
      await generateQRCode()
      startPaymentChecking()
      startTimer()
    }
  } catch (err) {
    error.value = 'Failed to create payment request'
    console.error(err)
  } finally {
    isCreating.value = false
  }
}

const generateQRCode = async () => {
  try {
    const { data } = await $fetch('/api/qr/generate', {
      method: 'POST',
      body: {
        text: payment.value.bitcoinAddress
      }
    })
    qrCode.value = data.svg
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
}

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(payment.value.bitcoinAddress)
  } catch (err) {
    error.value = 'Failed to copy address'
  }
}

const checkPaymentStatus = async () => {
  if (!payment.value) return
  
  try {
    const { data } = await $fetch(`/api/crypto/check-payment?paymentId=${payment.value.id}`)
    
    if (data.success) {
      paymentStatus.value = data.status
      
      if (data.status === 'paid') {
        stopPaymentChecking()
        stopTimer()
        // Refresh user data
        await checkAuth()
      } else if (data.status === 'expired') {
        stopPaymentChecking()
        stopTimer()
      }
    }
  } catch (err) {
    console.error('Failed to check payment status:', err)
  }
}

const startPaymentChecking = () => {
  checkInterval = setInterval(checkPaymentStatus, 10000) // Check every 10 seconds
}

const stopPaymentChecking = () => {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    const now = new Date()
    const expiresAt = new Date(payment.value.expiresAt)
    const diff = expiresAt - now
    
    if (diff <= 0) {
      timeRemaining.value = 'Expired'
      stopTimer()
    } else {
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const resetPayment = () => {
  payment.value = null
  paymentStatus.value = 'pending'
  qrCode.value = ''
  error.value = ''
  stopPaymentChecking()
  stopTimer()
}

const goToAnalytics = () => {
  router.push('/analytics')
}

onMounted(() => {
  // Check if user is already premium
  if (user.value?.isPremium) {
    router.push('/analytics')
  }
})

onUnmounted(() => {
  stopPaymentChecking()
  stopTimer()
})
</script> 