<template>
  <header class="glass-effect shadow-soft border-b border-secondary-200/50 dark:border-secondary-700/50 z-30">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      <!-- Left side - Menu button and breadcrumb -->
      <div class="flex items-center">
        <!-- Mobile menu button -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 lg:hidden"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>

        <!-- Desktop menu button -->
        <button
          @click="toggleSidebar"
          class="hidden lg:flex p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>

        <!-- Breadcrumb -->
        <nav class="mr-4 hidden sm:flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <router-link to="/" class="text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 text-sm">
                الرئيسية
              </router-link>
            </li>
            <li v-if="currentPageName !== 'الرئيسية'">
              <span class="text-sm font-medium text-secondary-900 dark:text-secondary-100 mr-2"> > {{ currentPageName }}</span>
            </li>
          </ol>
        </nav>
      </div>

      <!-- Right side - Search, notifications, and user menu -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="hidden md:block relative">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon class="h-4 w-4 text-secondary-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث السريع..."
            class="block w-64 pr-10 pl-3 py-2 border border-secondary-300 rounded-lg text-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/50"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Mobile search button -->
        <button
          @click="showMobileSearch = !showMobileSearch"
          class="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
        >
          <MagnifyingGlassIcon class="w-5 h-5" />
        </button>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all duration-300 transform hover:scale-110"
          title="تبديل الوضع الداكن"
        >
          <SunIcon v-if="darkMode" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 rounded-lg text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 relative"
          >
            <BellIcon class="w-5 h-5" />
            <!-- Notification badge -->
            <span
              v-if="unreadNotificationsCount > 0"
              class="absolute -top-1 -left-1 bg-danger-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center animate-pulse"
            >
              {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-large border border-secondary-200 py-2 max-h-96 overflow-y-auto"
            @click.stop
          >
            <div class="px-4 py-2 border-b border-secondary-200">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-secondary-900">الإشعارات</h3>
                <button
                  v-if="unreadNotificationsCount > 0"
                  @click="markAllAsRead"
                  class="text-xs text-primary-600 hover:text-primary-800"
                >
                  تحديد الكل كمقروء
                </button>
              </div>
            </div>
            
            <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
              <BellIcon class="w-8 h-8 text-secondary-300 mx-auto mb-2" />
              <p class="text-sm text-secondary-500">لا توجد إشعارات</p>
            </div>
            
            <div v-else class="divide-y divide-secondary-100">
              <div
                v-for="notification in notifications.slice(0, 5)"
                :key="notification.id"
                class="px-4 py-3 hover:bg-secondary-50 transition-colors duration-200 cursor-pointer"
                :class="{ 'bg-primary-50/50': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    :class="getNotificationColor(notification.type)"
                  ></div>
                  <div class="mr-3 flex-1">
                    <p class="text-sm font-medium text-secondary-900">{{ notification.title }}</p>
                    <p class="text-xs text-secondary-600 mt-1">{{ notification.message }}</p>
                    <p class="text-xs text-secondary-400 mt-1">{{ formatTime(notification.createdAt) }}</p>
                  </div>
                  <button
                    @click.stop="removeNotification(notification.id)"
                    class="flex-shrink-0 p-1 text-secondary-400 hover:text-secondary-600"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="notifications.length > 5" class="px-4 py-2 border-t border-secondary-200">
              <button class="text-sm text-primary-600 hover:text-primary-800 w-full text-center">
                عرض جميع الإشعارات
              </button>
            </div>
          </div>
        </div>

        <!-- User avatar -->
        <div class="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-semibold">
            {{ currentUser.name.charAt(0) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Search -->
    <div
      v-if="showMobileSearch"
      class="md:hidden px-4 pb-4 border-t border-secondary-200"
    >
      <div class="relative">
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-4 w-4 text-secondary-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="البحث السريع..."
          class="block w-full pr-10 pl-3 py-2 border border-secondary-300 rounded-lg text-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronLeftIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const searchQuery = ref('')
const showNotifications = ref(false)
const showMobileSearch = ref(false)

// Computed properties from store
const currentUser = computed(() => appStore.currentUser)
const notifications = computed(() => appStore.notifications)
const unreadNotificationsCount = computed(() => appStore.unreadNotificationsCount)
const darkMode = computed(() => appStore.darkMode)

// Page name mapping
const pageNames: Record<string, string> = {
  '/': 'الرئيسية',
  '/books': 'الكتب',
  '/members': 'الأعضاء',
  '/authors': 'المؤلفون',
  '/categories': 'التصنيفات',
  '/transactions': 'المعاملات',
  '/reports': 'التقارير',
}

const currentPageName = computed(() => {
  return pageNames[route.path] || 'صفحة غير معروفة'
})

// Methods
const toggleSidebar = () => {
  console.log('Toggle sidebar clicked, current state:', appStore.sidebarOpen)
  appStore.toggleSidebar()
  console.log('New sidebar state:', appStore.sidebarOpen)
}

const toggleDarkMode = () => {
  appStore.toggleDarkMode()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement global search functionality
    console.log('Searching for:', searchQuery.value)
    // You could navigate to a search results page or filter current page
  }
}

const markAsRead = (id: number) => {
  appStore.markNotificationAsRead(id)
}

const markAllAsRead = () => {
  appStore.markAllNotificationsAsRead()
}

const removeNotification = (id: number) => {
  appStore.removeNotification(id)
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-success-500'
    case 'warning':
      return 'bg-warning-500'
    case 'error':
      return 'bg-danger-500'
    default:
      return 'bg-primary-500'
  }
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'الآن'
  if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
  if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
  return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
}

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>