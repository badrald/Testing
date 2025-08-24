<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">إدارة الكتب</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">إدارة مجموعة كتب المكتبة</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddBookModal = true" class="btn-primary w-full h-2 p-5 text-white ">
          <FeatherIcon name="plus" class="w-4 h-4 " />
          إضافة كتاب جديد
        </Button>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card class="bg-white dark:bg-secondary-800">
      <div class=" card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-3 dark:bg-secondary-700 rounded-lg">
            <Input v-model="searchQuery" placeholder="البحث بالعنوان، المؤلف، أو ISBN..." class="h-full" />
          </div>

          <!-- Status Filter -->
          <div class="dark:bg-secondary-700">
            <select v-model="selectedStatus"
              class="w-full h-full form-select bg-white dark:bg-secondary-800 text-gray-900 dark:text-gray-100 border border-secondary-100 dark:border-secondary-700 rounded-lg">
              <option value="">جميع الحالات</option>
              <option value="Active">متاح</option>
              <option value="Inactive">مستعار</option>
            </select>
          </div>
        </div>
      </div>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <Card v-for="book in filteredBooks" :key="book.name"
        class="bg-white dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700">
        <div class="card-body">
          <!-- Book Cover -->
          <div
            class="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img v-if="book.cover" :src="book.cover" :alt="book.article_name"
              class="w-full h-full object-cover rounded-lg">
            <BookOpenIcon v-else class="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{{ book.article_name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ book.publisher }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">ISBN: {{ book.isbn }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">الفئة: {{ book.category }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500">متوفر: {{ book.available_copies }}/{{ book.total_copies }}
          </p>

          <div class="flex items-center justify-between mt-4">
            <Badge :theme="book.status === 'Active' ? 'green' : 'yellow'">{{ book.status }}</Badge>
            <div class="flex space-x-2 ">
              <Button @click="viewBook(book)" class="ml-2" size="sm" theme="primary">
                <FeatherIcon name="eye" class="w-4 h-4 " />
              </Button>
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
    <ModernDialog v-model="showAddBookModal" size="xl" layout="split">
      <template #title>
        إضافة كتاب جديد
      </template>
      <template #description>
        أدخل بيانات الكتاب بالتفصيل وقم برفع صورة الغلاف.
      </template>

      <template #media>
        <div class="space-y-3">
          <div
            class="aspect-[3/4] rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 flex items-center justify-center">
            <img v-if="addCoverPreview" :src="addCoverPreview" class="w-full h-full object-cover" />
            <BookOpenIcon v-else class="w-10 h-10 text-secondary-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover</label>
            <input type="file" accept="image/*" @change="onAddCoverSelected"
              class="block w-full text-sm text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </template>

      <!-- Body -->
      <form @submit.prevent="addBook" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput v-model="newBook.article_name" label="عنوان الكتاب" name="article_name" :required="true" />
          <FormInput v-model="newBook.isbn" label="رقم ISBN" name="isbn" :required="true" />
          <FormInput v-model="newBook.publisher" label="الناشر" name="publisher" :suggestions="publisherSuggestions" />
          <FormSelect v-model="newBook.status" label="الحالة" name="status" dir="rtl" :options="[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]" placeholder="اختر الحالة" clearable />
          <FormInput v-model="newBook.category" label="الفئة" name="category" :suggestions="categorySuggestions" />
          <FormInput v-model="newBook.total_copies" label="عدد الكتب" name="total_copies" />
          <FormInput v-model="newBook.available_copies" label="عدد المتوفر" name="available_copies" />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="add_description">الوصف</label>
          <textarea
            id="add_description"
            name="description"
            v-model="newBook.description"
            rows="4"
            class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent transition duration-200 ease-in-out placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2"
          ></textarea>
        </div>

        <!-- Authors -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">المؤلفون</p>
            <Button size="sm" theme="primary" @click.prevent="addAuthorRow">إضافة مؤلف</Button>
          </div>
          <div v-if="!newBook.authors_names.length" class="text-sm text-gray-500">لا يوجد مؤلفون، اضغط "إضافة مؤلف" لإضافة مؤلف.</div>
          <div v-for="(row, idx) in newBook.authors_names" :key="`author-row-${idx}`" class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <FormSelect
              v-model="row.author"
              :options="authorsOptions"
              :name="`author_${idx}`"
              label="المؤلف"
              placeholder="اختر المؤلف"
              clearable
            />
            <FormSelect
              v-model="row.role"
              :options="roleOptions"
              :name="`role_${idx}`"
              label="الدور"
              placeholder="اختر الدور"
              clearable
            />
            <div>
              <Button theme="red" @click.prevent="removeAuthorRow(idx)">حذف</Button>
            </div>
          </div>
        </div>
      </form>

      <!-- Actions -->
      <template #actions>
        <Button @click="showAddBookModal = false" theme="gray" class="mr-2 bg-red-800 text-white">إلغاء</Button>
        <Button @click="addBook" theme="primary" class="bg-primary-600 text-white p-3">حفط</Button>
      </template>
    </ModernDialog>

    <!-- Edit Book Modal -->
    <ModernDialog v-model="showEditBookModal" size="xl" layout="split">
      <template #title>
        تعديل بيانات الكتاب
      </template>
      <template #description>
        قم بتحديث الحقول المطلوبة ويمكنك تغيير صورة الغلاف.
      </template>

      <!-- Body -->
      <form @submit.prevent="updateBook" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput v-model="editBookData.article_name" label="Title" />
          <FormInput v-model="editBookData.isbn" label="ISBN" />
          <FormInput v-model="editBookData.publisher" label="Publisher" name="publisher_edit"
            :suggestions="publisherSuggestions" />
          <FormInput v-model="editBookData.status" label="Status" />
          <FormInput v-model="editBookData.category" label="Category" name="category_edit"
            :suggestions="categorySuggestions" />
          <FormInput v-model="editBookData.total_copies" label="Total Copies" />
          <FormInput v-model="editBookData.available_copies" label="Available Copies" />
        </div>
      </form>

      <template #media>
        <div class="space-y-3">
          <div
            class="aspect-[3/4] rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 flex items-center justify-center">
            <img v-if="editCoverPreview || editBookData.cover" :src="editCoverPreview || editBookData.cover"
              class="w-full h-full object-cover" />
            <BookOpenIcon v-else class="w-10 h-10 text-secondary-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Cover</label>
            <input type="file" accept="image/*" @change="onEditCoverSelected"
              class="block w-full text-sm text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </template>


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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Input, Badge, FeatherIcon, frappeRequest } from 'frappe-ui'
import ModernDialog from '../components/ModernDialog.vue'
import FormInput from '../components/FormInput.vue'
import FormSelect from '../components/FormSelect.vue'
import { booksResource, addBook as addBookApi, updateBook as updateBookApi, deleteBook as deleteBookApi, uploadBookCover } from '../data/books'
import { addToast } from '../utils/toast'

const router = useRouter()

const showAddBookModal = ref(false)
const showEditBookModal = ref(false)
const showDeleteBookModal = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')

// Add modal cover state
const addCoverFile = ref(null)
const addCoverPreview = ref(null)
const onAddCoverSelected = (e) => {
  const file = e.target?.files?.[0]
  if (file) {
    addCoverFile.value = file
    if (addCoverPreview.value) URL.revokeObjectURL(addCoverPreview.value)
    addCoverPreview.value = URL.createObjectURL(file)
  }
}

// Edit modal cover state
const editCoverFile = ref(null)
const editCoverPreview = ref(null)
const onEditCoverSelected = (e) => {
  const file = e.target?.files?.[0]
  if (file) {
    editCoverFile.value = file
    if (editCoverPreview.value) URL.revokeObjectURL(editCoverPreview.value)
    editCoverPreview.value = URL.createObjectURL(file)
  }
}

const newBook = ref({
  article_name: '',
  isbn: '',
  publisher: '',
  status: 'Active',
  category: '',
  total_copies: '',
  available_copies: '',
  description: '',
  authors_names: [], // [{ author: <Author.name>, role: 'Author' | 'Co-Author' | 'Editor' }]
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


// Suggestions from existing data
const publisherSuggestions = computed(() => {
  const src = booksResource.data?.data || []
  const vals = src.map(b => b.publisher).filter(v => !!v && typeof v === 'string')
  return Array.from(new Set(vals))
})

const categorySuggestions = computed(() => {
  const src = booksResource.data?.data || []
  const vals = src.map(b => b.category).filter(v => !!v && typeof v === 'string')
  return Array.from(new Set(vals))
})

// Authors select options and roles
const authorsOptions = ref([])
const roleOptions = [
  { label: 'Author', value: 'Author' },
  { label: 'Co-Author', value: 'Co-Author' },
  { label: 'Editor', value: 'Editor' },
]

async function loadAuthorsOptions() {
  try {
    const res = await frappeRequest({ method: 'GET', url: 'lms.api.authors.get_all_authors' })
    const payload = res?.message ?? res
    if (payload?.success) {
      authorsOptions.value = (payload.data || []).map(a => ({ label: a.author_name, value: a.name }))
    }
  } catch (e) {
    // silent fail; author select will just be empty
  }
}

function addAuthorRow() {
  newBook.value.authors_names.push({ author: '', role: 'Author' })
}

function removeAuthorRow(idx) {
  newBook.value.authors_names.splice(idx, 1)
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


const addBook = async () => {
  // Client-side validation for required fields
  const isbn = (newBook.value.isbn || '').toString().trim()
  if (!isbn) {
    addToast({ type: 'error', title: 'حقل مطلوب', message: 'رقم ISBN مطلوب. الرجاء إدخاله.' })
    return
  }

  const payload = { ...newBook.value }

  // Clean authors list
  if (Array.isArray(payload.authors_names)) {
    payload.authors_names = payload.authors_names
      .filter(r => r && r.author)
      .map(r => ({ author: r.author, role: r.role || 'Author' }))
  }

  // Upload cover if provided
  if (addCoverFile.value) {
    const up = await uploadBookCover(addCoverFile.value)
    if (up.success) {
      payload.cover = up.file_url
    } else {
      const msg = extractErrorMessage(up.error) || 'فشل في رفع صورة الغلاف.'
      addToast({ type: 'warning', title: 'تعذر رفع الغلاف', message: msg })
    }
  }

  const response = await addBookApi(payload)
  if (response.success) {
    addToast({ type: 'success', title: 'تم الحفظ', message: 'تم إضافة الكتاب بنجاح.' })
    showAddBookModal.value = false
    newBook.value = {
      article_name: '',
      isbn: '',
      publisher: '',
      status: 'Active',
      category: '',
      total_copies: '',
      available_copies: '',
      description: '',
      authors_names: [],
    }
    if (addCoverPreview.value) URL.revokeObjectURL(addCoverPreview.value)
    addCoverFile.value = null
    addCoverPreview.value = null
  } else {
    const msg = extractErrorMessage(response.error) || 'حدث خطأ أثناء إضافة الكتاب.'
    addToast({ type: 'error', title: 'فشل الحفظ', message: msg })
  }
}

const editBook = (book) => {
  editBookData.value = { ...book }
  showEditBookModal.value = true
}

const updateBook = async () => {
  const payload = { ...editBookData.value }

  if (editCoverFile.value) {
    const up = await uploadBookCover(editCoverFile.value)
    if (up.success) {
      payload.cover = up.file_url
    } else {
      const msg = extractErrorMessage(up.error) || 'فشل في رفع صورة الغلاف.'
      addToast({ type: 'warning', title: 'تعذر رفع الغلاف', message: msg })
    }
  }

  const response = await updateBookApi(payload)
  if (response.success) {
    addToast({ type: 'success', title: 'تم التحديث', message: 'تم تحديث بيانات الكتاب بنجاح.' })
    showEditBookModal.value = false
    if (editCoverPreview.value) URL.revokeObjectURL(editCoverPreview.value)
    editCoverFile.value = null
    editCoverPreview.value = null
  } else {
    const msg = extractErrorMessage(response.error) || 'حدث خطأ أثناء تحديث بيانات الكتاب.'
    addToast({ type: 'error', title: 'فشل التحديث', message: msg })
  }
}

const deleteBook = (book) => {
  deleteBookData.value = { name: book.name, article_name: book.article_name }
  showDeleteBookModal.value = true
}

const confirmDeleteBook = async () => {
  const response = await deleteBookApi(deleteBookData.value.name)
  if (response.success) {
    addToast({ type: 'success', title: 'تم الحذف', message: 'تم حذف الكتاب بنجاح.' })
    showDeleteBookModal.value = false
  } else {
    const msg = extractErrorMessage(response.error) || 'حدث خطأ أثناء حذف الكتاب.'
    addToast({ type: 'error', title: 'فشل الحذف', message: msg })
  }
}

const viewBook = (book) => {
  if (!book?.name) return
  router.push({ name: 'BookDetails', params: { id: book.name } })
}

// Cleanup previews on modal close
watch(showAddBookModal, (val) => {
  if (val) {
    loadAuthorsOptions()
  } else {
    if (addCoverPreview.value) URL.revokeObjectURL(addCoverPreview.value)
    addCoverFile.value = null
    addCoverPreview.value = null
  }
})

watch(showEditBookModal, (val) => {
  if (!val) {
    if (editCoverPreview.value) URL.revokeObjectURL(editCoverPreview.value)
    editCoverFile.value = null
    editCoverPreview.value = null
  }
})

// Helper: extract readable error message from frappe/axios errors
function extractErrorMessage(error) {
  if (!error) return ''
  const data = error?.response?.data || {}

  // 1) Frappe _server_messages (JSON string of JSON strings)
  if (typeof data._server_messages === 'string' && data._server_messages.length) {
    try {
      const msgs = JSON.parse(data._server_messages)
      if (Array.isArray(msgs) && msgs.length) {
        // Each item can be a JSON string with {message: '...'}
        const first = msgs[0]
        if (typeof first === 'string') {
          try {
            const inner = JSON.parse(first)
            if (inner?.message) return normalizeFrappeMessage(inner.message)
          } catch (_) {
            return normalizeFrappeMessage(first)
          }
        }
      }
    } catch (_) { /* ignore */ }
  }

  // 2) Direct message field
  if (data.message) return normalizeFrappeMessage(data.message)

  // 3) error.message or string
  if (error.message) return normalizeFrappeMessage(error.message)
  if (typeof error === 'string') return normalizeFrappeMessage(error)

  return ''
}

function normalizeFrappeMessage(msg) {
  // Strip technical prefixes if any, keep readable Arabic/English text
  try {
    if (typeof msg !== 'string') return ''
    // Frappe sometimes returns traceback text; keep first line
    const firstLine = msg.split('\n')[0]
    return firstLine.trim()
  } catch (e) {
    return msg?.toString?.() || ''
  }
}
</script>