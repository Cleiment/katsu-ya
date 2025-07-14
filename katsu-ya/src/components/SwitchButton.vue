<template>
    <div>
        <p class="mb-1 text-sm">{{ title }}</p>
        <Switch
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            class="flex items-center h-8 w-16 cursor-pointer rounded-full p-1 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            :class="modelValue ? 'bg-emerald-600' : 'bg-gray-400'"
        >
            <span
                aria-hidden="true"
                class="h-6 w-6 rounded-full bg-white shadow-lg ring-0 transform transition duration-200 ease-out"
                :class="modelValue ? 'translate-x-8' : ''"
            />
        </Switch>
    </div>
</template>

<script setup lang="ts">
import { Switch } from '@headlessui/vue'

defineProps({
    title: {
        required: true,
        type: String
    },
    modelValue: {
        required: true,
        type: Boolean
    }
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>
