import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  category: string
  status: 'available' | 'borrowed' | 'reserved'
  location: string
}

export const useBooksStore = defineStore('books', () => {
  // State
  const books = ref<Book[]>([
    {
      id: 1,
      title: 'الأسود يليق بك',
      author: 'أحلام مستغانمي',
      isbn: '978-0-7432-7356-5',
      category: 'الأدب',
      status: 'available',
      location: 'A-1-001',
    },
    {
      id: 2,
      title: 'مئة عام من العزلة',
      author: 'غابرييل غارسيا ماركيز',
      isbn: '978-0-06-112008-4',
      category: 'الأدب',
      status: 'borrowed',
      location: 'A-1-002',
    },
    {
      id: 3,
      title: '1984',
      author: 'جورج أورويل',
      isbn: '978-0-452-28423-4',
      category: 'الأدب',
      status: 'available',
      location: 'A-1-003',
    },
    {
      id: 4,
      title: 'تاريخ موجز للزمن',
      author: 'ستيفن هوكينغ',
      isbn: '978-0-553-38016-3',
      category: 'العلوم',
      status: 'reserved',
      location: 'B-2-001',
    },
    // Add more mock books
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 5,
      title: `كتاب رقم ${i + 5}`,
      author: `مؤلف ${i + 5}`,
      isbn: `978-0-${String(i + 5).padStart(3, '0')}-${String(i + 5).padStart(5, '0')}-${i % 10}`,
      category: ['الأدب', 'العلوم', 'التاريخ', 'السير الذاتية', 'التكنولوجيا'][i % 5],
      status: (['available', 'borrowed', 'reserved'] as const)[i % 3],
      location: `${String.fromCharCode(65 + (i % 3))}-${Math.floor(i / 3) + 1}-${String(i + 1).padStart(3, '0')}`,
    }))
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalBooks = computed(() => books.value.length)
  const availableBooks = computed(() => books.value.filter(book => book.status === 'available').length)
  const borrowedBooks = computed(() => books.value.filter(book => book.status === 'borrowed').length)
  const reservedBooks = computed(() => books.value.filter(book => book.status === 'reserved').length)

  const categories = computed(() => {
    const uniqueCategories = [...new Set(books.value.map(book => book.category))]
    return uniqueCategories.sort()
  })

  // Actions
  const fetchBooks = async () => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, this would be an actual API call
      // const response = await api.get('/books')
      // books.value = response.data
    } catch (err) {
      error.value = 'فشل في تحميل الكتب'
      console.error('Error fetching books:', err)
    } finally {
      loading.value = false
    }
  }

  const addBook = async (bookData: Omit<Book, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newBook: Book = {
        id: Math.max(...books.value.map(b => b.id)) + 1,
        ...bookData,
      }
      
      books.value.push(newBook)
      return newBook
    } catch (err) {
      error.value = 'فشل في إضافة الكتاب'
      console.error('Error adding book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (id: number, bookData: Partial<Book>) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = books.value.findIndex(book => book.id === id)
      if (index !== -1) {
        books.value[index] = { ...books.value[index], ...bookData }
        return books.value[index]
      }
      throw new Error('الكتاب غير موجود')
    } catch (err) {
      error.value = 'فشل في تحديث الكتاب'
      console.error('Error updating book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = books.value.findIndex(book => book.id === id)
      if (index !== -1) {
        books.value.splice(index, 1)
        return true
      }
      throw new Error('الكتاب غير موجود')
    } catch (err) {
      error.value = 'فشل في حذف الكتاب'
      console.error('Error deleting book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchBooks = (query: string, category?: string, status?: string) => {
    return books.value.filter(book => {
      const matchesSearch = !query || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
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