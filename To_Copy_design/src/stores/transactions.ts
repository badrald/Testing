import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Transaction {
  name: string
  transaction_type: string
  transaction_date: string
  article: string
  article_name: string
  library_member: string
  member_full_name: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalTransactions = computed(() => transactions.value.length)
  const activeTransactions = computed(() => transactions.value.filter(t => t.transaction_type === 'Issue').length)
  const overdueTransactions = computed(() => 0) // To be implemented
  const returnedTransactions = computed(() => transactions.value.filter(t => t.transaction_type === 'Return').length)

  const todayIssued = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter(t => t.transaction_date === today && t.transaction_type === 'Issue').length
  })

  const todayReturned = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter(t => t.transaction_date === today && t.transaction_type === 'Return').length
  })

  const recentTransactions = computed(() => {
    return transactions.value
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
      .slice(0, 5)
  })

  // Actions
  const fetchTransactions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/method/lms.lms.doctype.library_transaction.library_transaction.get_transactions')
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const data = await response.json()
      transactions.value = data.message
    } catch (err) {
      error.value = 'فشل في تحميل المعاملات'
      console.error('Error fetching transactions:', err)
    } finally {
      loading.value = false
    }
  }

  const issueBook = async (data: {
    memberId: string
    bookId: string
    dueDate: string
  }) => {
    // To be implemented
  }

  const returnBook = async (transactionId: string, data: {
    returnDate: string
    condition: string
    notes?: string
  }) => {
    // To be implemented
  }

  const searchTransactions = (query: string, type?: string, status?: string, date?: string) => {
    return transactions.value.filter(transaction => {
      const matchesSearch = !query || 
        transaction.article_name.toLowerCase().includes(query.toLowerCase()) ||
        transaction.member_full_name.toLowerCase().includes(query.toLowerCase()) ||
        transaction.name.toLowerCase().includes(query.toLowerCase())
      
      const matchesType = !type || transaction.transaction_type === type
      // const matchesStatus = !status || transaction.status === status
      const matchesDate = !date || transaction.transaction_date === date
      
      return matchesSearch && matchesType && matchesDate
    })
  }

  const sendReminder = async (transactionId: string) => {
    // To be implemented
  }

  return {
    // State
    transactions,
    loading,
    error,
    
    // Getters
    totalTransactions,
    activeTransactions,
    overdueTransactions,
    returnedTransactions,
    todayIssued,
    todayReturned,
    recentTransactions,
    
    // Actions
    fetchTransactions,
    issueBook,
    returnBook,
    searchTransactions,
    sendReminder,
  }
})