import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarOpen = ref(window.innerWidth >= 1024) // Open by default on large screens
  const darkMode = ref(false)
  const currentUser = ref({
    id: 1,
    name: 'المدير',
    email: 'admin@library.com',
    role: 'admin',
    avatar: null,
  })

  const notifications = ref([
    {
      id: 1,
      title: 'كتاب متأخر',
      message: 'كتاب "1984" متأخر عن موعد الإرجاع',
      type: 'warning',
      read: false,
      createdAt: '2024-01-20T10:30:00Z',
    },
    {
      id: 2,
      title: 'عضو جديد',
      message: 'تم تسجيل عضو جديد: أحمد محمد',
      type: 'info',
      read: false,
      createdAt: '2024-01-20T09:15:00Z',
    },
    {
      id: 3,
      title: 'نسخ احتياطي',
      message: 'تم إنشاء النسخة الاحتياطية بنجاح',
      type: 'success',
      read: true,
      createdAt: '2024-01-20T03:00:00Z',
    },
  ])

  const systemStats = ref({
    systemStatus: 'healthy',
    lastBackup: '2024-01-20T03:00:00Z',
    pendingUpdates: 3,
    diskUsage: 65,
    memoryUsage: 42,
  })

  // Getters
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )

  const unreadNotificationsCount = computed(() => 
    unreadNotifications.value.length
  )

  const isSystemHealthy = computed(() => 
    systemStats.value.systemStatus === 'healthy'
  )

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const openSidebar = () => {
    sidebarOpen.value = true
  }

  const markNotificationAsRead = (id: number) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const addNotification = (notification: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
  }) => {
    const newNotification = {
      id: Math.max(...notifications.value.map(n => n.id)) + 1,
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    }
    notifications.value.unshift(newNotification)
  }

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const updateSystemStats = (stats: Partial<typeof systemStats.value>) => {
    systemStats.value = { ...systemStats.value, ...stats }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    updateDarkModeClass()
    localStorage.setItem('darkMode', darkMode.value.toString())
  }

  const initializeDarkMode = () => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      darkMode.value = savedDarkMode === 'true'
    } else {
      // Check system preference
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDarkModeClass()
  }

  const updateDarkModeClass = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const logout = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear user data
      currentUser.value = {
        id: 0,
        name: '',
        email: '',
        role: '',
        avatar: null,
      }
      
      // Redirect to login page
      // In real app, this would use router.push('/login')
      console.log('User logged out')
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  return {
    // State
    sidebarOpen,
    darkMode,
    currentUser,
    notifications,
    systemStats,
    
    // Getters
    unreadNotifications,
    unreadNotificationsCount,
    isSystemHealthy,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleDarkMode,
    initializeDarkMode,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    removeNotification,
    updateSystemStats,
    logout,
  }
})