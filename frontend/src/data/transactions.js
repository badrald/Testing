import { createResource } from 'frappe-ui'
import { frappeRequest } from 'frappe-ui'

// Resource for fetching all transactions
export const transactionsResource = createResource({
  url: "lms.lms.doctype.library_transaction.library_transaction.get_transactions",
  auto: true,
})

// Function to create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    await frappeRequest({
      method: 'POST',
      url: 'lms.lms.doctype.library_transaction.library_transaction.create_transaction',
      data: transactionData,
    })
    transactionsResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error }
  }
}

// Function to update a transaction (e.g., mark as returned)
export const updateTransaction = async (transactionData) => {
  try {
    await frappeRequest({
      method: 'PUT',
      url: 'lms.lms.doctype.library_transaction.library_transaction.update_transaction',
      data: transactionData,
    })
    transactionsResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { success: false, error }
  }
}

// Function to get transaction statistics
export const getTransactionStats = async () => {
  try {
    const response = await frappeRequest({
      method: 'GET',
      url: 'lms.lms.doctype.library_transaction.library_transaction.get_transaction_stats',
    })
    return { success: true, data: response.message }
  } catch (error) {
    console.error('Error getting transaction stats:', error)
    return { success: false, error }
  }
}
