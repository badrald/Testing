<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="text-center py-8">
      <h1 class="text-4xl font-bold text-secondary-900 mb-4 animate-slide-in">
        مرحباً بك في نظام إدارة المكتبة
      </h1>
      <p class="text-lg text-secondary-600 max-w-2xl mx-auto animate-fade-in">
        نظام شامل لإدارة المكتبات يساعدك على تنظيم الكتب والأعضاء والمعاملات بكفاءة عالية
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="stat.name"
        class="stats-card animate-bounce-in floating-element glow-effect"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shadow-medium"
              :class="stat.bgClass"
            >
              <component :is="stat.icon" class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-secondary-600">{{ stat.name }}</p>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold text-secondary-900">{{ stat.value }}</p>
              <span
                class="ml-2 text-sm font-medium"
                :class="stat.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'"
              >
                {{ stat.change }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-secondary-100">
          <p class="text-xs text-secondary-500">{{ stat.description }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-secondary-900">الإجراءات السريعة</h3>
        <p class="text-sm text-secondary-600">العمليات الأكثر استخداماً</p>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="action in quickActions"
            :key="action.name"
            @click="handleQuickAction(action.action)"
            class="flex flex-col items-center p-6 rounded-xl border-2 border-dashed border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
              :class="action.bgClass"
            >
              <component :is="action.icon" class="w-6 h-6 text-white" />
            </div>
            <span class="text-sm font-medium text-secondary-700 group-hover:text-primary-700">
              {{ action.name }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity and Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Transactions -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-secondary-900">المعاملات الأخيرة</h3>
              <p class="text-sm text-secondary-600">آخر العمليات في النظام</p>
            </div>
            <router-link to="/transactions" class="btn-primary btn-sm">
              عرض الكل
            </router-link>
          </div>
        </div>
        <div class="card-body p-0">
          <div v-if="recentTransactions.length === 0" class="p-8 text-center">
            <ClipboardDocumentListIcon class="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p class="text-secondary-500">لا توجد معاملات حديثة</p>
          </div>
          <div v-else class="divide-y divide-secondary-100">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="p-4 hover:bg-secondary-50 transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="transaction.type === 'borrow' ? 'bg-primary-100' : 'bg-success-100'"
                  >
                    <component
                      :is="transaction.type === 'borrow' ? ArrowRightIcon : ArrowLeftIcon"
                      class="w-5 h-5"
                      :class="transaction.type === 'borrow' ? 'text-primary-600' : 'text-success-600'"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-secondary-900">
                      {{ transaction.bookTitle }}
                    </p>
                    <p class="text-xs text-secondary-500">
                      {{ transaction.memberName }} • {{ formatDate(transaction.issueDate) }}
                    </p>
                  </div>
                </div>
                <span
                  class="badge"
                  :class="transaction.type === 'borrow' ? 'badge-primary' : 'badge-success'"
                >
                  {{ transaction.type === 'borrow' ? 'استعارة' : 'إرجاع' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-secondary-900">التصنيفات الأكثر شعبية</h3>
          <p class="text-sm text-secondary-600">توزيع الكتب حسب التصنيف</p>
        </div>
        <div class="card-body">
          <div v-if="popularCategories.length === 0" class="text-center py-8">
            <ChartBarIcon class="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p class="text-secondary-500">لا توجد بيانات للعرض</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="category in popularCategories"
              :key="category.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></div>
                <span class="text-sm font-medium text-secondary-900">{{ category.name }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-32 bg-secondary-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-1000 ease-out"
                    :style="{ 
                      width: category.percentage + '%',
                      backgroundColor: category.color 
                    }"
                  ></div>
                </div>
                <span class="text-sm text-secondary-500 w-8 text-right">{{ category.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-secondary-900">حالة النظام</h3>
        <p class="text-sm text-secondary-600">معلومات عامة عن أداء النظام</p>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon class="w-8 h-8 text-success-600" />
            </div>
            <h4 class="text-lg font-semibold text-secondary-900">النظام يعمل بشكل طبيعي</h4>
            <p class="text-sm text-secondary-600">جميع الخدمات متاحة</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CloudIcon class="w-8 h-8 text-primary-600" />
            </div>
            <h4 class="text-lg font-semibold text-secondary-900">النسخ الاحتياطي</h4>
            <p class="text-sm text-secondary-600">آخر نسخة: {{ formatDate(systemStats.lastBackup) }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExclamationTriangleIcon class="w-8 h-8 text-warning-600" />
            </div>
            <h4 class="text-lg font-semibold text-secondary-900">تحديثات متاحة</h4>
            <p class="text-sm text-secondary-600">{{ systemStats.pendingUpdates }} تحديثات في الانتظار</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import { useMembersStore } from '../stores/members'
import { useTransactionsStore } from '../stores/transactions'
import { useAppStore } from '../stores/app'
import {
  BookOpenIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  UserPlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CloudIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

// Stores
const booksStore = useBooksStore()
const membersStore = useMembersStore()
const transactionsStore = useTransactionsStore()
const appStore = useAppStore()

// Computed properties from stores
const stats = computed(() => [
  {
    name: 'إجمالي الكتب',
    value: booksStore.totalBooks.toString(),
    change: '+12%',
    changeType: 'increase',
    description: 'زيادة عن الشهر الماضي',
    icon: BookOpenIcon,
    bgClass: 'bg-gradient-primary',
  },
  {
    name: 'الأعضاء النشطون',
    value: membersStore.activeMembers.toString(),
    change: '+8%',
    changeType: 'increase',
    description: 'عضو جديد هذا الشهر',
    icon: UsersIcon,
    bgClass: 'bg-gradient-success',
  },
  {
    name: 'الكتب المستعارة',
    value: transactionsStore.activeTransactions.toString(),
    change: '-2%',
    changeType: 'decrease',
    description: 'انخفاض طفيف',
    icon: ClipboardDocumentListIcon,
    bgClass: 'bg-gradient-warning',
  },
  {
    name: 'الكتب المتأخرة',
    value: transactionsStore.overdueTransactions.toString(),
    change: '+3%',
    changeType: 'increase',
    description: 'تحتاج متابعة',
    icon: ExclamationTriangleIcon,
    bgClass: 'bg-gradient-danger',
  },
])

const quickActions = computed(() => [
  {
    name: 'إضافة كتاب',
    action: 'add-book',
    icon: PlusIcon,
    bgClass: 'bg-gradient-primary',
  },
  {
    name: 'عضو جديد',
    action: 'add-member',
    icon: UserPlusIcon,
    bgClass: 'bg-gradient-success',
  },
  {
    name: 'إصدار كتاب',
    action: 'issue-book',
    icon: ArrowRightIcon,
    bgClass: 'bg-gradient-warning',
  },
  {
    name: 'إرجاع كتاب',
    action: 'return-book',
    icon: ArrowLeftIcon,
    bgClass: 'bg-gradient-danger',
  },
])

const recentTransactions = computed(() => transactionsStore.recentTransactions)
const systemStats = computed(() => appStore.systemStats)

const popularCategories = computed(() => {
  const categoryStats = booksStore.categories.map(category => {
    const categoryBooks = booksStore.books.filter(book => book.category === category)
    const count = categoryBooks.length
    const percentage = booksStore.totalBooks > 0 ? (count / booksStore.totalBooks) * 100 : 0
    
    return {
      name: category,
      count,
      percentage: Math.round(percentage),
      color: getCategoryColor(category),
    }
  }).sort((a, b) => b.count - a.count).slice(0, 5)
  
  return categoryStats
})

// Methods
const getCategoryColor = (category: string) => {
  const colors = {
    'الأدب': '#3b82f6',
    'العلوم': '#22c55e',
    'التاريخ': '#f59e0b',
    'السير الذاتية': '#ef4444',
    'التكنولوجيا': '#8b5cf6',
    'الفن': '#ec4899',
    'الفلسفة': '#6b7280',
    'الأطفال': '#f97316',
  }
  return colors[category as keyof typeof colors] || '#6b7280'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'add-book':
      router.push('/books')
      break
    case 'add-member':
      router.push('/members')
      break
    case 'issue-book':
      router.push('/transactions')
      break
    case 'return-book':
      router.push('/transactions')
      break
    default:
      console.log('Quick action:', action)
  }
}
</script>