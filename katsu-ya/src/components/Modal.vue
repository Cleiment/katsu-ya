<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emits('cancel')" class="relative z-30">
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/15" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-start justify-center p-4 text-center">
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
                            :class="[
                                `max-w-${size}`,
                                'w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'
                            ]"
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-semibold leading-6 text-gray-900 mb-5 flex justify-between"
                                >
                                    {{ title }}
                                </DialogTitle>

                                <XMarkIcon
                                    class="h-5 w-5 cursor-pointer"
                                    @click="emits('cancel')"
                                />
                            </div>

                            <div class="overflow-hidden">
                                <slot name="body"></slot>
                            </div>

                            <div class="mt-4 flex justify-end gap-x-2">
                                <button
                                    @click="emits('cancel')"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                >
                                    Close
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
import { XMarkIcon } from '@heroicons/vue/24/solid'

defineProps({
    title: { type: String, required: true },
    show: { type: Boolean, required: true },
    size: { type: String, required: true }
})

const emits = defineEmits(['cancel'])
</script>

<style scoped></style>
