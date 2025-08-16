<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-secondary-900">إدارة الأعضاء</h1>
        <p class="mt-2 text-secondary-600">إدارة أعضاء المكتبة والعضويات</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showAddMemberModal = true"
          class="btn-primary"
        >
          <UserPlusIcon class="w-4 h-4 mr-2" />
          إضافة عضو جديد
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <UsersIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">إجمالي الأعضاء</p>
            <p class="text-2xl font-bold text-secondary-900">{{ totalMembers }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
              <CheckCircleIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">الأعضاء النشطون</p>
            <p class="text-2xl font-bold text-secondary-900">{{ activeMembers }}</p>
          </div>
        </div>
      </div>
      
      <div class="stats-card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-white" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-secondary-600">العضويات المنتهية</p>
            <p class="text-2xl font-bold text-secondary-900">{{ expiredMemberships }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-secondary-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم العضوية..."
                class="form-input pl-10"
              />
            </div>
          </div>

          <!-- Membership Type Filter -->
          <div>
            <select v-model="selectedMembershipType" class="form-select">
              <option value="">جميع الأنواع</option>
              <option value="student">طالب</option>
              <option value="faculty">أكاديمي</option>
              <option value="public">عام</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="form-select">
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="expired">منتهي</option>
              <option value="suspended">معلق</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Members Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-semibold text-secondary-900">
          الأعضاء ({{ filteredMembers.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header">
            <tr>
              <th>العضو</th>
              <th>معلومات الاتصال</th>
              <th>العضوية</th>
              <th>الحالة</th>
              <th>الكتب المستعارة</th>
              <th class="text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="member in paginatedMembers"
              :key="member.id"
              class="table-row"
            >
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span class="text-sm font-medium text-white">
                        {{ member.name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-secondary-900">
                      {{ member.name }}
                    </div>
                    <div class="text-sm text-secondary-500">
                      رقم العضوية: {{ member.memberId }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-secondary-900">{{ member.email }}</div>
                <div class="text-sm text-secondary-500">{{ member.phone }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-secondary-900">{{ getMembershipTypeText(member.membershipType) }}</div>
                <div class="text-sm text-secondary-500">
                  ينتهي: {{ formatDate(member.expiryDate) }}
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="badge"
                  :class="getStatusBadgeClass(member.status)"
                >
                  {{ getStatusText(member.status) }}
                </span>
              </td>
              <td class="table-cell">
                {{ member.booksBorrowed }}/{{ member.borrowLimit }}
              </td>
              <td class="table-cell text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewMember(member)"
                    class="p-1 text-primary-600 hover:text-primary-800 rounded"
                    title="عرض التفاصيل"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="editMember(member)"
                    class="p-1 text-secondary-600 hover:text-secondary-800 rounded"
                    title="تعديل العضو"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="renewMembership(member)"
                    class="p-1 text-success-600 hover:text-success-800 rounded"
                    title="تجديد العضوية"
                  >
                    <ArrowPathIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div
      v-if="showAddMemberModal"
      class="modal-overlay"
      @click="showAddMemberModal = false"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="text-lg font-semibold text-secondary-900">إضافة عضو جديد</h3>
        </div>
        <form @submit.prevent="addMember">
          <div class="modal-body space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">الاسم الكامل</label>
              <input
                v-model="newMember.name"
                type="text"
                required
                class="form-input"
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">البريد الإلكتروني</label>
              <input
                v-model="newMember.email"
                type="email"
                required
                class="form-input"
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">رقم الهاتف</label>
              <input
                v-model="newMember.phone"
                type="tel"
                required
                class="form-input"
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">نوع العضوية</label>
              <select
                v-model="newMember.membershipType"
                required
                class="form-select"
              >
                <option value="">اختر نوع العضوية</option>
                <option value="student">طالب</option>
                <option value="faculty">أكاديمي</option>
                <option value="public">عام</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">العنوان</label>
              <textarea
                v-model="newMember.address"
                rows="3"
                class="form-textarea"
                placeholder="أدخل العنوان"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="showAddMemberModal = false"
              class="btn-secondary"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="btn-primary"
            >
              إضافة العضو
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserPlusIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// Reactive data
const searchQuery = ref('')
const selectedMembershipType = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddMemberModal = ref(false)

const newMember = ref({
  name: '',
  email: '',
  phone: '',
  membershipType: '',
  address: '',
})

// Mock members data
const members = ref([
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

// Computed properties
const totalMembers = computed(() => members.value.length)
const activeMembers = computed(() => members.value.filter(m => m.status === 'active').length)
const expiredMemberships = computed(() => members.value.filter(m => m.status === 'expired').length)

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = !searchQuery.value || 
      member.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedMembershipType.value || member.membershipType === selectedMembershipType.value
    const matchesStatus = !selectedStatus.value || member.status === selectedStatus.value
    
    return matchesSearch && matchesType && matchesStatus
  })
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMembers.value.slice(start, end)
})

// Methods
const getMembershipTypeText = (type: string) => {
  switch (type) {
    case 'student': return 'طالب'
    case 'faculty': return 'أكاديمي'
    case 'public': return 'عام'
    default: return type
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'badge-success'
    case 'expired': return 'badge-danger'
    case 'suspended': return 'badge-warning'
    default: return 'badge-secondary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'نشط'
    case 'expired': return 'منتهي'
    case 'suspended': return 'معلق'
    default: return status
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const addMember = () => {
  const member = {
    id: members.value.length + 1,
    memberId: `LIB${String(members.value.length + 1).padStart(3, '0')}`,
    ...newMember.value,
    status: 'active',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    booksBorrowed: 0,
    borrowLimit: newMember.value.membershipType === 'faculty' ? 10 : newMember.value.membershipType === 'student' ? 5 : 3,
  }
  
  members.value.push(member)
  
  // Reset form
  newMember.value = {
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    address: '',
  }
  
  showAddMemberModal.value = false
}

const viewMember = (member: any) => {
  console.log('View member:', member)
}

const editMember = (member: any) => {
  console.log('Edit member:', member)
}

const renewMembership = (member: any) => {
  console.log('Renew membership:', member)
}
</script>