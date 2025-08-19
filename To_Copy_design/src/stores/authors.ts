import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Author {
  name: string
  author_name: string
}

export const useAuthorsStore = defineStore('authors', () => {
  // State
  const authors = ref<Author[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchAuthors = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/method/lms.lms.doctype.author.author.get_authors')
      if (!response.ok) {
        throw new Error('Failed to fetch authors')
      }
      const data = await response.json()
      authors.value = data.message
    } catch (err) {
      error.value = 'فشل في تحميل المؤلفين'
      console.error('Error fetching authors:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    authors,
    loading,
    error,
    
    // Actions
    fetchAuthors,
  }
})
