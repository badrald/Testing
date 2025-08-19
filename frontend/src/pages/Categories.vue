<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
        <p class="mt-2 text-gray-600">تنظيم الكتب حسب التصنيفات والمواضيع</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddCategoryModal = true">
          <FeatherIcon name="plus" class="w-4 h-4 mr-2" />
          إضافة تصنيف جديد
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

    <!-- Categories Table -->
    <DataTable :columns="columns" :data="filteredCategories">
      <template #cell-actions="{ row }">
        <Button @click="editCategory(row)" size="sm" theme="gray">Edit</Button>
        <Button @click="deleteCategory(row)" size="sm" theme="red" class="ml-2">Delete</Button>
      </template>
    </DataTable>

    <Dialog v-model="showAddCategoryModal" title="Add Category">
      <form @submit.prevent="addCategory">
        <div class="space-y-4">
          <Input v-model="newCategory.category_name" label="Name" />
        </div>
        <div class="mt-6 flex justify-end">
          <Button @click="showAddCategoryModal = false" theme="gray" class="mr-2">Cancel</Button>
          <Button type="submit" theme="primary">Save</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createResource, Button, Card, DataTable, Dialog, Input, FeatherIcon } from 'frappe-ui'

const showAddCategoryModal = ref(false)
const searchQuery = ref('')

const newCategory = ref({
  category_name: '',
})

const columns = ref([
  { key: 'category_name', label: 'Name' },
  { key: 'actions', label: 'Actions' },
])

const categoriesResource = createResource({
  url: "lms.lms.api.category.get_categories",
  auto: true,
})

const filteredCategories = computed(() => {
  if (!categoriesResource.data) return []
  return categoriesResource.data.filter(category => {
    const matchesSearch = !searchQuery.value || 
      category.category_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    return matchesSearch
  })
})

const addCategory = () => {
  // To be implemented
  console.log("addCategory", newCategory.value)
}

const editCategory = (category) => {
  // To be implemented
  console.log("editCategory", category)
}

const deleteCategory = (category) => {
  // To be implemented
  console.log("deleteCategory", category)
}
</script>