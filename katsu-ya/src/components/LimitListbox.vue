<template>
    <Listbox
        :modelValue="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
        class="w-24"
    >
        <div class="relative mt-1">
            <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-white border py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-200/80 sm:text-sm"
            >
                <span class="block truncate">{{ modelValue }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
            </ListboxButton>

            <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                >
                    <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="(limitOption, key) in TableLimits"
                        :key="key"
                        :value="limitOption"
                        as="template"
                    >
                        <li
                            :class="[
                                selected
                                    ? 'bg-rose-200 text-red-900'
                                    : active
                                      ? 'bg-rose-200 text-red-900'
                                      : 'text-gray-900',
                                'relative cursor-default select-none py-2 pl-10 pr-4 transition'
                            ]"
                        >
                            <span
                                :class="[
                                    selected ? 'font-medium' : 'font-normal',
                                    'block truncate'
                                ]"
                                >{{ limitOption }}</span
                            >
                            <span
                                v-if="selected"
                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                            >
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>

<script setup lang="ts">
import { TableLimits } from '@/tools/types'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

defineProps<{ modelValue: Number }>()
</script>

<style scoped></style>
