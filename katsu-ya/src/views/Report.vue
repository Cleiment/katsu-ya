<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
// import {
//     CheckIcon,
//     ChevronUpDownIcon,
//     ChevronDownIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon
// } from '@heroicons/vue/20/solid'

import { useAppStore } from '@/stores/AppStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import { dateString, formatMoney } from '@/tools'
import { useTransactionStore } from '@/stores/TransactionStore'

const appStore = useAppStore()
const transactionStore = useTransactionStore()

const searchReport = async () => {
    appStore.isLoading = true
    await transactionStore.getTransactions()
    appStore.isLoading = false
}

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">Report</h2>
            <BreadCrumbs />
        </div>
        <div class="flex flex-col md:flex-row md:items-end gap-2">
            <div class="flex items-end gap-2">
                <div>
                    <label
                        for="date-start"
                        class="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Date Start
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden bg-white"
                    >
                        <input
                            type="date"
                            id="date-start"
                            autocomplete="off"
                            class="w-36 md:w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            placeholder="Start Date"
                            v-model="transactionStore.reportDateStart"
                        />
                    </div>
                </div>
                <div class="my-2">
                    <p>-</p>
                </div>
                <div>
                    <label for="date-end" class="block text-sm font-medium leading-6 text-gray-900">
                        Date End
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden bg-white"
                    >
                        <input
                            type="date"
                            id="date-end"
                            autocomplete="off"
                            class="w-36 md:w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            placeholder="End Date"
                            v-model="transactionStore.reportDateEnd"
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    @click="searchReport"
                    class="text-sm bg-blue-500 ring-1 shadow-sm px-3 py-2 rounded-lg text-white"
                >
                    Search
                </button>
            </div>
        </div>
    </div>
    <div
        class="lg:max-h-[88%] md:max-h-[83%] max-h-[81%] shadow-lg rounded-md w-full bg-white p-4"
        v-if="transactionStore.dataReport"
    >
        <div class="h-fit">
            <div class="flex justify-between pb-2 border-b mb-2 items-end">
                <div>
                    <p class="font-semibold mb-2">Transaction Report</p>
                    <p class="text-sm mb-1">
                        Date Start :
                        {{ dateString(new Date(transactionStore.dataReport.startDate)) }}
                    </p>
                    <p class="text-sm mb-1">
                        Date End : {{ dateString(new Date(transactionStore.dataReport.endDate)) }}
                    </p>
                </div>
                <div class="flex flex-col items-end">
                    <p class="font-semibold">Total</p>
                    <p>
                        {{
                            formatMoney(
                                transactionStore.dataReport.transactionSummary._sum.total || 0,
                                true
                            )
                        }}
                    </p>
                </div>
            </div>
            <div class="flex">
                <table class="table w-full font-normal table-auto relative">
                    <thead class="sticky top-0 bg-white rounded border-b">
                        <tr>
                            <th class="font-semibold" width="20%">Menu</th>
                            <th class="font-semibold" width="20%">Price</th>
                            <th class="font-semibold" width="20%">Sold</th>
                            <th class="font-semibold" width="20%">Total</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr
                            v-for="(v, i) in transactionStore.dataReport.menuSummary"
                            :key="i"
                            class="border-b hover:bg-rose-400/20"
                        >
                            <td class="py-1">
                                {{ v.name }}
                            </td>
                            <td>
                                {{ formatMoney(v.price) }}
                            </td>
                            <td>
                                {{ formatMoney(v.totalQty) }}
                            </td>
                            <td>
                                {{ formatMoney(v.price * v.totalQty) }}
                            </td>
                        </tr>
                        <tr v-if="transactionStore.dataReport.menuSummary.length < 1">
                            <td class="py-1 border-b hover:bg-rose-400/20" colspan="4">
                                <p class="text-gray-400 text-center">Data Not Found</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
