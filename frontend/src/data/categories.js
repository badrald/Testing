import { createResource } from 'frappe-ui'
import { frappeRequest } from 'frappe-ui'

// Resource for fetching all categories
export const categoriesResource = createResource({
  url: "lms.lms.api.category.get_all_categories",
  auto: true,
})

// Function to add a new category
export const addCategory = async (categoryData) => {
  try {
    await frappeRequest({
      method: 'POST',
      url: 'lms.lms.api.category.add_category',
      data: categoryData,
    })
    categoriesResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error adding category:', error)
    return { success: false, error }
  }
}

// Function to update a category
export const updateCategory = async (categoryData) => {
  try {
    await frappeRequest({
      method: 'PUT',
      url: 'lms.lms.api.category.update_category',
      data: categoryData,
    })
    categoriesResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error }
  }
}

// Function to delete a category
export const deleteCategory = async (categoryName) => {
  try {
    await frappeRequest({
      method: 'DELETE',
      url: 'lms.lms.api.category.delete_category',
      data: { name: categoryName },
    })
    categoriesResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error }
  }
}
