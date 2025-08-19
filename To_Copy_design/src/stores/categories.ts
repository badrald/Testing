import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Category {
  name: string
  category_name: string
}

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref<Category[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/method/lms.lms.doctype.category.category.get_categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      categories.value = data.message
    } catch (err) {
      error.value = 'فشل في تحميل التصنيفات'
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    categories,
    loading,
    error,
    
    // Actions
    fetchCategories,
  }
})
