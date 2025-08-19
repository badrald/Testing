<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">إدارة الأعضاء</h1>
        <p class="mt-2 text-gray-600">إدارة أعضاء المكتبة والعضويات</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button @click="showAddMemberModal = true">
          <FeatherIcon name="user-plus" class="w-4 h-4 mr-2" />
          إضافة عضو جديد
        </Button>
      </div>
    </div>

    <!-- Filters and Search -->
    <Card>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <Input v-model="searchQuery" placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم العضوية..." />
          </div>

          <!-- Membership Type Filter -->
          <div>
            <select v-model="selectedMembershipType" class="w-full form-select">
              <option value="">جميع الأنواع</option>
              <option value="Normal">Normal</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <select v-model="selectedStatus" class="w-full form-select">
              <option value="">جميع الحالات</option>
              <option value="1">نشط</option>
              <option value="0">منتهي</option>
            </select>
          </div>
        </div>
      </div>
    </Card>

    <!-- Members Table -->
    <DataTable :columns="columns" :data="filteredMembers">
      <template #cell-actions="{ row }">
        <Button @click="editMember(row)" size="sm" theme="gray">Edit</Button>
        <Button @click="deleteMember(row)" size="sm" theme="red" class="ml-2">Delete</Button>
      </template>
    </DataTable>

    <Dialog v-model="showAddMemberModal" title="Add Member">
      <form @submit.prevent="addMember">
        <div class="space-y-4">
          <Input v-model="newMember.memeber_name" label="Name" />
          <Input v-model="newMember.email" label="Email" />
          <Input v-model="newMember.phone_number" label="Phone" />
          <Input v-model="newMember.member_type" label="Type" />
        </div>
        <div class="mt-6 flex justify-end">
          <Button @click="showAddMemberModal = false" theme="gray" class="mr-2">Cancel</Button>
          <Button type="submit" theme="primary">Save</Button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createResource, Button, Card, DataTable, Dialog, Input, FeatherIcon } from 'frappe-ui'

const showAddMemberModal = ref(false)
const searchQuery = ref('')
const selectedMembershipType = ref('')
const selectedStatus = ref('')

const newMember = ref({
  memeber_name: '',
  email: '',
  phone_number: '',
  member_type: 'Normal',
})

const columns = ref([
  { key: 'memeber_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'member_type', label: 'Type' },
  { key: 'is_membership_valid', label: 'Valid Membership' },
  { key: 'actions', label: 'Actions' },
])

const membersResource = createResource({
  url: "lms.lms.doctype.member.member.get_members",
  auto: true,
})

const filteredMembers = computed(() => {
  if (!membersResource.data) return []
  return membersResource.data.filter(member => {
    const matchesSearch = !searchQuery.value || 
      member.memeber_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !selectedMembershipType.value || member.member_type === selectedMembershipType.value
    const matchesStatus = !selectedStatus.value || member.is_membership_valid === parseInt(selectedStatus.value)
    
    return matchesSearch && matchesType && matchesStatus
  })
})

const addMember = () => {
  // To be implemented
  console.log("addMember", newMember.value)
}

const editMember = (member) => {
  // To be implemented
  console.log("editMember", member)
}

const deleteMember = (member) => {
  // To be implemented
  console.log("deleteMember", member)
}
</script>