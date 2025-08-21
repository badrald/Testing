<template>
    <div class="min-h-screen gradient-bg">
        <!-- خلفية متحركة -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full floating-animation"></div>
            <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full floating-animation"
                style="animation-delay: -3s;"></div>
            <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full floating-animation"
                style="animation-delay: -1s;"></div>
        </div>

        <div class="min-h-screen flex items-center justify-center p-4 relative z-10">
            <div class="w-full max-w-4xl">
                <!-- بطاقة تسجيل الدخول -->
                <div class="glass-effect rounded-3xl card-shadow overflow-hidden">
                    <div class="flex flex-col lg:flex-row">
                        <!-- القسم الأيسر - الصورة والترحيب -->
                        <div
                            class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                            <div class="absolute inset-0 bg-black opacity-20"></div>
                            <div class="relative z-10 text-center">
                                <div class="mb-8">
                                    <div
                                        class="w-32 h-32 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center floating-animation">
                                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <h1 class="text-4xl font-bold mb-4">مرحباً بك</h1>
                                <p class="text-xl opacity-90 mb-6">في نظام إدارة المكتبة الذكي</p>
                                <div class="flex justify-center space-x-2 space-x-reverse">
                                    <div class="w-2 h-2 bg-white rounded-full pulse-animation"></div>
                                    <div class="w-2 h-2 bg-white rounded-full pulse-animation"
                                        style="animation-delay: 0.2s;"></div>
                                    <div class="w-2 h-2 bg-white rounded-full pulse-animation"
                                        style="animation-delay: 0.4s;"></div>
                                </div>
                            </div>
                        </div>

                        <!-- القسم الأيمن - نموذج تسجيل الدخول -->
                        <div class="w-full lg:w-1/2 p-8 lg:p-12">
                            <div class="max-w-md mx-auto">
                                <!-- العنوان -->
                                <div class="text-center mb-8">
                                    <h2 class="text-3xl lg:text-4xl font-bold text-white mb-3">تسجيل الدخول</h2>
                                    <p class="text-white ">أدخل بياناتك للوصول إلى حسابك</p>
                                </div>

                                <!-- النموذج -->
                                <form class="space-y-6" @submit.prevent="submit">
                                    <!-- حقل اسم المستخدم -->
                                    <div class="relative">
                                        <label class="block text-sm font-semibold text-white  mb-2">اسم المستخدم أو
                                            البريد الإلكتروني</label>
                                        <div class="relative">
                                            <input v-model="formData.email" name="email" type="text"
                                                placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                                                class="w-full px-4 py-4 pr-12 border-2 text-black  rounded-xl focus:border-indigo-500 focus:outline-none input-focus bg-white"
                                                required>
                                            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 ">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                                                    </path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- حقل كلمة المرور -->
                                    <div class="relative">
                                        <label class="block text-sm font-semibold text-white  mb-2">كلمة
                                            المرور</label>
                                        <div class="relative">
                                            <input v-model="formData.password" name="password" type="password"
                                                placeholder="أدخل كلمة المرور"
                                                class="w-full px-4 py-4 pr-12 border-2 border-gray-200 text-black rounded-xl focus:border-indigo-500 focus:outline-none input-focus bg-white"
                                                required>
                                            <div
                                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white ">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                                                    </path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- خيارات إضافية -->
                                    <div class="flex items-center justify-between">
                                        <label class="flex items-center">
                                            <input v-model="rememberMe" type="checkbox"
                                                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                                            <span class="mr-2 text-sm text-white">تذكرني</span>
                                        </label>
                                        <a href="#"
                                            class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors text-white "
                                            @click.prevent="forgotPassword">
                                            نسيت كلمة المرور؟
                                        </a>
                                    </div>

                                    <!-- زر تسجيل الدخول -->
                                    <button type="submit" :disabled="loading"
                                        class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 btn-hover shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                        <span v-if="!loading">تسجيل الدخول</span>
                                        <div v-else class="flex items-center justify-center">
                                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            جاري تسجيل الدخول...
                                        </div>
                                    </button>
                                </form>

                                <!-- رسائل التحقق -->
                                <div v-if="errorMessage"
                                    class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    {{ errorMessage }}
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
    name: 'LoginLayout',
    emits: ['login', 'social-login', 'forgot-password', 'go-to-register'],
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        errorMessage: {
            type: String,
            default: ''
        }
    },
    setup(props, { emit }) {
        const formData = reactive({
            email: '',
            password: ''
        })

        const rememberMe = ref(false)

        const submit = () => {
            emit('login', {
                email: formData.email,
                password: formData.password,
                rememberMe: rememberMe.value
            })
        }

        const forgotPassword = () => {
            emit('forgot-password')
        }

        const goToRegister = () => {
            emit('go-to-register')
        }

        const loginWithGoogle = () => {
            emit('social-login', 'google')
        }

        const loginWithFacebook = () => {
            emit('social-login', 'facebook')
        }

        return {
            formData,
            rememberMe,
            submit,
            forgotPassword,
            goToRegister,
            loginWithGoogle,
            loginWithFacebook
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');

* {
    font-family: 'Cairo', sans-serif;
}

.gradient-bg {
    background: linear-gradient(135deg, #4791db 0%, #2a4856 100%);
}

.glass-effect {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.floating-animation {
    animation: floating 6s ease-in-out infinite;
}

@keyframes floating {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

.input-focus {
    transition: all 0.3s ease;
}

.input-focus:focus {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.25);
}

.btn-hover {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn-hover:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.btn-hover:hover:before {
    left: 100%;
}

.card-shadow {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.pulse-animation {
    animation: pulse 2s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>