import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Transaction {
  id: number
  transactionId: string
  bookTitle: string
  bookAuthor: string
  memberName: string
  memberId: string
  type: 'borrow' | 'return'
  issueDate: string
  dueDate: string | null
  returnDate: string | null
  status: 'active' | 'returned' | 'overdue'
  condition?: string
  notes?: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref<Transaction[]>([
    {
      id: 1,
      transactionId: 'TXN001',
      bookTitle: 'الأسود يليق بك',
      bookAuthor: 'أحلام مستغانمي',
      memberName: 'أحمد محمد',
      memberId: 'LIB001',
      type: 'borrow',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      returnDate: null,
      status: 'active',
    },
    {
      id: 2,
      transactionId: 'TXN002',
      bookTitle: 'مئة عام من العزلة',
      bookAuthor: 'غابرييل غارسيا ماركيز',
      memberName: 'ف��طمة أحمد',
      memberId: 'LIB002',
      type: 'return',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      returnDate: '2024-01-20',
      status: 'returned',
      condition: 'good',
    },
    {
      id: 3,
      transactionId: 'TXN003',
      bookTitle: '1984',
      bookAuthor: 'جورج أورويل',
      memberName: 'محمد سالم',
      memberId: 'LIB003',
      type: 'borrow',
      issueDate: '2024-01-05',
      dueDate: '2024-01-20',
      returnDate: null,
      status: 'overdue',
    },
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalTransactions = computed(() => transactions.value.length)
  const activeTransactions = computed(() => transactions.value.filter(t => t.status === 'active').length)
  const overdueTransactions = computed(() => transactions.value.filter(t => t.status === 'overdue').length)
  const returnedTransactions = computed(() => transactions.value.filter(t => t.status === 'returned').length)

  const todayIssued = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter(t => t.issueDate === today && t.type === 'borrow').length
  })

  const todayReturned = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return transactions.value.filter(t => t.returnDate === today).length
  })

  const recentTransactions = computed(() => {
    return transactions.value
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(0, 5)
  })

  // Actions
  const fetchTransactions = async () => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, this would be an actual API call
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
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTransaction: Transaction = {
        id: Math.max(...transactions.value.map(t => t.id)) + 1,
        transactionId: `TXN${String(transactions.value.length + 1).padStart(3, '0')}`,
        bookTitle: 'كتاب عينة', // In real app, fetch from book ID
        bookAuthor: 'مؤلف عينة',
        memberName: 'عضو عينة', // In real app, fetch from member ID
        memberId: data.memberId,
        type: 'borrow',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: data.dueDate,
        returnDate: null,
        status: 'active',
      }
      
      transactions.value.push(newTransaction)
      return newTransaction
    } catch (err) {
      error.value = 'فشل في إصدار الكتاب'
      console.error('Error issuing book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const returnBook = async (transactionId: string, data: {
    returnDate: string
    condition: string
    notes?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const transaction = transactions.value.find(t => t.transactionId === transactionId)
      if (transaction) {
        transaction.returnDate = data.returnDate
        transaction.status = 'returned'
        transaction.type = 'return'
        transaction.condition = data.condition
        transaction.notes = data.notes
        return transaction
      }
      throw new Error('المعاملة غير موجودة')
    } catch (err) {
      error.value = 'فشل في إرجاع الكتاب'
      console.error('Error returning book:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchTransactions = (query: string, type?: string, status?: string, date?: string) => {
    return transactions.value.filter(transaction => {
      const matchesSearch = !query || 
        transaction.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
        transaction.memberName.toLowerCase().includes(query.toLowerCase()) ||
        transaction.memberId.toLowerCase().includes(query.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(query.toLowerCase())
      
      const matchesType = !type || transaction.type === type
      const matchesStatus = !status || transaction.status === status
      const matchesDate = !date || transaction.issueDate === date
      
      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }

  const sendReminder = async (transactionId: string) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real app, this would send an email/SMS reminder
      console.log(`Reminder sent for transaction: ${transactionId}`)
      return true
    } catch (err) {
      error.value = 'فشل في إرسال التذكير'
      console.error('Error sending reminder:', err)
      throw err
    } finally {
      loading.value = false
    }
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