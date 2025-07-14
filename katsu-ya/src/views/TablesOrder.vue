<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { useTransactionStore } from '@/stores/TransactionStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import { modalSize, type TransactionCart } from '@/tools/types'
import FormModal from '@/components/FormModal.vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { formatMoney, socket } from '@/tools'

const router = useRouter()

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const { getAll, fetchAvailableTable, setNewTransactionCartTable } = transactionStore

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
    if (item.paidStatus == 0) openFinishFormModal()
    else finishOrder()
    // router.push(`/struk/${id}`)
}

const finishOrder = async () => {
    if (
        selectedFinish.value &&
        selectedFinish.value.paid &&
        selectedFinish.value.paid < selectedFinish.value.total!
    )
        return appStore.addNotification('error', 'Paid nominal needs to be higher')

    appStore.isLoading = true
    const id = await transactionStore.finishTransaction(selectedFinish.value!)
    router.push('/struk/' + id)
    appStore.isLoading = false
}

const isNewOrderModalOpen = ref(false)
const openNewOrderModal = async () => {
    appStore.isLoading = true

    await fetchAvailableTable()
    isNewOrderModalOpen.value = true

    appStore.isLoading = false
}
const closeNewOrderModal = () => (isNewOrderModalOpen.value = false)

const createNewOrder = async () => {
    appStore.isLoading = true
    await setNewTransactionCartTable()
    appStore.isLoading = false

    router.push('/new-transaction')
}

onMounted(async () => {
    await refresh()
})

socket.on('refreshOrder', async () => {
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

        <div class="flex justify-end">
            <button
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
                @click="openNewOrderModal"
            >
                New Order
            </button>
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
                                <th class="font-semibold" width="20%">Payment Type</th>
                                <th class="font-semibold" width="20%">Paid Total</th>
                                <th class="font-semibold" width="10%">Finish</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr
                                v-for="(v, i) in item.TransactionCart"
                                :key="i"
                                class="border-b hover:bg-rose-400/20"
                            >
                                <td class="px-3 py-4">{{ i + 1 }}</td>
                                <td>{{ v.paidStatus == 0 ? '-' : v.paymentType }}</td>
                                <th>{{ formatMoney(v.paid!, true) }}</th>
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

    <FormModal
        title="Choose Table"
        :show="isNewOrderModalOpen"
        @cancel="closeNewOrderModal"
        :size="modalSize.xs"
        key="1"
    >
        <template v-slot:body>
            <form action="" @submit.prevent="createNewOrder">
                <div class="mb-2">
                    <label for="table" class="block text-sm font-medium leading-6 text-gray-900">
                        Choose Table Number
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
                    >
                        <Listbox
                            v-model="transactionStore.selectedTableForOrder"
                            class="flex w-full"
                            by="id"
                        >
                            <div class="relative">
                                <ListboxButton
                                    id="role"
                                    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                                >
                                    <span class="block truncate">{{
                                        (
                                            transactionStore.availableTable!.filter(
                                                (item) =>
                                                    item.id ==
                                                    transactionStore.selectedTableForOrder?.id
                                            )[0] || transactionStore.availableTable[0]
                                        ).tableName || 'Choose Table'
                                    }}</span>
                                    <span
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                                    >
                                        <ChevronUpDownIcon
                                            class="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </ListboxButton>

                                <transition
                                    leave-active-class="transition duration-100 ease-in"
                                    leave-from-class="opacity-100"
                                    leave-to-class="opacity-0"
                                >
                                    <ListboxOptions
                                        class="absolute w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                                    >
                                        <template v-if="transactionStore.availableTable.length > 0">
                                            <ListboxOption
                                                v-slot="{ active, selected }"
                                                v-for="table in transactionStore.availableTable"
                                                :key="table.id"
                                                :value="table"
                                                as="template"
                                            >
                                                <li
                                                    :class="[
                                                        selected
                                                            ? 'text-amber-800 bg-amber-100'
                                                            : active
                                                              ? 'text-amber-700 bg-amber-50'
                                                              : 'text-gray-900 bg-white',
                                                        'relative cursor-default select-none py-2 px-2 flex space-x-2'
                                                    ]"
                                                >
                                                    <span class="h-5 w-5">
                                                        <CheckIcon
                                                            class="h-full w-full"
                                                            v-show="selected"
                                                        />
                                                    </span>
                                                    <span class="font-normal block truncate">{{
                                                        table.tableName
                                                    }}</span>
                                                </li>
                                            </ListboxOption>
                                        </template>
                                        <template v-else>
                                            <ListboxOption>
                                                <li
                                                    class="text-gray-900 bg-white relative cursor-default select-none py-2 px-2 flex space-x-2"
                                                >
                                                    No Available Table
                                                </li>
                                            </ListboxOption>
                                        </template>
                                    </ListboxOptions>
                                </transition>
                            </div>
                        </Listbox>
                    </div>
                    <template
                        v-if="
                            transactionStore.inputError &&
                            transactionStore.inputError.error.validation.table
                        "
                    >
                        <p
                            v-for="(error, i) in transactionStore.inputError.error.validation.table"
                            class="mt-2 text-sm text-red-500 dark:text-red-500"
                            :key="i"
                        >
                            {{ error }}
                        </p>
                    </template>
                </div>

                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </template>
    </FormModal>
</template>
