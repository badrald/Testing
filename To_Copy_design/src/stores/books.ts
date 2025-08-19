import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Book {
  name: string
  article_name: string
  isbn: string
  publisher: string
  status: string
  cover: string
}

export const useBooksStore = defineStore('books', () => {
  // State
  const books = ref<Book[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalBooks = computed(() => books.value.length)
  const availableBooks = computed(() => books.value.filter(book => book.status === 'Active').length)
  const borrowedBooks = computed(() => books.value.filter(book => book.status === 'Inactive').length)
  const reservedBooks = computed(() => books.value.filter(book => book.status === 'Reserved').length) // Assuming 'Reserved' is a status

  const categories = computed(() => {
    const uniqueCategories = [...new Set(books.value.map(book => book.category))]
    return uniqueCategories.sort()
  })

  // Actions
  const fetchBooks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/method/lms.lms.doctype.book.book.get_books')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      books.value = data.message
    } catch (err) {
      error.value = 'فشل في تحميل الكتب'
      console.error('Error fetching books:', err)
    } finally {
      loading.value = false
    }
  }

  const addBook = async (bookData: Omit<Book, 'name'>) => {
    // ... to be implemented
  }

  const updateBook = async (name: string, bookData: Partial<Book>) => {
    // ... to be implemented
  }

  const deleteBook = async (name: string) => {
    // ... to be implemented
  }

  const searchBooks = (query: string, category?: string, status?: string) => {
    return books.value.filter(book => {
      const matchesSearch = !query ||
        book.article_name.toLowerCase().includes(query.toLowerCase()) ||
        book.publisher.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.includes(query)

      const matchesCategory = !category || book.category === category
      const matchesStatus = !status || book.status === status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }

  return {
    // State
    books,
    loading,
    error,

    // Getters
    totalBooks,
    availableBooks,
    borrowedBooks,
    reservedBooks,
    categories,

    // Actions
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
  }
})