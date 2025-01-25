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

import { modalSize, type Transaction, type TransactionCart } from '@/tools/types'
// import TransactionForm from '@/components/forms/TransactionForm.vue'
import FormModal from '@/components/FormModal.vue'
import Modal from '@/components/Modal.vue'
import { CheckIcon, PrinterIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const router = useRouter()

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const { getAll, createTransaction } = transactionStore

const refresh = async () => {
    appStore.isLoading = true
    await getAll()
    appStore.isLoading = false
}

const isFinishFormOpen = ref(false)

function closeFinishFormModal() {
    isFinishFormOpen.value = false
}

function openFinishFormModal() {
    isFinishFormOpen.value = true
}
const selectedFinish = ref<TransactionCart>()

const showFinish = (item: TransactionCart) => {
    selectedFinish.value = item
    openFinishFormModal()
    // router.push(`/struk/${id}`)
}

const finishOrder = async () => {
    if (
        selectedFinish.value &&
        selectedFinish.value.paid &&
        selectedFinish.value.paid < selectedFinish.value!.total
    )
        return appStore.addNotification('error', 'Paid nominal needs to be higher')

    appStore.isLoading = true
    const id = await transactionStore.finishTransaction(selectedFinish.value!)
    router.push('/struk/' + id)
    appStore.isLoading = false
}

onMounted(async () => {
    await refresh()
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">Transaction</h2>
            <BreadCrumbs />
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <template v-if="transactionStore.data.length > 0">
            <div
                v-for="(item, i) in transactionStore.data"
                :key="i"
                class="shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4"
            >
                <div>
                    <p class="font-semibold">{{ item.tableName }}</p>
                    <table class="table w-full font-normal table-auto relative">
                        <thead class="sticky top-0 shadow bg-white rounded">
                            <tr>
                                <th class="font-semibold" width="20%">Order Number</th>
                                <th class="font-semibold" width="20%">Finish</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr
                                v-for="(v, i) in item.TransactionCart"
                                :key="i"
                                class="border-b hover:bg-rose-400/20"
                            >
                                <td class="px-3 py-4">{{ item.id }}</td>
                                <td>
                                    <button
                                        class="rounded-full p-1 bg-blue-500 text-white"
                                        @click="showFinish(v)"
                                    >
                                        <CheckIcon class="w-6 h-6" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>

    <FormModal
        title="Finish Order"
        :show="isFinishFormOpen"
        @cancel="closeFinishFormModal"
        :size="modalSize.xs"
    >
        <template v-slot:body>
            <div v-if="selectedFinish">
                <form action="" @submit.prevent="finishOrder">
                    <div class="flex flex-col space-y-2 h-fit">
                        <div class="flex flex-col space-y-2">
                            <div>
                                <label
                                    for="total"
                                    class="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Total
                                </label>
                                <div
                                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                                >
                                    <input
                                        type="number"
                                        pattern="\d"
                                        step="1"
                                        id="total"
                                        min="0"
                                        autocomplete="off"
                                        class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-300"
                                        placeholder="Total"
                                        disabled
                                        :value="selectedFinish.total"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    for="paid"
                                    class="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Paid
                                </label>
                                <div
                                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                                >
                                    <input
                                        type="number"
                                        pattern="\d"
                                        step="100"
                                        id="paid"
                                        min="100"
                                        required
                                        autocomplete="off"
                                        class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                        placeholder="Paid"
                                        v-model="selectedFinish.paid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end items-center">
                        <div class="flex space-x-2 items-center">
                            <button
                                type="submit"
                                class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </template>
    </FormModal>
</template>
