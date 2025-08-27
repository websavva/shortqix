<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <!-- Brand -->
        <div class="flex flex-col items-center text-center">
          <h1 class="text-3xl font-bold text-gray-900">ShortQix</h1>
          <span class="text-sm text-gray-500 font-medium uppercase tracking-wide">URL Shortener</span>
        </div>

        <!-- Auth Actions -->
        <div v-if="isAuthenticated" class="flex items-center justify-center gap-4">
          <div class="flex flex-col items-center text-center mr-2">
            <span class="text-sm text-gray-500 font-medium">Welcome back,</span>
            <span class="text-base text-gray-700 font-semibold">{{ user?.email }}</span>
          </div>
          <button
            v-if="user?.isPremium"
            @click="goAnalytics"
            class="px-4 py-2 bg-green-600 text-white text-base font-medium rounded hover:bg-green-700 transition-colors"
          >
            Analytics
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 border border-red-600 text-red-600 text-base font-medium rounded hover:bg-red-600 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
        <div v-else>
          <button
            @click="goLogin"
            class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-8 py-16">
      <div class="w-full max-w-6xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <hr class="border-gray-200" />
    <footer class="bg-gray-800 text-gray-200 py-4 px-4">
      <div class="max-w-6xl mx-auto flex justify-center items-center">
        <div class="flex flex-col items-center text-center space-y-1">
          <span class="text-base font-semibold text-white">ShortQix</span>
          <span class="text-sm text-gray-400">Simple, fast URL shortening</span>
          <span class="text-sm text-gray-400">&copy; {{ new Date().getFullYear() }} ShortQix. All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
}
const goLogin = () => router.push('/login')
const goAnalytics = () => router.push('/analytics')
</script> 