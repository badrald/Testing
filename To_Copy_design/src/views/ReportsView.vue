<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-secondary-900">التقارير والإحصائيات</h1>
      <p class="mt-2 text-secondary-600">رؤى شاملة حول عمليات المكتبة</p>
    </div>

    <!-- Report Filters -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-secondary-900">مرشحات التقرير</h3>
        <p class="text-sm text-secondary-600">حدد الفترة الزمنية للتقرير</p>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">النطاق الزمني</label>
            <select
              v-model="selectedDateRange"
              class="form-select"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">من تاريخ</label>
            <input
              v-model="fromDate"
              type="date"
              class="form-input"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1">إلى تاريخ</label>
            <input
              v-model="toDate"
              type="date"
              class="form-input"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="generateReports"
              class="btn-primary w-full"
            >
              إنشاء التقارير
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BookOpenIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-secondary-600">إجمالي التداول</p>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold text-secondary-900">{{ metrics.totalCirculation }}</p>
              <div class="ml-2 flex items-baseline text-sm font-semibold text-success-600">
                <ArrowUpIcon class="self-center flex-shrink-0 h-4 w-4" />
                <span>12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-secondary-600">الأعضاء النشطون</p>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold text-secondary-900">{{ metrics.activeMembers }}</p>
              <div class="ml-2 flex items-baseline text-sm font-semibold text-success-600">
                <ArrowUpIcon class="self-center flex-shrink-0 h-4 w-4" />
                <span>8%</span>
              </div>
            </div>
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
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-secondary-600">متوسط مدة الاستعارة</p>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold text-secondary-900">{{ metrics.avgLoanDuration }}</p>
              <div class="ml-2 flex items-baseline text-sm font-semibold text-danger-600">
                <ArrowDownIcon class="self-center flex-shrink-0 h-4 w-4" />
                <span>3%</span>
              </div>
            </div>
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
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-secondary-600">معدل التأخير</p>
            <div class="flex items-baseline">
              <p class="text-2xl font-bold text-secondary-900">{{ metrics.overdueRate }}%</p>
              <div class="ml-2 flex items-baseline text-sm font-semibold text-success-600">
                <ArrowDownIcon class="self-center flex-shrink-0 h-4 w-4" />
                <span>5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Circulation Trends -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-secondary-900">اتجاهات التداول</h3>
          <p class="text-sm text-secondary-600">تطور عمليات الاستعارة عبر الزمن</p>
        </div>
        <div class="card-body">
          <div class="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <ChartBarIcon class="h-12 w-12 text-primary-400 mx-auto mb-2" />
              <p class="text-secondary-500">سيتم عرض مخطط اتجاهات التداول هنا</p>
              <p class="text-sm text-secondary-400">يتطلب تكامل مع مكتبة الرسوم البيانية</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-secondary-900">التصنيفات الشائعة</h3>
          <p class="text-sm text-secondary-600">توزيع الكتب حسب التصنيف</p>
        </div>
        <div class="card-body">
          <div class="space-y-4">
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
                <span class="text-sm text-secondary-500 w-12 text-right">{{ category.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Top Borrowed Books -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-secondary-900">الكتب الأكثر استعارة</h3>
              <p class="text-sm text-secondary-600">أشهر الكتب في المكتبة</p>
            </div>
            <button
              @click="exportReport('top-books')"
              class="btn-secondary btn-sm"
            >
              تصدير
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="divide-y divide-secondary-100">
            <div
              v-for="(book, index) in topBooks"
              :key="book.id"
              class="flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-600">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-secondary-900">{{ book.title }}</p>
                  <p class="text-xs text-secondary-500">{{ book.author }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-secondary-900">{{ book.borrowCount }}</p>
                <p class="text-xs text-secondary-500">مرة استعارة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Member Activity -->
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-secondary-900">الأعضاء الأكثر نشاطاً</h3>
              <p class="text-sm text-secondary-600">أكثر الأعضاء استعارة للكتب</p>
            </div>
            <button
              @click="exportReport('active-members')"
              class="btn-secondary btn-sm"
            >
              تصدير
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="divide-y divide-secondary-100">
            <div
              v-for="(member, index) in activeMembers"
              :key="member.id"
              class="flex items-center justify-between p-4 hover:bg-secondary-50 transition-colors duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-success-600">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-secondary-900">{{ member.name }}</p>
                  <p class="text-xs text-secondary-500">{{ getMembershipTypeText(member.membershipType) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-secondary-900">{{ member.borrowCount }}</p>
                <p class="text-xs text-secondary-500">كتاب مستعار</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Summary -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-secondary-900">الملخص الشهري</h3>
            <p class="text-sm text-secondary-600">إحصائيات شاملة للأشهر الماضية</p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="exportReport('monthly-summary')"
              class="btn-primary btn-sm"
            >
              تصدير PDF
            </button>
            <button
              @click="exportReport('monthly-summary-excel')"
              class="btn-success btn-sm"
            >
              تصدير Excel
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th>الشهر</th>
              <th>كتب صدرت</th>
              <th>كتب أرجعت</th>
              <th>أعضاء جدد</th>
              <th>كتب متأخرة</th>
              <th>الإيرادات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="month in monthlySummary"
              :key="month.month"
              class="table-row"
            >
              <td class="table-cell font-medium">
                {{ month.month }}
              </td>
              <td class="table-cell">
                {{ month.booksIssued }}
              </td>
              <td class="table-cell">
                {{ month.booksReturned }}
              </td>
              <td class="table-cell">
                {{ month.newMembers }}
              </td>
              <td class="table-cell">
                {{ month.overdueBooks }}
              </td>
              <td class="table-cell">
                {{ month.revenue }} ريال
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

// Reactive data
const selectedDateRange = ref('30')
const fromDate = ref('')
const toDate = ref('')

// Mock data
const metrics = ref({
  totalCirculation: 1247,
  activeMembers: 342,
  avgLoanDuration: '14 يوم',
  overdueRate: 8.5,
})

const popularCategories = ref([
  { name: 'الأدب', count: 156, percentage: 85, color: '#3b82f6' },
  { name: 'العلوم', count: 89, percentage: 65, color: '#22c55e' },
  { name: 'التاريخ', count: 67, percentage: 45, color: '#f59e0b' },
  { name: 'السير الذاتية', count: 45, percentage: 30, color: '#ef4444' },
  { name: 'التكنولوجيا', count: 34, percentage: 25, color: '#8b5cf6' },
])

const topBooks = ref([
  { id: 1, title: 'الأسود يليق بك', author: 'أحلام مستغانمي', borrowCount: 23 },
  { id: 2, title: 'مئة عام من العزلة', author: 'غابرييل غارسيا ماركيز', borrowCount: 19 },
  { id: 3, title: '1984', author: 'جورج أورويل', borrowCount: 17 },
  { id: 4, title: 'كبرياء وتحامل', author: 'جين أوستن', borrowCount: 15 },
  { id: 5, title: 'الحارس في حقل الشوفان', author: 'ج.د. سالينجر', borrowCount: 13 },
])

const activeMembers = ref([
  { id: 1, name: 'أحمد محمد', membershipType: 'student', borrowCount: 12 },
  { id: 2, name: 'فاطمة أحمد', membershipType: 'faculty', borrowCount: 10 },
  { id: 3, name: 'محمد سالم', membershipType: 'public', borrowCount: 8 },
  { id: 4, name: 'سارة علي', membershipType: 'student', borrowCount: 7 },
  { id: 5, name: 'خالد أحمد', membershipType: 'faculty', borrowCount: 6 },
])

const monthlySummary = ref([
  {
    month: 'يناي�� 2024',
    booksIssued: 145,
    booksReturned: 132,
    newMembers: 23,
    overdueBooks: 12,
    revenue: 1250,
  },
  {
    month: 'ديسمبر 2023',
    booksIssued: 132,
    booksReturned: 128,
    newMembers: 18,
    overdueBooks: 15,
    revenue: 1180,
  },
  {
    month: 'نوفمبر 2023',
    booksIssued: 156,
    booksReturned: 149,
    newMembers: 31,
    overdueBooks: 8,
    revenue: 1420,
  },
  {
    month: 'أكتوبر 2023',
    booksIssued: 167,
    booksReturned: 162,
    newMembers: 27,
    overdueBooks: 11,
    revenue: 1580,
  },
])

// Methods
const getMembershipTypeText = (type: string) => {
  switch (type) {
    case 'student': return 'طالب'
    case 'faculty': return 'أكاديمي'
    case 'public': return 'عام'
    default: return type
  }
}

const generateReports = () => {
  console.log('Generating reports for date range:', fromDate.value, 'to', toDate.value)
  // Implement report generation logic
}

const exportReport = (reportType: string) => {
  console.log('Exporting report:', reportType)
  // Implement export functionality
  // This would typically generate and download a file
}
</script>