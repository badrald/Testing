<template>
  <LoginLayout :loading="session.login.loading" :error-message="errorMessage" @login="handleLogin"
    @social-login="handleSocialLogin" @forgot-password="handleForgotPassword" @go-to-register="handleGoToRegister" />
</template>

<script>
import LoginLayout from '@/layouts/LoginLayout.vue'
import { session } from '@/data/session'
import { ref } from 'vue'

export default {
  name: 'LoginPage',
  components: {
    LoginLayout
  },
  setup() {
    const errorMessage = ref('')

    const handleLogin = (loginData) => {
      errorMessage.value = ''

      session.login.submit({
        email: loginData.email,
        password: loginData.password
      }).catch(error => {
        errorMessage.value = 'خطأ في تسجيل الدخول. يرجى التحقق من البيانات المدخلة.'
      })
    }

    return {
      session,
      errorMessage,
      handleLogin,
    }
  }
}
</script>