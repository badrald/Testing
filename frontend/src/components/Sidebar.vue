<template>
  <!-- Sidebar -->
  <div
    class="fixed inset-y-0 right-0 z-50 w-64 glass-effect shadow-2xl transform transition-all duration-300 ease-in-out border-l border-secondary-200/50 dark:border-secondary-700/50"
    :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'"

  >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg">
            <BookOpenIcon class="w-5 h-5 text-white" />
          </div>
          <div class="mr-3">
            <h1 class="text-lg font-bold text-secondary-900 dark:text-secondary-100">نظام ادارة المكتبة</h1>
          </div>
        </div>
        <button
          @click="toggleSidebar"
          class="p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200 lg:hidden"
        >
          <XMarkIcon class="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="sidebar-item group"
          :class="$route.path === item.path ? 'sidebar-item-active' : 'sidebar-item-inactive'"
        >
          <component
            :is="item.icon"
            class="w-5 h-5 ml-3 transition-colors duration-200"
            :class="$route.path === item.path ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'"
          />
          <span class="font-medium">{{ item.name }}</span>
          
          <!-- Badge for notifications -->
          <span
            v-if="item.badge && item.badge > 0"
            class="mr-auto bg-danger-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center"
          >
            {{ item.badge > 99 ? '99+' : item.badge }}
          </span>
        </router-link>
      </nav>

      <!-- User Profile Section -->
      <div class="border-t border-secondary-200 p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-semibold">
              {{ currentUser.name.charAt(0) }}
            </span>
          </div>
          <div class="mr-3 flex-1">
            <p class="text-sm font-medium text-secondary-900">{{ currentUser.name }}</p>
            <p class="text-xs text-secondary-500">{{ currentUser.role }}</p>
          </div>
          <div class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="p-1 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              <EllipsisVerticalIcon class="w-5 h-5 text-secondary-600" />
            </button>
            
            <!-- User Menu Dropdown -->
            <div
              v-if="showUserMenu"
              class="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-medium border border-secondary-200 py-1"
              @click.stop
            >
              <button
                @click="handleUserAction('profile')"
                class="w-full text-right px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
              >
                <UserIcon class="w-4 h-4 ml-2 inline" />
                الملف الشخصي
              </button>
              <button
                @click="handleUserAction('settings')"
                class="w-full text-right px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
              >
                <CogIcon class="w-4 h-4 ml-2 inline" />
                الإعدادات
              </button>
              <hr class="my-1 border-secondary-200">
              <button
                @click="handleUserAction('logout')"
                class="w-full text-right px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon class="w-4 h-4 ml-2 inline" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Mobile Overlay -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="closeSidebar"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import {
  BookOpenIcon,
  HomeIcon,
  UsersIcon,
  UserIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const appStore = useAppStore()

const showUserMenu = ref(false)

// Computed properties from stores
const sidebarOpen = computed(() => appStore.sidebarOpen)
const currentUser = computed(() => appStore.currentUser)

// Navigation items with dynamic badges
const navigation = computed(() => [
  { name: 'الرئيسية', path: '/', icon: HomeIcon },
  { name: 'الكتب', path: '/books', icon: BookOpenIcon },
  { name: 'الأعضاء', path: '/members', icon: UsersIcon },
  { name: 'المؤلفون', path: '/authors', icon: UserIcon },
  { name: 'التصنيفات', path: '/categories', icon: TagIcon },
  { 
    name: 'المعاملات', 
    path: '/transactions', 
    icon: ClipboardDocumentListIcon,
    badge: 0 // Can be updated with real data
  },
  { name: 'التقارير', path: '/reports', icon: ChartBarIcon },
])

// Methods
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

const closeSidebar = () => {
  appStore.closeSidebar()
}

const handleUserAction = async (action) => {
  showUserMenu.value = false
  
  switch (action) {
    case 'profile':
      console.log('Open profile')
      break
    case 'settings':
      console.log('Open settings')
      break
    case 'logout':
      if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        await appStore.logout()
      }
      break
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200;
}

.sidebar-item-active {
  @apply bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm;
}

.sidebar-item-inactive {
  @apply text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100;
}
</style>
