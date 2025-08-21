<template>
    <transition name="modal">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4"
            @click.self="onBackdropClick">
            <!-- خلفية ضبابية رسمية -->
            <div
                class="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/50 to-black/60 backdrop-blur-md">
            </div>

            <!-- المودال الرئيسي -->
            <div
                class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-slate-200 modal-container">
                <!-- شريط علوي رسمي -->
                <div
                    class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800">
                </div>

                <!-- زر الإغلاق -->
                <button v-if="closable" @click="closeDialog"
                    class="absolute top-5 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-200 flex items-center justify-center group z-10 shadow-md border border-slate-300">
                    <svg class="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" fill="none"
                        stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- الجزء العلوي -->
                <div
                    class="relative bg-gradient-to-br from-slate-50 to-blue-50/30 px-8 pt-8 pb-6 border-b border-slate-200">
                    <!-- الأيقونة والعنوان -->
                    <div class="flex items-center mb-6">

                        <div class="flex-1">
                            <div class="w-16 h-0.5 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full"></div>
                            <h2 class="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                                <slot name="title">{{ title }}</slot>
                            </h2>
                        </div>
                        <div class="relative">
                            <div
                                class="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center shadow-xl mr-4 border border-slate-300">
                                <slot name="icon">
                                    <svg class="w-8 h-8 text-black" fill="none" stroke="currentColor" stroke-width="1.5"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <!-- أيقونة مجلد رسمية -->
                                </slot>
                            </div>
                         
                        </div>

                    </div>
                </div>

                <!-- محتوى الرسالة -->
                <div class="px-8 py-6 bg-white">
                    <div class="text-slate-700 text-base leading-relaxed font-medium">
                        <slot />
                    </div>
                </div>

                <!-- منطقة الأزرار -->
                <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50/20 border-t border-slate-200">
                    <div class="flex justify-end space-x-3">
                        <slot name="actions">
                            <button v-if="closable" @click="closeDialog"
                                class="px-6 py-3 rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900 transition-all duration-200 font-medium shadow-lg border border-slate-600">
                                إغلاق
                            </button>
                        </slot>
                    </div>
                </div>

                <!-- خط جانبي رسمي -->
                <div
                    class="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-24 bg-gradient-to-b from-slate-600 via-blue-600 to-slate-800 rounded-r-md">
                </div>

                <!-- زخرفة زاوية -->
                <div class="absolute bottom-0 right-0 w-20 h-20 opacity-5">
                    <div class="w-full h-full bg-gradient-to-tl from-slate-800 to-transparent rounded-tl-full"></div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: "حوار النظام" },
    persistent: { type: Boolean, default: false },
    closable: { type: Boolean, default: true }
})

const emit = defineEmits(["update:modelValue"])

const closeDialog = () => {
    emit("update:modelValue", false)
}

const onBackdropClick = () => {
    if (!props.persistent) {
        closeDialog()
    }
}
</script>

<style scoped>
/* تأثيرات الانتقال الرسمية */
.modal-enter-active {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modal-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.6, 1);
}

.modal-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}

/* تأثير ظهور المودال */
.modal-container {
    animation: modalFadeIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes modalFadeIn {
    0% {
        transform: scale(0.9) translateY(-20px);
        opacity: 0;
    }

    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

/* تأثيرات تفاعلية رسمية */
.modal-container:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}

/* إطار رسمي خفيف */
.modal-container::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg,
            rgba(71, 85, 105, 0.1),
            rgba(37, 99, 235, 0.1),
            rgba(30, 41, 59, 0.1));
    border-radius: 1rem;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-container:hover::before {
    opacity: 1;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 640px) {
    .modal-container {
        margin: 1rem;
        max-width: calc(100% - 2rem);
    }
}

/* تأثير التركيز الرسمي */
button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

/* ظلال رسمية متدرجة */
.modal-container {
    box-shadow:
        0 20px 40px -8px rgba(15, 23, 42, 0.25),
        0 8px 16px -4px rgba(37, 99, 235, 0.1),
        0 0 0 1px rgba(148, 163, 184, 0.1);
}

/* تأثيرات الأزرار */
button {
    position: relative;
    overflow: hidden;
}

button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
}

button:hover::before {
    left: 100%;
}

/* خطوط فاصلة رسمية */
.border-slate-200 {
    border-color: rgb(226 232 240 / 0.8);
}

/* تأثير النص */
h2 {
    text-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
}

/* تدرج الخلفية للنصوص */
.text-slate-700 {
    background: linear-gradient(135deg, #374151, #4b5563);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>