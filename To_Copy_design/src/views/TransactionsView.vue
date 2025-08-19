<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900">إدارة المعاملات</h1>
        <p class="mt-2 text-secondary-600">تتبع عمليات الاستعارة والإرجاع</p>
      </div>
      <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
        <button
          @click="showIssueBookModal = true"
          class="btn-primary"
        >
          <ArrowRightIcon class="w-4 h-4 mr-2" />
          إصدار كتاب
        </button>
        <button
          @click="showReturnBookModal = true"
          class="btn-secondary"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          إرجاع كتاب
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ArrowRightIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">كتب صدرت اليوم</p>
            <p class="text-2xl font-bold text-secondary-900">{{ todayIssued }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
              <ArrowLeftIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">كتب أرجعت اليوم</p>
            <p class="text-2xl font-bold text-secondary-900">{{ todayReturned }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center">
              <ClockIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">مستعارة حالياً</p>
            <p class="text-2xl font-bold text-secondary-900">{{ activeTransactions }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-danger rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">كتب متأخرة</p>
            <p class="text-2xl font-bold text-secondary-900">{{ overdueTransactions }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-secondary-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="البحث بعنوان الكتاب، اسم العضو، أو رقم المعاملة..."
                class="form-input pl-10"
              />
            </div>
          </div>

          <!-- Transaction Type Filter -->
          <div>
            <select v-model="selectedType" class="form-select">
              <option value="">جميع الأنواع</option>
              <option value="Issue">استعارة</option>
              <option value="Return">إرجاع</option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <input
              v-model="dateFilter"
              type="date"
              class="form-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-secondary-900">
          المعاملات ({{ filteredTransactions.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th>رقم المعاملة</th>
              <th>الكتاب</th>
              <th>العضو</th>
              <th>النوع</th>
              <th>تاريخ الإصدار</th>
              <th class="text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.name"
              class="table-row"
            >
              <td class="table-cell font-medium">
                {{ transaction.name }}
              </td>
              <td class="table-cell">
                <div>
                  <div class="text-sm font-medium text-secondary-900">{{ transaction.article_name }}</div>
                </div>
              </td>
              <td class="table-cell">
                <div>
                  <div class="text-sm font-medium text-secondary-900">{{ transaction.member_full_name }}</div>
                  <div class="text-sm text-secondary-500">{{ transaction.library_member }}</div>
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="badge"
                  :class="transaction.transaction_type === 'Issue' ? 'badge-primary' : 'badge-success'"
                >
                  <component
                    :is="transaction.transaction_type === 'Issue' ? ArrowRightIcon : ArrowLeftIcon"
                    class="w-3 h-3 mr-1"
                  />
                  {{ transaction.transaction_type === 'Issue' ? 'استعارة' : 'إرجاع' }}
                </span>
              </td>
              <td class="table-cell">
                {{ formatDate(transaction.transaction_date) }}
              </td>
              <td class="table-cell text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewTransaction(transaction)"
                    class="p-1 text-primary-600 hover:text-primary-800 rounded"
                    title="عرض التفاصيل"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Issue Book Modal -->
    <div
      v-if="showIssueBookModal"
      class="modal-overlay"
      @click="showIssueBookModal = false"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إصدار كتاب</h3>
        </div>
        <form @submit.prevent="issueBook">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">رقم العضوية</label>
              <input
                v-model="issueForm.memberId"
                type="text"
                required
                class="form-input"
                placeholder="أدخل رقم العضوية"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">ISBN أو عنوان الكتاب</label>
              <input
                v-model="issueForm.bookId"
                type="text"
                required
                class="form-input"
                placeholder="أدخل ISBN أو عنوان الكتاب"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">تاريخ الاستحقاق</label>
              <input
                v-model="issueForm.dueDate"
                type="date"
                required
                class="form-input"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="showIssueBookModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              إصدار الكتاب
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Return Book Modal -->
    <div
      v-if="showReturnBookModal"
      class="modal-overlay"
      @click="showReturnBookModal = false"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إرجاع كتاب</h3>
        </div>
        <form @submit.prevent="processReturn">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">رقم المعاملة</label>
              <input
                v-model="returnForm.transactionId"
                type="text"
                required
                class="form-input"
                placeholder="أدخل رقم المعاملة"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">تاريخ الإرجاع</label>
              <input
                v-model="returnForm.returnDate"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">حالة الكتاب</label>
              <select
                v-model="returnForm.condition"
                required
                class="form-select"
              >
                <option value="">اختر حالة الكتاب</option>
                <option value="good">جيدة</option>
                <option value="fair">مقبولة</option>
                <option value="damaged">تالفة</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">ملاحظات</label>
              <textarea
                v-model="returnForm.notes"
                rows="3"
                class="form-textarea"
                placeholder="أدخل أي ملاحظات إضافية"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="showReturnBookModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn-success"
            >
              إرجاع الكتاب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const transactionsStore = useTransactionsStore()

// Reactive data
const searchQuery = ref('')
const selectedType = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showIssueBookModal = ref(false)
const showReturnBookModal = ref(false)

const issueForm = ref({
  memberId: '',
  bookId: '',
  dueDate: '',
})

const returnForm = ref({
  transactionId: '',
  returnDate: new Date().toISOString().split('T')[0],
  condition: '',
  notes: '',
})

onMounted(() => {
  transactionsStore.fetchTransactions()
})

// Computed properties
const todayIssued = computed(() => transactionsStore.todayIssued)
const todayReturned = computed(() => transactionsStore.todayReturned)
const activeTransactions = computed(() => transactionsStore.activeTransactions)
const overdueTransactions = computed(() => transactionsStore.overdueTransactions)

const filteredTransactions = computed(() => {
  return transactionsStore.transactions.filter(transaction => {
    const matchesSearch = !searchQuery.value || 
      transaction.article_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.member_full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      transaction.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedType.value || transaction.transaction_type === selectedType.value
    const matchesDate = !dateFilter.value || transaction.transaction_date === dateFilter.value
    
    return matchesSearch && matchesType && matchesDate
  })
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const issueBook = () => {
  // To be implemented
}

const processReturn = () => {
  // To be implemented
}

const viewTransaction = (transaction: any) => {
  console.log('View transaction:', transaction)
}

const returnBook = (transaction: any) => {
  returnForm.value.transactionId = transaction.name
  showReturnBookModal.value = true
}

const sendReminder = (transaction: any) => {
  console.log('Send reminder for:', transaction)
}
</script>