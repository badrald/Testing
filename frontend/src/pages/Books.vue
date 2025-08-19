<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">إدارة الكتب</h1>
        <p class="mt-2 text-gray-600">إدارة مجموعة كتب المكتبة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddBookModal = true">
          <FeatherIcon name="plus" class="w-4 h-4 mr-2" />
          إضافة كتاب جديد
        </Button>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card >
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <Input v-model="searchQuery" placeholder="البحث بالعنوان، المؤلف، أو ISBN..." />
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="w-full form-select">
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

    <Dialog v-model="showAddBookModal" title="Add Book">
      <form @submit.prevent="addBook">
        <div class="space-y-4">
          <Input v-model="newBook.article_name" label="Title" />
          <Input v-model="newBook.isbn" label="ISBN" />
          <Input v-model="newBook.publisher" label="Publisher" />
          <Input v-model="newBook.status" label="Status" />
        </div>
        <div class="mt-6 flex justify-end">
          <Button @click="showAddBookModal = false" theme="gray" class="mr-2">Cancel</Button>
          <Button type="submit" theme="primary">Save</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createResource, Button, Card, Dialog, Input, Badge, FeatherIcon, frappeRequest } from 'frappe-ui'

const showAddBookModal = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')

const newBook = ref({
  article_name: '',
  isbn: '',
  publisher: '',
  status: 'Active',
})

const booksResource = createResource({
  url: "lms.api.books.get_all_books",
  auto: true,
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

// Methods
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active':
      return 'badge-success'
    case 'Inactive':
      return 'badge-warning'
    default:
      return 'badge-secondary'
  }
}

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


const addBook = () => {
  // To be implemented
  console.log("addBook", newBook.value)
}

const editBook = (book) => {
  // To be implemented
  console.log("editBook", book)
}

const deleteBook = (book) => {
  // To be implemented
  console.log("deleteBook", book)
}
</script>