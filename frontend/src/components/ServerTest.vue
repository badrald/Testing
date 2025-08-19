<template>
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
      اختبار الاتصال بالسيرفر
    </h3>
    
    <!-- Server Status -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          حالة الاتصال بالسيرفر:
        </span>
        <span 
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="serverStatus === 'connected' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'"
        >
          <div 
            class="w-2 h-2 rounded-full mr-2"
            :class="serverStatus === 'connected' ? 'bg-success-500' : 'bg-danger-500'"
          ></div>
          {{ serverStatus === 'connected' ? 'متصل' : 'غير متصل' }}
        </span>
      </div>
      
      <!-- User Info -->
      <div v-if="userInfo" class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
        <h4 class="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">معلومات المستخدم:</h4>
        <div class="space-y-1 text-sm text-primary-700 dark:text-primary-200">
          <div><strong>الاسم:</strong> {{ userInfo.full_name || 'غير محدد' }}</div>
          <div><strong>البريد الإلكتروني:</strong> {{ userInfo.email || 'غير محدد' }}</div>
          <div><strong>النوع:</strong> {{ userInfo.user_type || 'غير محدد' }}</div>
        </div>
      </div>
    </div>

    <!-- Test Buttons -->
    <div class="space-y-3">
      <Button
        @click="testPing"
        :loading="pingLoading"
        class="w-full btn-primary"
      >
        <ServerStackIcon class="w-4 h-4 ml-2" />
        اختبار Ping
      </Button>
      
      <Button
        @click="testUserInfo"
        :loading="userLoading"
        class="w-full bg-success-600 hover:bg-success-700 text-white"
      >
        <UserIcon class="w-4 h-4 ml-2" />
        اختبار معلومات المستخدم
      </Button>
      
      <Button
        @click="testSession"
        :loading="sessionLoading"
        class="w-full bg-warning-600 hover:bg-warning-700 text-white"
      >
        <KeyIcon class="w-4 h-4 ml-2" />
        اختبار الجلسة
      </Button>
    </div>

    <!-- Results -->
    <div v-if="testResults.length > 0" class="mt-6">
      <h4 class="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
        نتائج الاختبار:
      </h4>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div 
          v-for="(result, index) in testResults" 
          :key="index"
          class="p-3 rounded-lg border text-sm"
          :class="result.success 
            ? 'bg-success-50 border-success-200 text-success-800' 
            : 'bg-danger-50 border-danger-200 text-danger-800'"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="font-medium">{{ result.test }}</div>
              <div class="mt-1">{{ result.message }}</div>
              <div v-if="result.data" class="mt-2 text-xs opacity-70">
                <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
              </div>
            </div>
            <div class="text-xs text-secondary-500">
              {{ formatTime(result.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createResource } from 'frappe-ui'
import { 
  ServerStackIcon, 
  UserIcon, 
  KeyIcon 
} from '@heroicons/vue/24/outline'

// Reactive data
const serverStatus = ref('disconnected')
const userInfo = ref(null)
const testResults = ref([])
const pingLoading = ref(false)
const userLoading = ref(false)
const sessionLoading = ref(false)

// Resources
const pingResource = createResource({
  url: 'ping',
  auto: false,
})

const userResource = createResource({
  url: 'frappe.auth.get_logged_user',
  auto: false,
})

const sessionResource = createResource({
  url: 'frappe.sessions.get_session_data',
  auto: false,
})

// Methods
const addTestResult = (test, success, message, data = null) => {
  testResults.value.unshift({
    test,
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  })
  
  // Keep only last 10 results
  if (testResults.value.length > 10) {
    testResults.value = testResults.value.slice(0, 10)
  }
}

const testPing = async () => {
  pingLoading.value = true
  try {
    const result = await pingResource.fetch()
    serverStatus.value = 'connected'
    addTestResult('Ping Test', true, 'الاتصال بالسيرفر ناجح', result)
  } catch (error) {
    serverStatus.value = 'disconnected'
    addTestResult('Ping Test', false, `فشل الاتصال: ${error.message}`)
  } finally {
    pingLoading.value = false
  }
}

const testUserInfo = async () => {
  userLoading.value = true
  try {
    const result = await userResource.fetch()
    userInfo.value = result
    addTestResult('User Info Test', true, 'تم جلب معلومات المستخدم بنجاح', result)
  } catch (error) {
    addTestResult('User Info Test', false, `فشل جلب معلومات المستخدم: ${error.message}`)
  } finally {
    userLoading.value = false
  }
}

const testSession = async () => {
  sessionLoading.value = true
  try {
    const result = await sessionResource.fetch()
    addTestResult('Session Test', true, 'تم اختبار الجلسة بنجاح', result)
  } catch (error) {
    addTestResult('Session Test', false, `فشل اختبار الجلسة: ${error.message}`)
  } finally {
    sessionLoading.value = false
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ar')
}

// Auto test on mount
onMounted(async () => {
  await testPing()
})
</script>
