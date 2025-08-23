<template>
  <div class="max-w-3xl mx-auto p-6 space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">نموذج الإدخال المخصص</h1>
      <p class="text-gray-600">مكون FormInput قابل لإعادة الاستخدام مع خيارات متعددة</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Basic Input -->
      <FormInput
        v-model="formData.name"
        name="name"
        label="الاسم الكامل"
        placeholder="أدخل الاسم الكامل"
        required
      />

      <!-- Email with Leading Icon -->
      <FormInput
        v-model="formData.email"
        name="email"
        type="email"
        label="البريد الإلكتروني"
        placeholder="example@example.com"
        :leading-icon="EnvelopeIcon"
        required
      />

      <!-- Password with Toggle -->
      <FormInput
        v-model="formData.password"
        name="password"
        :type="showPassword ? 'text' : 'password'"
        label="كلمة المرور"
        placeholder="أدخل كلمة المرور"
        :trailing-icon="showPassword ? EyeSlashIcon : EyeIcon"
        @trailing-icon-click="togglePassword"
        required
      />

      <!-- With Helper Text -->
      <FormInput
        v-model="formData.phone"
        name="phone"
        type="tel"
        label="رقم الهاتف"
        placeholder="05XXXXXXXX"
        helper-text="أدخل رقم الهاتف مع رمز الدولة"
      />

      <!-- With Error State -->
      <FormInput
        v-model="formData.username"
        name="username"
        label="اسم المستخدم"
        placeholder="اختر اسم مستخدم"
        :error="usernameError"
        @blur="validateUsername"
        clearable
      />

      <!-- Disabled State -->
      <FormInput
        v-model="formData.reference"
        name="reference"
        label="الرقم المرجعي"
        value="REF-123456"
        disabled
      />

      <!-- Small Size -->
      <FormInput
        v-model="formData.code"
        name="code"
        label="كود التفعيل"
        placeholder="أدخل الكود المكون من 6 أرقام"
        size="sm"
        class="w-32"
      />
    </div>

    <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">بيانات النموذج</h2>
      <pre class="bg-white dark:bg-gray-900 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  KeyIcon,
  HashtagIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline';
import FormInput from '../components/FormInput.vue';

const showPassword = ref(false);
const usernameError = ref('');

const formData = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  username: '',
  reference: 'REF-123456',
  code: ''
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validateUsername = () => {
  if (formData.username && formData.username.length < 3) {
    usernameError.value = 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
  } else {
    usernameError.value = '';
  }
};
</script>
