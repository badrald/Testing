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
              <option value="Normal">Normal</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="form-select">
              <option value="">جميع الحالات</option>
              <option value="1">نشط</option>
              <option value="0">منتهي</option>
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
              <th class="text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr
              v-for="member in paginatedMembers"
              :key="member.name"
              class="table-row"
            >
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span class="text-sm font-medium text-white">
                        {{ member.memeber_name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-secondary-900">
                      {{ member.memeber_name }}
                    </div>
                    <div class="text-sm text-secondary-500">
                      رقم العضوية: {{ member.member_id }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-secondary-900">{{ member.email }}</div>
                <div class="text-sm text-secondary-500">{{ member.phone_number }}</div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-secondary-900">{{ member.member_type }}</div>
                <div class="text-sm text-secondary-500">
                  انضم: {{ formatDate(member.join_date) }}
                </div>
              </td>
              <td class="table-cell">
                <span
                  class="badge"
                  :class="getStatusBadgeClass(member.is_membership_valid)"
                >
                  {{ getStatusText(member.is_membership_valid) }}
                </span>
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
                <option value="Normal">Normal</option>
                <option value="VIP">VIP</option>
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
import { ref, computed, onMounted } from 'vue'
import { useMembersStore } from '../stores/members'
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

const membersStore = useMembersStore()

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

onMounted(() => {
  membersStore.fetchMembers()
})

// Computed properties
const totalMembers = computed(() => membersStore.totalMembers)
const activeMembers = computed(() => membersStore.activeMembers)
const expiredMemberships = computed(() => membersStore.expiredMemberships)

const filteredMembers = computed(() => {
  return membersStore.members.filter(member => {
    const matchesSearch = !searchQuery.value || 
      member.memeber_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedMembershipType.value || member.member_type === selectedMembershipType.value
    const matchesStatus = !selectedStatus.value || member.is_membership_valid === parseInt(selectedStatus.value)
    
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
    case 'Normal': return 'عادي'
    case 'VIP': return 'مميز'
    default: return type
  }
}

const getStatusBadgeClass = (status: number) => {
  switch (status) {
    case 1: return 'badge-success'
    case 0: return 'badge-danger'
    default: return 'badge-secondary'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 1: return 'نشط'
    case 0: return 'منتهي'
    default: return 'غير محدد'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const addMember = () => {
  // To be implemented
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