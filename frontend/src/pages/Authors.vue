<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">إدارة المؤلفين</h1>
        <p class="mt-2 text-gray-600">إدارة معلومات المؤلفين وكتبهم</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddAuthorModal = true">
          <FeatherIcon name="user-plus" class="w-4 h-4 mr-2" />
          إضافة مؤلف جديد
        </Button>
      </div>
    </div>

    <!-- Search and Filters -->
    <Card>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <Input v-model="searchQuery" placeholder="البحث بالاسم..." />
          </div>
        </div>
      </div>
    </Card>

    <!-- Authors Table -->
    <DataTable :columns="columns" :data="filteredAuthors">
      <template #cell-actions="{ row }">
        <Button @click="editAuthor(row)" size="sm" theme="gray">Edit</Button>
        <Button @click="deleteAuthor(row)" size="sm" theme="red" class="ml-2">Delete</Button>
      </template>
    </DataTable>

    <Dialog v-model="showAddAuthorModal" title="Add Author">
      <form @submit.prevent="addAuthor">
        <div class="space-y-4">
          <Input v-model="newAuthor.author_name" label="Name" />
        </div>
        <div class="mt-6 flex justify-end">
          <Button @click="showAddAuthorModal = false" theme="gray" class="mr-2">Cancel</Button>
          <Button type="submit" theme="primary">Save</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createResource, Button, Card, DataTable, Dialog, Input, FeatherIcon } from 'frappe-ui'

const showAddAuthorModal = ref(false)
const searchQuery = ref('')

const newAuthor = ref({
  author_name: '',
})

const columns = ref([
  { key: 'author_name', label: 'Name' },
  { key: 'actions', label: 'Actions' },
])

const authorsResource = createResource({
  url: "lms.lms.doctype.author.author.get_authors",
  auto: true,
})

const filteredAuthors = computed(() => {
  if (!authorsResource.data) return []
  return authorsResource.data.filter(author => {
    const matchesSearch = !searchQuery.value || 
      author.author_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesSearch
  })
})

const addAuthor = () => {
  // To be implemented
  console.log("addAuthor", newAuthor.value)
}

const editAuthor = (author) => {
  // To be implemented
  console.log("editAuthor", author)
}

const deleteAuthor = (author) => {
  // To be implemented
  console.log("deleteAuthor", author)
}
</script>