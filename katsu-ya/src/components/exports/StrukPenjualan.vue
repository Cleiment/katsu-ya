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
import { formatMoney, timestampToDatetime } from '@/tools'
import { useAuthStore } from '@/stores/AuthStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()
const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const menuStore = useMenuStore()

const { getAll, createTransaction } = transactionStore

const isPlaceOrderOpen = ref(false)
const submitCreateTransaction = async () => {
    appStore.isLoading = true
    if (transactionStore.newTransaction.transactionCartDetail.length > 0) {
        if (await createTransaction()) {
            await getAll()
        }
    } else {
        appStore.addNotification('error', 'Insert more menu to order before placing order!')
    }
    appStore.isLoading = false
}

const refresh = async () => {
    appStore.isLoading = true
    await getAll()
    appStore.isLoading = false
}

const total = () => {
    let total = 0
    transactionStore.selectedStrukTransaction.detail.forEach((item) => {
        total += item.menu.price * item.menuQty
    })
    return total
}

onMounted(async () => {
    await transactionStore.getTransaction(parseInt(route.params.id.toString()))
    await refresh()
})

appStore.isLoading = false
</script>

<template>
    <div class="w-96 p-5 h-[80%] m-auto">
        <div
            class="flex flex-col bg-white w-full h-fit px-4 py-5"
            v-if="transactionStore.selectedStrukTransaction"
        >
            <div class="flex mb-4 items-center gap-2">
                <img
                    class="border-black border rounded-full h-[3rem] w-auto"
                    src="/src/logo.jpg"
                    alt="Katsu-Ya"
                />
                <p class="font-semibold">Katsu-Ya</p>
            </div>
            <div class="pb-2 mb-2 border-b border-gray-400">
                <p class="text-sm">
                    No Transaction : {{ transactionStore.selectedStrukTransaction.id }}
                </p>
                <p class="text-sm">
                    Cashier Name :
                    {{ transactionStore.selectedStrukTransaction.cashier.username }}
                </p>
                <p class="text-sm">
                    Date :
                    {{ timestampToDatetime(transactionStore.selectedStrukTransaction.updatedAt) }}
                </p>
            </div>
            <div>
                <div
                    class="py-1 flex justify-between items-start border-b border-gray-200 mb-1"
                    v-for="(item, i) in transactionStore.selectedStrukTransaction.detail"
                    :key="i"
                >
                    <p class="text-sm">{{ item.menu.name }} x{{ item.menuQty }}</p>
                    <div class="flex flex-col items-end">
                        <p class="text-sm">{{ formatMoney(item.menu.price) }}</p>
                        <p class="text-sm">
                            x{{ item.menuQty }} = {{ formatMoney(item.menu.price * item.menuQty) }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <p class="text-sm py-1">Total</p>
                <p class="text-sm py-1">
                    {{ formatMoney(transactionStore.selectedStrukTransaction.total) }}
                </p>
            </div>
            <div class="flex justify-between">
                <p class="text-sm py-1">Paid</p>
                <p class="text-sm py-1">
                    {{ formatMoney(transactionStore.selectedStrukTransaction.paid) }}
                </p>
            </div>
            <div class="flex justify-between">
                <p class="text-sm py-1">Return</p>
                <p class="text-sm py-1">
                    {{
                        formatMoney(
                            transactionStore.selectedStrukTransaction.paid -
                                transactionStore.selectedStrukTransaction.total
                        )
                    }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
