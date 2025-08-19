<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">التقارير والإحصائيات</h1>
        <p class="text-sm text-secondary-600 dark:text-secondary-400 mt-1">عرض تقارير شاملة عن أداء المكتبة</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <Button
          variant="outline"
          class="btn-secondary"
        >
          <ArrowDownTrayIcon class="w-4 h-4 ml-2" />
          تصدير
        </Button>
        <Button
          variant="solid"
          class="btn-primary"
        >
          <DocumentTextIcon class="w-4 h-4 ml-2" />
          تقرير جديد
        </Button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600">إجمالي الكتب</p>
            <p class="text-3xl font-bold text-secondary-900">1,234</p>
            <p class="text-sm text-success-600 flex items-center mt-1">
              <ArrowUpIcon class="w-3 h-3 ml-1" />
              +5.2%
            </p>
          </div>
          <div class="p-3 bg-primary-100 rounded-full">
            <BookOpenIcon class="w-8 h-8 text-primary-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600">الأعضاء النشطون</p>
            <p class="text-3xl font-bold text-secondary-900">892</p>
            <p class="text-sm text-success-600 flex items-center mt-1">
              <ArrowUpIcon class="w-3 h-3 ml-1" />
              +12.1%
            </p>
          </div>
          <div class="p-3 bg-success-100 rounded-full">
            <UsersIcon class="w-8 h-8 text-success-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600">معاملات الشهر</p>
            <p class="text-3xl font-bold text-secondary-900">456</p>
            <p class="text-sm text-warning-600 flex items-center mt-1">
              <ArrowDownIcon class="w-3 h-3 ml-1" />
              -2.4%
            </p>
          </div>
          <div class="p-3 bg-warning-100 rounded-full">
            <ArrowsRightLeftIcon class="w-8 h-8 text-warning-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600">معدل الإشغال</p>
            <p class="text-3xl font-bold text-secondary-900">78%</p>
            <p class="text-sm text-success-600 flex items-center mt-1">
              <ArrowUpIcon class="w-3 h-3 ml-1" />
              +3.7%
            </p>
          </div>
          <div class="p-3 bg-info-100 rounded-full">
            <ChartBarIcon class="w-8 h-8 text-info-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Borrowing Trends Chart -->
      <div class="card">
        <div class="p-6 border-b border-secondary-200">
          <h3 class="text-lg font-semibold text-secondary-900">اتجاهات الإعارة</h3>
          <p class="text-sm text-secondary-600">معاملات الإعارة في الأشهر الستة الماضية</p>
        </div>
        <div class="p-6">
          <div class="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
            <div class="text-center text-secondary-500">
              <ChartBarIcon class="w-16 h-16 mx-auto mb-4" />
              <p>رسم بياني لاتجاهات الإعارة</p>
              <p class="text-sm">يتم تحميل البيانات...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Categories -->
      <div class="card">
        <div class="p-6 border-b border-secondary-200">
          <h3 class="text-lg font-semibold text-secondary-900">التصنيفات الأكثر شعبية</h3>
          <p class="text-sm text-secondary-600">أكثر التصنيفات استعارة هذا الشهر</p>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="category in popularCategories" :key="category.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full ml-3" :class="category.color"></div>
              <span class="text-sm font-medium text-secondary-900">{{ category.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-secondary-600 ml-2">{{ category.count }}</span>
              <div class="w-20 h-2 bg-secondary-200 rounded-full">
                <div 
                  class="h-2 rounded-full" 
                  :class="category.color"
                  :style="{ width: category.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="card">
      <div class="p-6 border-b border-secondary-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-secondary-900">التقارير الحديثة</h3>
          <Button variant="ghost" size="sm">
            عرض الكل
          </Button>
        </div>
      </div>
      <div class="divide-y divide-secondary-200">
        <div v-for="report in recentReports" :key="report.id" class="p-6 hover:bg-secondary-50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 rounded-lg ml-4" :class="report.iconBg">
                <component :is="report.icon" class="w-5 h-5" :class="report.iconColor" />
              </div>
              <div>
                <h4 class="text-sm font-medium text-secondary-900">{{ report.title }}</h4>
                <p class="text-sm text-secondary-600">{{ report.description }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-secondary-500">{{ formatDate(report.createdAt) }}</span>
              <Button variant="ghost" size="sm">
                <ArrowDownTrayIcon class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  BookOpenIcon,
  UsersIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/vue/24/outline'

// Sample data
const popularCategories = ref([
  { name: 'الأدب العربي', count: 142, percentage: 85, color: 'bg-primary-500' },
  { name: 'العلوم', count: 98, percentage: 60, color: 'bg-success-500' },
  { name: 'التاريخ', count: 76, percentage: 45, color: 'bg-warning-500' },
  { name: 'الفلسفة', count: 54, percentage: 32, color: 'bg-danger-500' },
  { name: 'التكنولوجيا', count: 32, percentage: 20, color: 'bg-info-500' }
])

const recentReports = ref([
  {
    id: 1,
    title: 'تقرير المعاملات الشهرية',
    description: 'تقرير شامل عن معاملات شهر يناير 2024',
    createdAt: '2024-01-20',
    icon: DocumentTextIcon,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600'
  },
  {
    id: 2,
    title: 'إحصائيات الأعضاء',
    description: 'تحليل نشاط الأعضاء والعضويات الجديدة',
    createdAt: '2024-01-18',
    icon: UsersIcon,
    iconBg: 'bg-success-100',
    iconColor: 'text-success-600'
  },
  {
    id: 3,
    title: 'تقرير المخزون',
    description: 'حالة المخزون والكتب المتاحة',
    createdAt: '2024-01-15',
    icon: BookOpenIcon,
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600'
  }
])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
