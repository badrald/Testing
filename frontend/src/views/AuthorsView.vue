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
                placeholder="البحث بالاسم أو السيرة الذاتية..."
                class="form-input pl-10"
              />
            </div>
          </div>

          <!-- Sort By -->
          <div>
            <select v-model="sortBy" class="form-select">
              <option value="name">ترتيب بالاسم</option>
              <option value="books">ترتيب بعدد الكتب</option>
              <option value="recent">المضاف حديثاً</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Authors Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="author in paginatedAuthors"
        :key="author.id"
        class="card hover:shadow-medium transition-all duration-300 group"
      >
        <div class="card-body">
          <!-- Author Avatar and Basic Info -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
                <span class="text-xl font-medium text-white">
                  {{ getInitials(author.name) }}
                </span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-secondary-900">{{ author.name }}</h3>
              <p class="text-sm text-secondary-500">{{ author.nationality }}</p>
            </div>
          </div>

          <!-- Author Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-primary-50 rounded-lg">
              <div class="text-2xl font-bold text-primary-600">{{ author.bookCount }}</div>
              <div class="text-xs text-secondary-500">كتاب</div>
            </div>
            <div class="text-center p-3 bg-success-50 rounded-lg">
              <div class="text-2xl font-bold text-success-600">{{ author.availableBooks }}</div>
              <div class="text-xs text-secondary-500">متاح</div>
            </div>
          </div>

          <!-- Biography Preview -->
          <div class="mb-4">
            <p class="text-sm text-secondary-600 line-clamp-3">
              {{ author.biography }}
            </p>
          </div>

          <!-- Birth/Death Dates -->
          <div class="text-xs text-secondary-500 mb-4 space-y-1">
            <div v-if="author.birthDate" class="flex items-center">
              <CalendarIcon class="w-3 h-3 mr-1" />
              ولد: {{ formatDate(author.birthDate) }}
            </div>
            <div v-if="author.deathDate" class="flex items-center">
              <CalendarIcon class="w-3 h-3 mr-1" />
              توفي: {{ formatDate(author.deathDate) }}
            </div>
          </div>

          <!-- Popular Books -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-secondary-900 mb-2">الكتب الشهيرة:</h4>
            <div class="space-y-1">
              <div
                v-for="book in author.popularBooks.slice(0, 3)"
                :key="book"
                class="text-xs text-secondary-600 bg-secondary-50 px-2 py-1 rounded line-clamp-1"
              >
                {{ book }}
              </div>
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
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">الجنسية</label>
              <input
                v-model="newAuthor.nationality"
                type="text"
                class="form-input"
                placeholder="أدخل الجنسية"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">تاريخ الميلاد</label>
              <input
                v-model="newAuthor.birthDate"
                type="date"
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">تاريخ الوفاة (إن وجد)</label>
              <input
                v-model="newAuthor.deathDate"
                type="date"
                class="form-input"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">السيرة الذاتية</label>
              <textarea
                v-model="newAuthor.biography"
                rows="4"
                class="form-textarea"
                placeholder="أدخل السيرة الذاتية للمؤلف"
              ></textarea>
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
import { ref, computed } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

// Reactive data
const searchQuery = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const showAddAuthorModal = ref(false)

const newAuthor = ref({
  name: '',
  nationality: '',
  birthDate: '',
  deathDate: '',
  biography: '',
})

// Mock authors data
const authors = ref([
  {
    id: 1,
    name: 'أحلام مستغانمي',
    nationality: 'جزائرية',
    birthDate: '1953-04-13',
    deathDate: '',
    biography: 'روائية وشاعرة جزائرية، تعتبر من أهم الكاتبات العربيات المعاصرات. اشتهرت برواياتها التي تتناول قضايا المرأة والمجتمع العربي.',
    bookCount: 8,
    availableBooks: 5,
    popularBooks: ['ذاكرة الجسد', 'فوضى الحواس', 'عابر سرير'],
  },
  {
    id: 2,
    name: 'نجيب محفوظ',
    nationality: 'مصرية',
    birthDate: '1911-12-11',
    deathDate: '2006-08-30',
    biography: 'روائي مصري حاز على جائزة نوبل للآداب عام 1988. يعتبر من أهم الكتاب العرب في القرن العشرين وأكثرهم تأثيراً.',
    bookCount: 15,
    availableBooks: 12,
    popularBooks: ['الثلاثية', 'أولاد حارتنا', 'اللص والكلاب'],
  },
  {
    id: 3,
    name: 'غا��رييل غارسيا ماركيز',
    nationality: 'كولومبية',
    birthDate: '1927-03-06',
    deathDate: '2014-04-17',
    biography: 'كاتب وصحفي وناشط سياسي كولومبي. حاز على جائزة نوبل للآداب عام 1982. يعتبر من أهم رواد الواقعية السحرية.',
    bookCount: 12,
    availableBooks: 8,
    popularBooks: ['مئة عام من العزلة', 'الحب في زمن الكوليرا', 'خريف البطريرك'],
  },
  {
    id: 4,
    name: 'طه حسين',
    nationality: 'مصرية',
    birthDate: '1889-11-15',
    deathDate: '1973-10-28',
    biography: 'أديب وناقد مصري، لُقب بعميد الأدب العربي. كان من رواد النهضة الثقافية العربية الحديثة.',
    bookCount: 20,
    availableBooks: 15,
    popularBooks: ['الأيام', 'دعاء الكروان', 'على هامش السيرة'],
  },
])

// Computed properties
const filteredAuthors = computed(() => {
  let filtered = authors.value.filter(author => {
    const matchesSearch = !searchQuery.value || 
      author.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      author.biography.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesSearch
  })

  // Sort authors
  switch (sortBy.value) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'books':
      filtered.sort((a, b) => b.bookCount - a.bookCount)
      break
    case 'recent':
      filtered.sort((a, b) => b.id - a.id)
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const addAuthor = () => {
  const author = {
    id: authors.value.length + 1,
    ...newAuthor.value,
    bookCount: 0,
    availableBooks: 0,
    popularBooks: [],
  }
  
  authors.value.push(author)
  
  // Reset form
  newAuthor.value = {
    name: '',
    nationality: '',
    birthDate: '',
    deathDate: '',
    biography: '',
  }
  
  showAddAuthorModal.value = false
}

const viewAuthor = (author: any) => {
  console.log('View author:', author)
}

const editAuthor = (author: any) => {
  console.log('Edit author:', author)
}

const deleteAuthor = (author: any) => {
  if (confirm(`هل أنت متأكد من حذف المؤلف ${author.name}؟`)) {
    const index = authors.value.findIndex(a => a.id === author.id)
    if (index > -1) {
      authors.value.splice(index, 1)
    }
  }
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