<template>
  <div id="app"
    class="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex overflow-hidden transition-colors duration-500">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 right-0 z-50 w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-2xl transform transition-all duration-300 ease-in-out border-l border-gray-200/50 dark:border-gray-700/50"
      :class="sidebarOpen ? 'translate-x-0' : 'translate-x-full'">
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FeatherIcon name="book-open" class="w-5 h-5 text-white" />
          </div>
          <div class="mr-3">
            <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">نظام ادارة المكتبة</h1>
          </div>
        </div>
        <button @click="sidebarOpen = false"
          class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden">
          <FeatherIcon name="x" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link v-for="item in navigation" :key="item.name" :to="{ name: item.routeName }"
          class="sidebar-item group"
          :class="$route.name === item.routeName ? 'sidebar-item-active' : 'sidebar-item-inactive'">
          <FeatherIcon :name="item.icon" class="w-5 h-5 ml-3 transition-colors duration-200" />
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="sidebarOpen ? 'lg:mr-64' : 'lg:mr-0'">
      <!-- Header -->

      <header
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-soft border-b border-gray-200/50 dark:border-gray-700/50 z-30">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center">
            <button @click="sidebarOpen = !sidebarOpen"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <FeatherIcon name="menu" class="w-5 h-5" />
            </button>
          </div>
          <div class="flex items-center space-x-4">
            <h2 class="font-bold text-lg">{{ $route.name }}</h2>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FeatherIcon } from 'frappe-ui'

const sidebarOpen = ref(window.innerWidth >= 1024)

const navigation = computed(() => [
  { name: 'الرئيسية', path: '/', icon: 'home', routeName: 'Home' },
  { name: 'الكتب', path: '/books', icon: 'book', routeName: 'Books' },
  { name: 'الأعضاء', path: '/members', icon: 'users', routeName: 'Members' },
  { name: 'المؤلفون', path: '/authors', icon: 'user', routeName: 'Authors' },
  { name: 'التصنيفات', path: '/categories', icon: 'tag', routeName: 'Categories' },
])
</script>

<style>
.sidebar-item {
  @apply flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200;
}

.sidebar-item-active {
  @apply bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm;
}

.sidebar-item-inactive {
  @apply text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100;
}
</style>