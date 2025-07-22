<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { useTransactionStore } from '@/stores/TransactionStore'

import { formatMoney, timestampToDatetime } from '@/tools'
import { useAuthStore } from '@/stores/AuthStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const transactionStore = useTransactionStore()

const refresh = async () => {
    appStore.isLoading = true
    appStore.isLoading = false
}

onMounted(async () => {
    await transactionStore.getReceipt(route.params.id.toString())
    await refresh()

    if (authStore.role?.role == 'GUEST') appStore.isUsingSidebar = false
})

appStore.isLoading = false
</script>

<template>
    <div class="max-w-96 p-5 h-dvh m-auto">
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
                    {{ transactionStore.selectedStrukTransaction.cashier?.username }}
                </p>
                <p class="text-sm">
                    Date :
                    {{ timestampToDatetime(transactionStore.selectedStrukTransaction.updatedAt) }}
                </p>
                <p class="text-sm">
                    Payment Type :
                    {{ transactionStore.selectedStrukTransaction.paymentType }}
                </p>
            </div>
            <div>
                <div
                    class="py-1 flex justify-between items-start border-b border-gray-200 mb-1"
                    v-for="(item, i) in transactionStore.selectedStrukTransaction.detail ||
                    transactionStore.selectedStrukTransaction.transactionCartDetail"
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
