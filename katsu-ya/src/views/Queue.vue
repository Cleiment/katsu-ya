<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { useTransactionStore } from '@/stores/TransactionStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import { socket, timestampToDatetime } from '@/tools'

const appStore = useAppStore()
const transactionStore = useTransactionStore()

const { getOrders } = transactionStore

const refresh = async () => {
    appStore.isLoading = true
    await getOrders()
    appStore.isLoading = false
}

onMounted(async () => {
    await refresh()
})

socket.on('refreshOrder', async (msg) => {
    refresh()
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-center mb-3">
        <div>
            <h2 class="font-bold mb-1">Queue</h2>
            <BreadCrumbs />
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <template v-if="transactionStore.dataOrder.length > 0">
            <div
                v-for="(item, i) in transactionStore.dataOrder"
                :key="i"
                class="shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4"
            >
                <div>
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <p class="font-semibold">{{ item.table!.tableName }}</p>
                            <p class="text-sm mb-2">{{ timestampToDatetime(item.createdAt) }}</p>
                        </div>
                    </div>
                    <table class="table w-full font-normal table-auto relative">
                        <thead class="sticky top-0 shadow bg-white rounded">
                            <tr>
                                <th class="font-semibold" width="20%">Name</th>
                                <th class="font-semibold" width="20%">Qty</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr
                                v-for="(v, i) in item.transactionCartDetail"
                                :key="i"
                                class="border-b hover:bg-rose-400/20"
                            >
                                <td>
                                    {{ v.menu.name }}
                                </td>
                                <td class="px-3 py-4">
                                    {{ v.menuQty }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex justify-center col-span-full text-gray-500">No Ongoing Order</div>
        </template>
    </div>
</template>
