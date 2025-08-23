import { createResource } from 'frappe-ui'
import { frappeRequest } from 'frappe-ui'

// Resource for fetching all members
export const membersResource = createResource({
  url: "lms.lms.doctype.member.member.get_members",
  auto: true,
})

// Function to add a new member
export const addMember = async (memberData) => {
  try {
    await frappeRequest({
      method: 'POST',
      url: 'lms.lms.doctype.member.member.add_member',
      data: memberData,
    })
    membersResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error adding member:', error)
    return { success: false, error }
  }
}

// Function to update an existing member
export const updateMember = async (memberData) => {
  try {
    await frappeRequest({
      method: 'PUT',
      url: 'lms.lms.doctype.member.member.update_member',
      data: memberData,
    })
    membersResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error updating member:', error)
    return { success: false, error }
  }
}

// Function to delete a member
export const deleteMember = async (memberName) => {
  try {
    await frappeRequest({
      method: 'DELETE',
      url: 'lms.lms.doctype.member.member.delete_member',
      data: { name: memberName },
    })
    membersResource.reload()
    return { success: true }
  } catch (error) {
    console.error('Error deleting member:', error)
    return { success: false, error }
  }
}
