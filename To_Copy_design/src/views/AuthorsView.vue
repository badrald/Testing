<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900">إدارة المؤلفين</h1>
        <p class="mt-2 text-secondary-600">إدارة معلومات المؤلفين وكتبهم</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddAuthorModal = true"
          class="btn-primary"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          إضافة مؤلف جديد
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-secondary-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="البحث بالاسم..."
                class="form-input pl-10"
              />
            </div>
          </div>

          <!-- Sort By -->
          <div>
            <select v-model="sortBy" class="form-select">
              <option value="name">ترتيب بالاسم</option>
              <option value="recent">المضاف حديثاً</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Authors Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="author in paginatedAuthors"
        :key="author.name"
        class="card hover:shadow-medium transition-all duration-300 group"
      >
        <div class="card-body">
          <!-- Author Avatar and Basic Info -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
                <span class="text-xl font-medium text-white">
                  {{ getInitials(author.author_name) }}
                </span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-secondary-900">{{ author.author_name }}</h3>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-secondary-200">
            <button
              @click="viewAuthor(author)"
              class="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              عرض التفاصيل
            </button>
            <div class="flex space-x-2">
              <button
                @click="editAuthor(author)"
                class="p-1 text-secondary-600 hover:text-secondary-800 rounded"
                title="تعديل المؤلف"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteAuthor(author)"
                class="p-1 text-danger-600 hover:text-danger-800 rounded"
                title="حذف المؤلف"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          السابق
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          التالي
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-secondary-700">
            عرض
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            إلى
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredAuthors.length) }}</span>
            من
            <span class="font-medium">{{ filteredAuthors.length }}</span>
            نتيجة
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              :class="page === currentPage 
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600' 
                : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add Author Modal -->
    <div
      v-if="showAddAuthorModal"
      class="modal-overlay"
      @click="showAddAuthorModal = false"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إضافة مؤلف جديد</h3>
        </div>
        <form @submit.prevent="addAuthor">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">الاسم الكامل</label>
              <input
                v-model="newAuthor.name"
                type="text"
                required
                class="form-input"
                placeholder="أدخل اسم المؤلف"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="showAddAuthorModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              إضافة المؤلف
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthorsStore } from '../stores/authors'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const authorsStore = useAuthorsStore()

// Reactive data
const searchQuery = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const showAddAuthorModal = ref(false)

const newAuthor = ref({
  name: '',
})

onMounted(() => {
  authorsStore.fetchAuthors()
})

// Computed properties
const filteredAuthors = computed(() => {
  let filtered = authorsStore.authors.filter(author => {
    const matchesSearch = !searchQuery.value || 
      author.author_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesSearch
  })

  // Sort authors
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.author_name.localeCompare(b.author_name))
      break
    case 'recent':
      filtered.sort((a, b) => b.name.localeCompare(a.name)) // Assuming name is the docname and is sortable
      break
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredAuthors.value.length / itemsPerPage.value))

const paginatedAuthors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAuthors.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const addAuthor = () => {
  // To be implemented
}

const viewAuthor = (author: any) => {
  console.log('View author:', author)
}

const editAuthor = (author: any) => {
  console.log('Edit author:', author)
}

const deleteAuthor = (author: any) => {
  // To be implemented
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}
</script>