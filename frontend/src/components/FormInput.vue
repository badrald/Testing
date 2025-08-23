<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="id || name"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative rounded-md shadow-sm">
      <!-- Leading Icon -->
      <div v-if="leadingIcon" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <component :is="leadingIcon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <!-- Input Field -->
      <input
        :id="id || name"
        :name="name"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent',
          'transition duration-200 ease-in-out',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'placeholder-gray-400 dark:placeholder-gray-500',
          leadingIcon ? 'pr-10' : '',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600',
          size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-2',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
      
      <!-- Trailing Icon -->
      <div v-if="trailingIcon" class="absolute inset-y-0 left-0 flex items-center pl-3">
        <component :is="trailingIcon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="modelValue && clearable"
        type="button"
        class="absolute inset-y-0 left-0 flex items-center pl-3"
        @click="$emit('update:modelValue', '')"
      >
        <XMarkIcon class="h-4 w-4 text-gray-400 hover:text-gray-500" />
      </button>
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-500">
      {{ error }}
    </p>
    
    <!-- Helper Text -->
    <p v-if="helperText" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  // Basic props
  modelValue: {
    type: [String, Number],
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => 
      ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'].includes(value),
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  helperText: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['sm', 'base', 'lg'].includes(value),
  },
  leadingIcon: {
    type: Object,
    default: null,
  },
  trailingIcon: {
    type: Object,
    default: null,
  },
});

defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped>
/* Add any custom styles here */
</style>
