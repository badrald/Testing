import { createResource } from 'frappe-ui'
import { frappeRequest } from 'frappe-ui'

// Resource for fetching all books
export const booksResource = createResource({
  url: "lms.api.books.get_all_books",
  auto: true,
})

// Function to add a new book
export const addBook = async (bookData) => {
  try {
    await frappeRequest({
      method: 'POST',
      url: 'lms.api.books.add_book',
      data: bookData,
    })
    booksResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error adding book:', error)
    return { success: false, error }
  }
}

// Function to update an existing book
export const updateBook = async (bookData) => {
  try {
    await frappeRequest({
      method: 'PUT',
      url: 'lms.api.books.update_book',
      data: bookData,
    })
    booksResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error updating book:', error)
    return { success: false, error }
  }
}

// Function to delete a book
export const deleteBook = async (bookName) => {
  try {
    await frappeRequest({
      method: 'DELETE',
      url: 'lms.api.books.delete_book',
      data: { name: bookName },
    })
    booksResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error deleting book:', error)
    return { success: false, error }
  }
}
