<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useIngredientTransactionStore } from '@/stores/IngredientTransactionStore'
import { timestampToDatetime } from '@/tools'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const ingredientTransactionStore = useIngredientTransactionStore()

const emit = defineEmits(['showDetail'])

const showDetail = (id: number) => {
    const ingredientTransaction = ingredientTransactionStore.data.filter((item) => item.id == id)

    if (ingredientTransaction) {
        ingredientTransactionStore.selectedIngredientTransaction = ingredientTransaction[0]
        emit('showDetail')
    } else {
        appStore.addNotification('error', 'Ingredient Unit not found')
    }
}
</script>
<template>
    <table class="table w-full font-normal table-auto relative">
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold text-center px-3 py-2" width="5%">No</th>
                <th class="font-semibold" width="20%">Ingredient</th>
                <th class="font-semibold" width="20%">Qty</th>
                <th class="font-semibold" width="15%">User</th>
                <th class="font-semibold" width="15%">Created At</th>
                <th class="font-semibold" width="15%">Updated At</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(ingredientTransaction, i) in ingredientTransactionStore.data"
                :key="ingredientTransaction.id"
                class="hover:bg-rose-400/20 border-b"
            >
                <td class="px-3 py-4 text-center">{{ i + 1 }}</td>
                <td>
                    {{ ingredientTransaction.ingredient!.name }}
                </td>
                <td
                    class="font-bold"
                    :class="
                        ingredientTransaction.isUsage == 0 ? 'text-emerald-500' : 'text-red-500'
                    "
                >
                    {{ ingredientTransaction.qty }}
                </td>
                <td>{{ ingredientTransaction.user!.username }}</td>
                <td>
                    {{ timestampToDatetime(ingredientTransaction.createdAt) }}
                </td>
                <td>{{ timestampToDatetime(ingredientTransaction.updatedAt) }}</td>
                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showDetail(ingredientTransaction.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
            </tr>

            <tr v-if="ingredientTransactionStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>
