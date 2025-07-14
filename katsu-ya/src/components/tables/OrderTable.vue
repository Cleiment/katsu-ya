<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { useTransactionStore } from '@/stores/TransactionStore'
import { formatMoney } from '@/tools'
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/solid'
import ConfirmationModal from '../ConfirmationModal.vue'
import { ref } from 'vue'
import type { TransactionCartDetail } from '@/tools/types'

const transactionStore = useTransactionStore()
const menuStore = useMenuStore()

const isDeleteDataOpen = ref(false)
const orderMenuIndex = ref()
const confirmationDelete = (i: number) => {
    orderMenuIndex.value = i
    isDeleteDataOpen.value = true
}

const deleteOrder = (i: number) => {
    transactionStore.newTransaction.transactionCartDetail.splice(i, 1)
    isDeleteDataOpen.value = false
    transactionStore.saveCartLocalStorage()
}

const getTotal = () => {
    let total = 0
    transactionStore.newTransaction.transactionCartDetail.forEach((a) => {
        total += a.menuQty * a.menu.price
    })
    return total
}

const substract = (item: TransactionCartDetail) => {
    if (item.menuQty > 1) {
        item.menuQty--
        saveCart(item)
    }
}

const isMenuAvailable = (item: TransactionCartDetail) => {
    if (menuStore.isMenuAvailable(item.menu, item.menuQty + 1)) {
        item.menuQty++
        saveCart(item)
    }
}

const saveCart = (item: TransactionCartDetail) => {
    if (item.menuQty > 1) transactionStore.saveCartLocalStorage()
}
</script>
<template>
    <table class="table min-w-[28rem] max-h-80 w-full font-normal table-auto relative">
        <thead class="sticky left-0 top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold" width="20%">Name</th>
                <th class="font-semibold" width="20%">Qty</th>
                <th class="font-semibold" width="10%">Price</th>
                <th class="font-semibold text-end" width="10%">Total</th>
                <th class="font-semibold text-center" width="5%"></th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(item, i) in transactionStore.newTransaction.transactionCartDetail"
                :key="i"
                class="border-b hover:bg-rose-400/20"
            >
                <td>
                    {{ item.menu.name }}
                </td>
                <td>
                    <div>
                        <div
                            class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                        >
                            <button class="p-2 bg-red-500 text-white" @click="substract(item)">
                                <MinusIcon class="h-3 w-3" />
                            </button>
                            <input
                                type="text"
                                pattern="\d"
                                step="1"
                                min="1"
                                autocomplete="off"
                                class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                placeholder="Qty"
                                v-model="item.menuQty"
                                @change="saveCart(item)"
                            />
                            <button
                                class="p-2 bg-blue-500 text-white"
                                @click="isMenuAvailable(item)"
                            >
                                <PlusIcon class="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </td>

                <td class="px-3 py-4">{{ formatMoney(item.menu.price, true) }}</td>
                <td class="px-3 py-4 text-end">
                    {{ formatMoney(item.menu.price * item.menuQty, true) }}
                </td>

                <td>
                    <div class="flex space-x-2 justify-center">
                        <button
                            class="rounded-full p-1 bg-red-500 text-white"
                            @click="confirmationDelete(i)"
                        >
                            <MinusIcon class="w-6 h-6" />
                        </button>
                    </div>
                </td>
            </tr>
            <tr v-if="transactionStore.newTransaction.transactionCartDetail.length == 0">
                <td class="py-4 border-b hover:bg-rose-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Add Menu to Order</p>
                </td>
            </tr>
            <tr class="border-b hover:bg-rose-400/20">
                <td class="text-end font-semibold" colspan="3">Total</td>
                <td class="py-4 px-3 text-end font-semibold">
                    {{ formatMoney(getTotal(), true) }}
                </td>
                <td class="text-end"></td>
            </tr>
        </tbody>
    </table>

    <ConfirmationModal
        :show="isDeleteDataOpen"
        title="Delete Menu"
        text="Are you sure you want to cancel this menu order?"
        @cancel="isDeleteDataOpen = false"
        @ok="deleteOrder(orderMenuIndex)"
    />
</template>

<style scoped></style>
