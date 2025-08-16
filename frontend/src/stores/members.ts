import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Member {
  id: number
  memberId: string
  name: string
  email: string
  phone: string
  membershipType: 'student' | 'faculty' | 'public'
  status: 'active' | 'expired' | 'suspended'
  expiryDate: string
  booksBorrowed: number
  borrowLimit: number
  address: string
}

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([
    {
      id: 1,
      memberId: 'LIB001',
      name: 'أحمد محمد علي',
      email: 'ahmed.mohamed@email.com',
      phone: '+966-50-123-4567',
      membershipType: 'student',
      status: 'active',
      expiryDate: '2024-12-31',
      booksBorrowed: 2,
      borrowLimit: 5,
      address: 'الرياض، المملكة العربية السعودية',
    },
    {
      id: 2,
      memberId: 'LIB002',
      name: 'فاطمة أحمد',
      email: 'fatima.ahmed@email.com',
      phone: '+966-55-234-5678',
      membershipType: 'faculty',
      status: 'active',
      expiryDate: '2025-06-30',
      booksBorrowed: 1,
      borrowLimit: 10,
      address: 'جدة، المملكة العربية السعودية',
    },
    {
      id: 3,
      memberId: 'LIB003',
      name: 'محمد سالم',
      email: 'mohammed.salem@email.com',
      phone: '+966-56-345-6789',
      membershipType: 'public',
      status: 'expired',
      expiryDate: '2024-01-15',
      booksBorrowed: 0,
      borrowLimit: 3,
      address: 'الدمام، المملكة العربية السعودية',
    },
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalMembers = computed(() => members.value.length)
  const activeMembers = computed(() => members.value.filter(member => member.status === 'active').length)
  const expiredMemberships = computed(() => members.value.filter(member => member.status === 'expired').length)
  const suspendedMembers = computed(() => members.value.filter(member => member.status === 'suspended').length)

  // Actions
  const fetchMembers = async () => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, this would be an actual API call
    } catch (err) {
      error.value = 'فشل في تحميل الأعضاء'
      console.error('Error fetching members:', err)
    } finally {
      loading.value = false
    }
  }

  const addMember = async (memberData: Omit<Member, 'id' | 'memberId' | 'booksBorrowed'>) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newMember: Member = {
        id: Math.max(...members.value.map(m => m.id)) + 1,
        memberId: `LIB${String(members.value.length + 1).padStart(3, '0')}`,
        booksBorrowed: 0,
        ...memberData,
      }
      
      members.value.push(newMember)
      return newMember
    } catch (err) {
      error.value = 'فشل في إضافة العضو'
      console.error('Error adding member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMember = async (id: number, memberData: Partial<Member>) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value[index] = { ...members.value[index], ...memberData }
        return members.value[index]
      }
      throw new Error('العضو غير موجود')
    } catch (err) {
      error.value = 'فشل في تحديث العضو'
      console.error('Error updating member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMember = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = members.value.findIndex(member => member.id === id)
      if (index !== -1) {
        members.value.splice(index, 1)
        return true
      }
      throw new Error('العضو غير موجود')
    } catch (err) {
      error.value = 'فشل في حذف العضو'
      console.error('Error deleting member:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchMembers = (query: string, membershipType?: string, status?: string) => {
    return members.value.filter(member => {
      const matchesSearch = !query || 
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase()) ||
        member.memberId.toLowerCase().includes(query.toLowerCase())
      
      const matchesType = !membershipType || member.membershipType === membershipType
      const matchesStatus = !status || member.status === status
      
      return matchesSearch && matchesType && matchesStatus
    })
  }

  const renewMembership = async (id: number, months: number = 12) => {
    loading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const member = members.value.find(m => m.id === id)
      if (member) {
        const currentDate = new Date()
        const newExpiryDate = new Date(currentDate.setMonth(currentDate.getMonth() + months))
        member.expiryDate = newExpiryDate.toISOString().split('T')[0]
        member.status = 'active'
        return member
      }
      throw new Error('العضو غير موجود')
    } catch (err) {
      error.value = 'فشل في تجديد العضوية'
      console.error('Error renewing membership:', err)
      throw err
    } finally {
      loading.value = false
    }
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