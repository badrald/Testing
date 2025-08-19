<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900">إدارة الكتب</h1>
        <p class="mt-2 text-secondary-600">إدارة مجموعة كتب المكتبة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showAddBookModal = true" class="btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          إضافة كتاب جديد
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="sr-only">البحث في الكتب</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-secondary-400" />
              </div>
              <input id="search" v-model="searchQuery" type="text" placeholder="البحث بالعنوان، المؤلف، أو ISBN..."
                class="form-input pl-10" />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="form-select">
              <option value="">جميع الحالات</option>
              <option value="Active">متاح</option>
              <option value="Inactive">مستعار</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Books Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="book in paginatedBooks" :key="book.name"
        class="card hover:shadow-medium transition-all duration-300 group">
        <div class="card-body">
          <!-- Book Cover -->
          <div
            class="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img v-if="book.cover" :src="book.cover" :alt="book.article_name"
              class="w-full h-full object-cover rounded-lg">
            <BookOpenIcon v-else class="w-12 h-12 text-primary-600" />
          </div>

          <!-- Book Info -->
          <div class="space-y-2">
            <h3 class="font-semibold text-secondary-900 line-clamp-2">{{ book.article_name }}</h3>
            <p class="text-sm text-secondary-600">{{ book.publisher }}</p>
            <p class="text-xs text-secondary-500">ISBN: {{ book.isbn }}</p>

            <!-- Category and Status -->
            <div class="flex items-center justify-between">
              <span class="badge" :class="getStatusBadgeClass(book.status)">
                {{ getStatusText(book.status) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t border-secondary-100 mt-4">
            <button @click="viewBook(book)" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
              عرض التفاصيل
            </button>
            <div class="flex space-x-2">
              <button @click="editBook(book)" class="p-1 text-secondary-400 hover:text-secondary-600 rounded"
                title="تعديل">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="deleteBook(book)" class="p-1 text-danger-400 hover:text-danger-600 rounded" title="حذف">
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
        <button @click="previousPage" :disabled="currentPage === 1" class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
          السابق
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
          التالي
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-secondary-700">
            عرض
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            إلى
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredBooks.length) }}</span>
            من
            <span class="font-medium">{{ filteredBooks.length }}</span>
            نتيجة
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium" :class="page === currentPage
                ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                : 'bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50'">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddBookModal" class="modal-overlay" @click="showAddBookModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إضافة كتاب جديد</h3>
        </div>
        <form @submit.prevent="addBook">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">عنوان الكتاب</label>
              <input v-model="newBook.title" type="text" required class="form-input" placeholder="أدخل عنوان الكتاب" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">المؤلف</label>
              <input v-model="newBook.author" type="text" required class="form-input" placeholder="أدخل اسم المؤلف" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">ISBN</label>
              <input v-model="newBook.isbn" type="text" required class="form-input" placeholder="أدخل رقم ISBN" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">التصنيف</label>
              <select v-model="newBook.category" required class="form-select">
                <option value="">اختر التصنيف</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">الموقع</label>
              <input v-model="newBook.location" type="text" required class="form-input" placeholder="مثال: A-1-001" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showAddBookModal = false" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" class="btn-primary">
              إضافة الكتاب
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../stores/books'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const booksStore = useBooksStore()

// Reactive data
const searchQuery = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const showAddBookModal = ref(false)

const newBook = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  location: '',
})

onMounted(() => {
  booksStore.fetchBooks()
})

// Computed properties
const filteredBooks = computed(() => {
  return booksStore.books.filter(book => {
    const matchesSearch = !searchQuery.value ||
      book.article_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.isbn.includes(searchQuery.value)

    const matchesStatus = !selectedStatus.value || book.status === selectedStatus.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage.value))

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
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
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'badge-success'
    case 'Inactive':
      return 'badge-warning'
    default:
      return 'badge-secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'Active':
      return 'متاح'
    case 'Inactive':
      return 'مستعار'
    default:
      return 'غير محدد'
  }
}

const addBook = () => {
  // To be implemented
}

const viewBook = (book: any) => {
  console.log('View book:', book)
  // Implement view functionality
}

const editBook = (book: any) => {
  console.log('Edit book:', book)
  // Implement edit functionality
}

const deleteBook = (book: any) => {
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