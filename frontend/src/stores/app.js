import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { frappeRequest } from 'frappe-ui'

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

  const markNotificationAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const addNotification = (notification) => {
    const newNotification = {
      id: Math.max(...notifications.value.map(n => n.id)) + 1,
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    }
    notifications.value.unshift(newNotification)
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const updateSystemStats = (stats) => {
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

  const fetchCurrentUser = async () => {
    try {
      const response = await frappeRequest({
        url: 'frappe.auth.get_logged_user',
        method: 'GET',
      })
      
      if (response) {
        // Update user info from Frappe
        currentUser.value = {
          id: response.name || 1,
          name: response.full_name || 'المدير',
          email: response.email || 'admin@library.com',
          role: response.role_profile_name || 'admin',
          avatar: response.user_image || null,
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
      // Set default user in case of error
      currentUser.value = {
        id: 1,
        name: 'المدير',
        email: 'admin@library.com',
        role: 'مدير النظام',
        avatar: null,
      }
    }
  }

  const logout = async () => {
    try {
      // Use Frappe logout
      await frappeRequest({
        url: '/api/method/frappe.handler.logout',
        method: 'POST',
      })
      
      // Clear user data
      currentUser.value = {
        id: 0,
        name: '',
        email: '',
        role: '',
        avatar: null,
      }
      
      // Redirect to login page
      window.location.href = '/login'
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  const initializeApp = async () => {
    try {
      initializeDarkMode()
      await fetchCurrentUser()
    } catch (error) {
      console.error('Error initializing app:', error)
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
    fetchCurrentUser,
    initializeApp,
    logout,
  }
})
