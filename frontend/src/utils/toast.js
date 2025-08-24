import { ref } from 'vue'

export const toasts = ref([])

export const removeToast = (id) => {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

export const addToast = (toast) => {
  const newToast = {
    id: Date.now(),
    ...toast,
  }
  toasts.value.push(newToast)

  // Auto remove after 5 seconds
  setTimeout(() => removeToast(newToast.id), 5000)
}
