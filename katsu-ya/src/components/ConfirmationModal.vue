<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emits('cancel')" class="relative z-50">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform rounded-2xl bg-white p-6 text-left text-sm align-middle shadow-xl transition-all"
                        >
                            <DialogTitle
                                as="h3"
                                class="text-lg font-semibold leading-6 text-gray-900 mb-5"
                            >
                                {{ title }}
                            </DialogTitle>

                            <p>{{ text }}</p>

                            <div class="mt-4 flex justify-end gap-x-2">
                                <button
                                    @click="emits('cancel')"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                >
                                    {{ cancelText }}
                                </button>

                                <button
                                    @click="emits('ok')"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    {{ okText }}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

defineProps({
    show: { type: Boolean, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    okText: { type: String, default: 'OK' },
    cancelText: { type: String, default: 'Cancel' }
})

const emits = defineEmits(['cancel', 'ok'])
</script>

<style scoped></style>
