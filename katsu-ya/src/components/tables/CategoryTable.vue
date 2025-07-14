<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { timestampToDatetime } from '@/tools'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const categoryStore = useCategoryStore()

const emit = defineEmits(['showDetail'])

const showDetail = (id: number) => {
    const category = categoryStore.data.filter((item) => item.id == id)

    if (category) {
        categoryStore.selectedCategory = category[0]
        emit('showDetail')
    } else {
        appStore.addNotification('error', 'Category not found')
    }
}
</script>
<template>
    <table class="table w-full font-normal table-auto relative">
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold text-center px-3 py-2" width="5%">No</th>
                <th class="font-semibold" width="20%">Name</th>
                <th class="font-semibold" width="15%">Created At</th>
                <th class="font-semibold" width="15%">Updated At</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(category, i) in categoryStore.data"
                :key="category.id"
                class="border-b"
                :class="
                    category.status == 0
                        ? 'bg-red-500/80 text-white hover:bg-red-500'
                        : 'hover:bg-rose-400/20'
                "
            >
                <td class="px-3 py-4 text-center">{{ i + 1 }}</td>
                <td>
                    {{ category.name }}
                </td>
                <td>
                    {{ timestampToDatetime(category.createdAt) }}
                </td>
                <td>{{ timestampToDatetime(category.updatedAt) }}</td>
                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showDetail(category.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
            </tr>

            <tr v-if="categoryStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>
