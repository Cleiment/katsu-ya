<template>
    <div class="flex justify-between items-center notif" :class="props.status">
        <p class="text-sm">{{ props.message }}</p>
        <p class="text-sm">{{ props.statusCode }}</p>
        <XMarkIcon @click="appStore.removeNode(props.id)" class="w-6 h-6 cursor-pointer" />
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/AppStore'
import { XMarkIcon } from '@heroicons/vue/20/solid'

let props = defineProps({
    status: String,
    statusCode: String,
    message: String,
    id: Number
})

const appStore = useAppStore()
</script>

<style scoped></style>
