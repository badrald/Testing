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
        v-for="category in categoriesStore.categories"
        :key="category.name"
        class="card hover:shadow-medium transition-all duration-300 group"
      >
        <div class="card-body">
          <!-- Category Icon and Name -->
          <div class="flex items-center mb-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-medium bg-primary-500"
            >
              <BookOpenIcon class="w-6 h-6 text-white" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-secondary-900">{{ category.category_name }}</h3>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-secondary-200">
            <router-link
              :to="`/books?category=${category.category_name}`"
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
import { ref, onMounted } from 'vue'
import { useCategoriesStore } from '../stores/categories'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
} from '@heroicons/vue/24/outline'

const categoriesStore = useCategoriesStore()

// Reactive data
const showAddCategoryModal = ref(false)

const newCategory = ref({
  name: '',
})

onMounted(() => {
  categoriesStore.fetchCategories()
})

// Methods
const addCategory = () => {
  // To be implemented
}

const editCategory = (category: any) => {
  console.log('Edit category:', category)
}

const deleteCategory = (category: any) => {
  // To be implemented
}
</script>