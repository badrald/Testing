<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">إدارة الكتب</h1>
        <p class="mt-2 text-gray-600">إدارة مجموعة كتب المكتبة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddBookModal = true" class="btn-primary w-full h-2 p-5 text-white ">
          <FeatherIcon name="plus" class="w-4 h-4 " />
          إضافة كتاب جديد
        </Button>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-3">
            <Input v-model="searchQuery" placeholder="البحث بالعنوان، المؤلف، أو ISBN..." class="h-full" />
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="w-full h-full form-select">
              <option value="">جميع الحالات</option>
              <option value="Active">متاح</option>
              <option value="Inactive">مستعار</option>
            </select>
          </div>
        </div>
      </div>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card v-for="book in filteredBooks" :key="book.name">
        <div class="card-body">
          <!-- Book Cover -->
          <div
            class="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img v-if="book.cover" :src="book.cover" :alt="book.article_name"
              class="w-full h-full object-cover rounded-lg">
            <BookOpenIcon v-else class="w-12 h-12 text-primary-600" />
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 line-clamp-2">{{ book.article_name }}</h3>
          <p class="text-sm text-gray-600">{{ book.publisher }}</p>
          <p class="text-xs text-gray-500">ISBN: {{ book.isbn }}</p>
          <p class="text-xs text-gray-500">الفئة: {{ book.category }}</p>
          <p class="text-xs text-gray-500">متوفر: {{ book.available_copies }}/{{ book.total_copies }}</p>

          <div class="flex items-center justify-between mt-4">
            <Badge :theme="book.status === 'Active' ? 'green' : 'yellow'">{{ book.status }}</Badge>
            <div class="flex space-x-2 ">
              <Button @click="editBook(book)" class="ml-2" size="sm" theme="gray">
                <FeatherIcon name="edit-2" class="w-4 h-4 " />
              </Button>
              <Button @click="deleteBook(book)" size="sm" theme="red">
                <FeatherIcon name="trash-2" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

    </div>

    <!-- Add Book Modal -->
    <ModernDialog v-model="showAddBookModal">
      <template #title>
        إضافة كتاب جديد
      </template>

      <!-- Body -->
      <form @submit.prevent="addBook" class="space-y-4">
        <Input v-model="newBook.article_name" label="Title" class="text-gray-900" />
        <Input v-model="newBook.isbn" label="ISBN" class="text-gray-900" />
        <Input v-model="newBook.publisher" label="Publisher" class="text-gray-900" />
        <Input v-model="newBook.status" label="Status" class="text-gray-900" />
      </form>

      <!-- Actions -->
      <template #actions>
        <Button @click="showAddBookModal = false" theme="gray" class="mr-2">Cancel</Button>
        <Button @click="addBook" theme="primary">Save</Button>
      </template>
    </ModernDialog>

    <!-- Edit Book Modal -->
    <ModernDialog v-model="showEditBookModal">
      <template #title>
        تعديل بيانات الكتاب
      </template>

      <!-- Body -->
      <form @submit.prevent="updateBook" class="space-y-4">
        <Input v-model="editBookData.article_name" label="Title" />
        <Input v-model="editBookData.isbn" label="ISBN" />
        <Input v-model="editBookData.publisher" label="Publisher" />
        <Input v-model="editBookData.status" label="Status" />
      </form>

      <!-- Actions -->
      <template #actions>
        <Button @click="showEditBookModal = false" theme="gray" class=" bg-red-700 p-3 ml-3 text-white">إلغاء</Button>
        <Button @click="updateBook" theme="primary" class="bg-primary-600 text-white p-3">تحديث</Button>
      </template>
    </ModernDialog>

    <!-- Delete Book Confirmation Modal -->
    <ModernDialog v-model="showDeleteBookModal">
      <template #title>
        حذف كتاب
      </template>

      <!-- Body -->
      <div class="space-y-4">
        <p>
          هل أنت متأكد أنك تريد حذف
          <span class="font-bold">{{ deleteBookData.article_name }}</span>؟
        </p>
      </div>

      <!-- Actions -->
      <template #actions>
        <Button @click="showDeleteBookModal = false" theme="gray" class="btn bg-gray-200 p-4 ml-2">الغاء</Button>
        <Button @click="confirmDeleteBook" class="btn bg-red-500 hover:bg-current text-white p-4 ">حذف</Button>
      </template>
    </ModernDialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button, Card, Input, Badge, FeatherIcon } from 'frappe-ui'
import ModernDialog from '../components/ModernDialog.vue'
import { booksResource, addBook as addBookApi, updateBook as updateBookApi, deleteBook as deleteBookApi } from '../data/books'

const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const showDeleteBookModal = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')

const newBook = ref({
  article_name: '',
  isbn: '',
  publisher: '',
  status: 'Active',
})

const editBookData = ref({
  name: '',
  article_name: '',
  isbn: '',
  publisher: '',
  status: 'Active',
})

const deleteBookData = ref({
  name: '',
  article_name: '',
})

const filteredBooks = computed(() => {
  if (!booksResource.data || !booksResource.data.data) return []
  let books = booksResource.data.data

  // فلترة بالبحث
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    books = books.filter(book =>
      (book.article_name && book.article_name.toLowerCase().includes(q)) ||
      (book.publisher && book.publisher.toLowerCase().includes(q)) ||
      (book.isbn && book.isbn.toLowerCase().includes(q))
    )
  }

  // فلترة بالحالة
  if (selectedStatus.value) {
    books = books.filter(book => book.status === selectedStatus.value)
  }
  console.log("Filtered Books:", books);
  return books
})



const getStatusText = (status) => {
  switch (status) {
    case 'Active':
      return 'متاح'
    case 'Inactive':
      return 'مستعار'
    default:
      return 'غير محدد'
  }
}


const addBook = async () => {
  const response = await addBookApi(newBook.value)
  if (response.success) {
    showAddBookModal.value = false
    newBook.value = { article_name: '', isbn: '', publisher: '', status: 'Active' }
  }
}

const editBook = (book) => {
  editBookData.value = { ...book }
  showEditBookModal.value = true
}

const updateBook = async () => {
  const response = await updateBookApi(editBookData.value)
  if (response.success) {
    showEditBookModal.value = false
  }
}

const deleteBook = (book) => {
  deleteBookData.value = { name: book.name, article_name: book.article_name }
  showDeleteBookModal.value = true
}

const confirmDeleteBook = async () => {
  const response = await deleteBookApi(deleteBookData.value.name)
  if (response.success) {
    showDeleteBookModal.value = false
  }
}
</script>