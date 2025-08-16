<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900">إدارة التصنيفات</h1>
        <p class="mt-2 text-secondary-600">تنظيم الكتب حسب التصنيفات والمواضيع</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddCategoryModal = true"
          class="btn-primary"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          إضافة تصنيف جديد
        </button>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="card hover:shadow-medium transition-all duration-300 group"
      >
        <div class="card-body">
          <!-- Category Icon and Name -->
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-medium"
              :style="{ backgroundColor: category.color }"
            >
              <component
                :is="category.icon"
                class="w-6 h-6 text-white"
              />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-secondary-900">{{ category.name }}</h3>
              <p class="text-sm text-secondary-500">{{ category.code }}</p>
            </div>
          </div>

          <!-- Category Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-primary-50 rounded-lg">
              <div class="text-2xl font-bold text-primary-600">{{ category.totalBooks }}</div>
              <div class="text-xs text-secondary-500">إجمالي الكتب</div>
            </div>
            <div class="text-center p-3 bg-success-50 rounded-lg">
              <div class="text-2xl font-bold text-success-600">{{ category.availableBooks }}</div>
              <div class="text-xs text-secondary-500">متاح</div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <p class="text-sm text-secondary-600 line-clamp-2">
              {{ category.description }}
            </p>
          </div>

          <!-- Popular Books in Category -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-secondary-900 mb-2">الكتب الشائعة:</h4>
            <div class="space-y-1">
              <div
                v-for="book in category.popularBooks.slice(0, 2)"
                :key="book"
                class="text-xs text-secondary-600 bg-secondary-50 px-2 py-1 rounded line-clamp-1"
              >
                {{ book }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-secondary-200">
            <router-link
              :to="`/books?category=${category.name}`"
              class="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              عرض الكتب
            </router-link>
            <div class="flex space-x-2">
              <button
                @click="editCategory(category)"
                class="p-1 text-secondary-600 hover:text-secondary-800 rounded"
                title="تعديل التصنيف"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteCategory(category)"
                class="p-1 text-danger-600 hover:text-danger-800 rounded"
                title="حذف التصنيف"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div
      v-if="showAddCategoryModal"
      class="modal-overlay"
      @click="showAddCategoryModal = false"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إضافة تصنيف جديد</h3>
        </div>
        <form @submit.prevent="addCategory">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">اسم التصنيف</label>
              <input
                v-model="newCategory.name"
                type="text"
                required
                class="form-input"
                placeholder="أدخل اسم التصنيف"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">رمز التصنيف</label>
              <input
                v-model="newCategory.code"
                type="text"
                required
                placeholder="مثال: ADB, SCI, HIS"
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">اللون</label>
              <input
                v-model="newCategory.color"
                type="color"
                class="form-input h-12"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">الوصف</label>
              <textarea
                v-model="newCategory.description"
                rows="3"
                class="form-textarea"
                placeholder="أدخل وصف التصنيف"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="showAddCategoryModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              إضافة التصنيف
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  BeakerIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  PaintBrushIcon,
  LightBulbIcon,
  FaceSmileIcon
} from '@heroicons/vue/24/outline'

// Reactive data
const showAddCategoryModal = ref(false)

const newCategory = ref({
  name: '',
  code: '',
  color: '#3b82f6',
  description: '',
})

// Mock categories data
const categories = ref([
  {
    id: 1,
    name: 'الأدب',
    code: 'ADB',
    color: '#3b82f6',
    icon: BookOpenIcon,
    description: 'الأعمال الأدبية والروايات والشعر والقصص القصيرة',
    totalBooks: 156,
    availableBooks: 89,
    popularBooks: ['الأسود يليق بك', 'مئة عام من العزلة', '1984'],
  },
  {
    id: 2,
    name: 'العلوم',
    code: 'SCI',
    color: '#22c55e',
    icon: BeakerIcon,
    description: 'كتب تغطي مختلف التخصصات العلمية والبحوث',
    totalBooks: 89,
    availableBooks: 67,
    popularBooks: ['تاريخ موجز للزمن', 'الكون', 'أصل الأنواع'],
  },
  {
    id: 3,
    name: 'التاريخ',
    code: 'HIS',
    color: '#f59e0b',
    icon: ClockIcon,
    description: 'السجلات التاريخية والسير والتحليل التاريخي',
    totalBooks: 67,
    availableBooks: 45,
    popularBooks: ['العبر', 'تاريخ الطبري', 'الكامل في التاريخ'],
  },
  {
    id: 4,
    name: 'السير الذاتية',
    code: 'BIO',
    color: '#ef4444',
    icon: UserIcon,
    description: 'قصص الحياة والمذكرات للشخصيات البارزة',
    totalBooks: 45,
    availableBooks: 32,
    popularBooks: ['الأيام', 'حياتي', 'مذكرات'],
  },
  {
    id: 5,
    name: 'التكنولوجيا',
    code: 'TECH',
    color: '#8b5cf6',
    icon: ComputerDesktopIcon,
    description: 'كتب الحاسوب والبرمجة والتقدم التكنولوجي',
    totalBooks: 34,
    availableBooks: 28,
    popularBooks: ['البرمجة النظيفة', 'المبرمج العملي', 'أنماط التصميم'],
  },
  {
    id: 6,
    name: 'الفن',
    code: 'ART',
    color: '#ec4899',
    icon: PaintBrushIcon,
    description: 'كتب الفنون البصرية وتاريخ الفن والتقنيات الفنية',
    totalBooks: 28,
    availableBooks: 21,
    popularBooks: ['طرق الرؤية', 'قصة الفن', 'تاريخ الفن'],
  },
  {
    id: 7,
    name: 'الفلسفة',
    code: 'PHIL',
    color: '#6b7280',
    icon: LightBulbIcon,
    description: 'الأعمال الفلسفية والمناقشات حول الأسئلة الأساسية',
    totalBooks: 23,
    availableBooks: 18,
    popularBooks: ['الجمهورية', 'التأملات', 'الوجود والزمان'],
  },
  {
    id: 8,
    name: 'الأطفال',
    code: 'CHILD',
    color: '#f97316',
    icon: FaceSmileIcon,
    description: 'كتب مكتوبة خصيصاً للأطفال والقراء الصغار',
    totalBooks: 78,
    availableBooks: 65,
    popularBooks: ['هاري بوتر', 'القط في القبعة', 'حيث تعيش الوحوش البرية'],
  },
])

// Methods
const addCategory = () => {
  const category = {
    id: categories.value.length + 1,
    ...newCategory.value,
    icon: BookOpenIcon, // Default icon
    totalBooks: 0,
    availableBooks: 0,
    popularBooks: [],
  }
  
  categories.value.push(category)
  
  // Reset form
  newCategory.value = {
    name: '',
    code: '',
    color: '#3b82f6',
    description: '',
  }
  
  showAddCategoryModal.value = false
}

const editCategory = (category: any) => {
  console.log('Edit category:', category)
}

const deleteCategory = (category: any) => {
  if (confirm(`هل أنت متأكد من حذف تصنيف ${category.name}؟`)) {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index > -1) {
      categories.value.splice(index, 1)
    }
  }
}
</script>