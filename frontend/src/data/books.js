import { createResource } from 'frappe-ui'
import { frappeRequest } from 'frappe-ui'

// Resource for fetching all books
export const booksResource = createResource({
  url: "lms.api.books.get_all_books",
  auto: true,
})

// Resource factory to fetch details of a single book by id
export const createBookDetailsResource = (bookId) =>
  createResource({
    url: 'lms.api.books.get_book_by_id',
    makeParams() {
      return { book_id: bookId }
    },
    auto: true,
  })

// Function to add a new book
export const addBook = async (bookData) => {
  try {
    const res = await frappeRequest({
      method: 'POST',
      url: 'lms.api.books.add_book',
      data: bookData,
    })
    const payload = res?.message ?? res
    if (payload?.success) {
      booksResource.reload()
      return { success: true, name: payload?.data?.name }
    }
    const msg = payload?.message || 'Failed to add book'
    return { success: false, error: new Error(msg), server: payload }
  } catch (error) {
    console.error('Error adding book:', error)
    return { success: false, error }
  }
}

// Function to update an existing book
export const updateBook = async (bookData) => {
  try {
    const res = await frappeRequest({
      method: 'PUT',
      url: 'lms.api.books.update_book',
      data: bookData,
    })
    const payload = res?.message ?? res
    if (payload?.success) {
      booksResource.reload()
      return { success: true, name: payload?.data?.name }
    }
    const msg = payload?.message || 'Failed to update book'
    return { success: false, error: new Error(msg), server: payload }
  } catch (error) {
    console.error('Error updating book:', error)
    return { success: false, error }
  }
}

// Function to delete a book
export const deleteBook = async (bookName) => {
  try {
    const res = await frappeRequest({
      method: 'DELETE',
      url: 'lms.api.books.delete_book',
      data: { name: bookName },
    })
    const payload = res?.message ?? res
    if (payload?.success) {
      booksResource.reload()
      return { success: true }
    }
    const msg = payload?.message || 'Failed to delete book'
    return { success: false, error: new Error(msg), server: payload }
  } catch (error) {
    console.error('Error deleting book:', error)
    return { success: false, error }
  }
}

// Upload cover image and return file_url
export const uploadBookCover = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file, file?.name || 'upload')
    formData.append('is_private', '0')
    // Optional: attach later via doctype/docname after Book is created

    const res = await fetch('/api/method/upload_file', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-Frappe-CSRF-Token': window.csrf_token || ''
      }
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `Upload failed with ${res.status}`)
    }
    const data = await res.json()
    const payload = data?.message ?? data
    const file_url = payload?.file_url
    if (!file_url) throw new Error('No file_url returned')
    return { success: true, file_url }
  } catch (error) {
    console.error('Error uploading cover:', error)
    return { success: false, error }
  }
}
