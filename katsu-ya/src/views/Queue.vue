<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
// import {
//     CheckIcon,
//     ChevronUpDownIcon,
//     ChevronDownIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon
// } from '@heroicons/vue/20/solid'

import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { useTransactionStore } from '@/stores/TransactionStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import { modalSize } from '@/tools/types'
import FormModal from '@/components/FormModal.vue'
import Modal from '@/components/Modal.vue'
import { useMenuStore } from '@/stores/MenuStore'
import OrderForm from '@/components/forms/OrderForm.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { socket, timestampToDatetime } from '@/tools'
import { useAuthStore } from '@/stores/AuthStore'

const appStore = useAppStore()
const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const menuStore = useMenuStore()

const { getOrders } = transactionStore

const isPlaceOrderOpen = ref(false)

const refresh = async () => {
    appStore.isLoading = true
    await getOrders()
    appStore.isLoading = false
}

onMounted(async () => {
    await refresh()
})

socket.on('newOrder', (msg) => {
    appStore.addNotification('info', msg)
    refresh()
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
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
                        <button
                            v-if="authStore.role?.role == 'KITCHEN'"
                            class="px-4 py-2 bg-blue-500 rounded-lg text-white text-sm"
                            @click="isPlaceOrderOpen = true"
                        >
                            Finish Cook
                        </button>
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
    </div>
</template>
