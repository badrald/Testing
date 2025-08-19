import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Member {
  name: string
  member_id: string
  memeber_name: string
  phone_number: string
  email: string
  address: string
  join_date: string
  member_type: string
  is_membership_valid: number
}

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalMembers = computed(() => members.value.length)
  const activeMembers = computed(() => members.value.filter(member => member.is_membership_valid === 1).length)
  const expiredMemberships = computed(() => members.value.filter(member => member.is_membership_valid === 0).length)
  const suspendedMembers = computed(() => 0) // Assuming no suspended status from backend

  // Actions
  const fetchMembers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/method/lms.lms.doctype.member.member.get_members')
      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }
      const data = await response.json()
      members.value = data.message
    } catch (err) {
      error.value = 'فشل في تحميل الأعضاء'
      console.error('Error fetching members:', err)
    } finally {
      loading.value = false
    }
  }

  const addMember = async (memberData: Omit<Member, 'name'>) => {
    // ... to be implemented
  }

  const updateMember = async (name: string, memberData: Partial<Member>) => {
    // ... to be implemented
  }

  const deleteMember = async (name: string) => {
    // ... to be implemented
  }

  const searchMembers = (query: string, membershipType?: string, status?: string) => {
    return members.value.filter(member => {
      const matchesSearch = !query || 
        member.memeber_name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.member_id.toLowerCase().includes(query.toLowerCase())
      
      const matchesType = !membershipType || member.member_type === membershipType
      // const matchesStatus = !status || member.status === status // status is not available
      
      return matchesSearch && matchesType
    })
  }

  const renewMembership = async (id: number, months: number = 12) => {
    // ... to be implemented
  }

  return {
    // State
    members,
    loading,
    error,
    
    // Getters
    totalMembers,
    activeMembers,
    expiredMemberships,
    suspendedMembers,
    
    // Actions
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    searchMembers,
    renewMembership,
  }
})