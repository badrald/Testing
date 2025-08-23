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

    <!-- Members Table -->
    <FancyDataTable :columns="columns" :data="filteredMembers" :page-size="12" :sortable="true">
      <template #actions="{ row }">
        <div class="flex space-x-2">
          <Button @click="editMember(row)" size="sm" theme="gray">Edit</Button>
          <Button @click="deleteMember(row)" size="sm" theme="red" class="ml-2">Delete</Button>
        </div>
      </template>
    </FancyDataTable>

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
import { Button, Card, Dialog, Input, FeatherIcon } from 'frappe-ui'
import FancyDataTable from '../components/FancyDataTable.vue'
import { membersResource, addMember as addMemberApi, updateMember as updateMemberApi, deleteMember as deleteMemberApi } from '../data/members'

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
  { key: 'memeber_name', label: 'الاسم', sortable: true },
  { key: 'email', label: 'البريد', sortable: true },
  { key: 'phone_number', label: 'الهاتف', sortable: false },
  { key: 'member_type', label: 'النوع', sortable: false },
  { key: 'is_membership_valid', label: 'ساري', sortable: false },
])


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

const addMember = async () => {
  const response = await addMemberApi(newMember.value)
  if (response.success) {
    showAddMemberModal.value = false
    newMember.value = {
      memeber_name: '',
      email: '',
      phone_number: '',
      member_type: 'Normal',
    }
  }
}

const editMember = (member) => {
  // Implementation for editing a member
  console.log("editMember", member)
  // You can add edit functionality here
}

const deleteMember = async (member) => {
  if (confirm(`Are you sure you want to delete ${member.memeber_name}?`)) {
    const response = await deleteMemberApi(member.name)
    if (response.success) {
      // Member deleted successfully
    }
  }
}
</script>