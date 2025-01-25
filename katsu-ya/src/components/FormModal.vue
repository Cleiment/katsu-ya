<template>
    <TransitionRoot appear :show="props.show" as="template">
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
                                `w-full max-w-${props.size} rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`
                            ]"
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-semibold leading-6 text-gray-900 mb-5 flex justify-between"
                                >
                                    {{ props.title }}
                                </DialogTitle>

                                <XMarkIcon
                                    class="h-5 w-5 cursor-pointer"
                                    @click="emits('cancel')"
                                />
                            </div>

                            <slot name="body"></slot>
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

const props = defineProps({
    title: { type: String, required: true },
    show: { type: Boolean, required: true },
    size: { type: String, required: true }
})

const emits = defineEmits(['cancel'])
</script>

<style scoped></style>
