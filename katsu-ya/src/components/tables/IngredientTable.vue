<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useIngredientStore } from '@/stores/IngredientStore'
import { timestampToDatetime } from '@/tools'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const ingredientStore = useIngredientStore()

const emit = defineEmits(['showDetail'])

const showDetail = (id: number) => {
    const ingredient = ingredientStore.data.filter((item) => item.id == id)

    if (ingredient) {
        if (ingredient[0].unit?.status == 0) ingredient[0].status = 0
        ingredientStore.selectedIngredient = ingredient[0]
        emit('showDetail')
    } else {
        appStore.addNotification('error', 'Ingredient not found')
    }
}
</script>
<template>
    <table class="table w-full font-normal table-auto relative min-w-[550px]">
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold text-center px-3 py-2" width="5%">No</th>
                <th class="font-semibold" width="35%">Name</th>
                <th class="font-semibold" width="10%">Qty</th>
                <th class="font-semibold" width="10%">Unit</th>
                <th class="font-semibold" width="20%">Created At</th>
                <th class="font-semibold" width="20%">Updated At</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(ingredient, i) in ingredientStore.data"
                :key="ingredient.id"
                class="border-b"
                :class="
                    ingredient.status == 0
                        ? 'bg-red-500/80 text-white hover:bg-red-500'
                        : 'hover:bg-rose-400/20'
                "
            >
                <td class="px-3 py-4 text-center">{{ i + 1 + ingredientStore.offset }}</td>
                <td class="px-3 py-4">{{ ingredient.name }}</td>
                <td class="px-3 py-4">{{ ingredient.qty }}</td>
                <td class="px-3 py-4">{{ ingredient.unit?.name }}</td>
                <td>
                    {{ timestampToDatetime(ingredient.createdAt) }}
                </td>
                <td>{{ timestampToDatetime(ingredient.updatedAt) }}</td>
                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showDetail(ingredient.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
            </tr>
            <tr v-if="ingredientStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>
