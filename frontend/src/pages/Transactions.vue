<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">المعاملات</h1>
        <p class="text-sm text-secondary-600 dark:text-secondary-400 mt-1">إدارة عمليات الإعارة والإرجاع</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <Button
          variant="solid"
          class="btn-primary"
        >
          <PlusIcon class="w-4 h-4 ml-2" />
          معاملة جديدة
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-primary-100 rounded-lg">
            <BookOpenIcon class="w-6 h-6 text-primary-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-secondary-600">المعارة حالياً</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.active || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-success-100 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-success-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-secondary-600">تم إرجاعها اليوم</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.returnedToday || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-warning-100 rounded-lg">
            <ClockIcon class="w-6 h-6 text-warning-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-secondary-600">متأخرة</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.overdue || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-2 bg-danger-100 rounded-lg">
            <ExclamationTriangleIcon class="w-6 h-6 text-danger-600" />
          </div>
          <div class="mr-4">
            <p class="text-sm font-medium text-secondary-600">متأخرة جداً</p>
            <p class="text-2xl font-bold text-secondary-900">{{ stats.veryOverdue || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="card">
      <div class="p-6 border-b border-secondary-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="البحث في المعاملات..."
                class="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select class="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">جميع الحالات</option>
              <option value="active">معارة</option>
              <option value="returned">مُرجعة</option>
              <option value="overdue">متأخرة</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Transactions Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-secondary-200">
          <thead class="bg-secondary-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">الكتاب</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">العضو</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">تاريخ الإعارة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">تاريخ الإرجاع المتوقع</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-secondary-200">
            <tr v-for="transaction in transactions" :key="transaction.name" class="hover:bg-secondary-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center ml-3">
                    <BookOpenIcon class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-secondary-900">{{ transaction.article_name }}</div>
                    <div class="text-sm text-secondary-500">{{ transaction.author || 'غير محدد' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-secondary-900">{{ transaction.member_name }}</div>
                <div class="text-sm text-secondary-500">{{ transaction.member_id }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-secondary-900">{{ formatDate(transaction.issue_date) }}</td>
              <td class="px-6 py-4 text-sm text-secondary-900">{{ formatDate(transaction.due_date) }}</td>
              <td class="px-6 py-4">
                <span
                  :class="getStatusBadgeClass(transaction.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getStatusText(transaction.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium space-x-2">
                <button
                  v-if="transaction.status === 'Issued'"
                  class="text-success-600 hover:text-success-900"
                  @click="returnBook(transaction)"
                >
                  إرجاع
                </button>
                <button class="text-primary-600 hover:text-primary-900">
                  تفاصيل
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  PlusIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { transactionsResource, getTransactionStats, updateTransaction } from '../data/transactions'

// Transactions data
const transactions = ref([])
const stats = ref({
  active: 0,
  returnedToday: 0,
  overdue: 0,
  veryOverdue: 0
})

// Load transaction data
const loadTransactions = async () => {
  // Load transactions
  if (transactionsResource.data) {
    transactions.value = transactionsResource.data
  }
  
  // Load stats
  const statsResponse = await getTransactionStats()
  if (statsResponse.success) {
    stats.value = statsResponse.data
  }
}

// Load data when component is mounted
onMounted(() => {
  loadTransactions()
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  return new Date(dateString).toLocaleDateString('ar')
}

const returnBook = async (transaction) => {
  try {
    const response = await updateTransaction({
      name: transaction.name,
      status: 'Returned',
      returned_date: new Date().toISOString().split('T')[0]
    })
    
    if (response.success) {
      await loadTransactions()
    }
  } catch (error) {
    console.error('Error returning book:', error)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'Issued': 'معارة',
    'Returned': 'مُرجعة',
    'Overdue': 'متأخرة',
    'Lost': 'مفقودة',
    'Overdue, Lost': 'متأخرة ومفقودة'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'Issued': 'bg-blue-100 text-blue-800',
    'Returned': 'bg-green-100 text-green-800',
    'Overdue': 'bg-yellow-100 text-yellow-800',
    'Lost': 'bg-red-100 text-red-800',
    'Overdue, Lost': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
