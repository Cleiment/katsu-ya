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
import Modal from '@/components/Modal.vue'
import { useMenuStore } from '@/stores/MenuStore'
import MenuTable from '@/components/tables/MenuTable.vue'
import OrderTable from '@/components/tables/OrderTable.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { socket } from '@/tools'

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const menuStore = useMenuStore()

const { getAll, createTransaction } = transactionStore

const isPlaceOrderOpen = ref(false)
const submitCreateTransaction = async () => {
    isPlaceOrderOpen.value = false
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

const addToOrder = async () => {
    if (
        transactionStore.newTransaction.transactionCartDetail.some(
            (item) => item.menu == menuStore.selectedMenu
        )
    ) {
        transactionStore.newTransaction.transactionCartDetail.map((item) => {
            if (item.menu == menuStore.selectedMenu) item.menuQty += 1
            return item
        })
    } else {
        transactionStore.newTransaction.transactionCartDetail.push({
            menu: menuStore.selectedMenu,
            menuQty: 1
        })
    }
}

const isMenuIngredientModalOpen = ref(false)

function closeMenuIngredientModal() {
    isMenuIngredientModalOpen.value = false
    menuStore.inputError = undefined
}

function openMenuIngredientModal() {
    isMenuIngredientModalOpen.value = true
}

onMounted(async () => {
    await refresh()
})

const emitSocket = () => {
    socket.emit('newOrder', 'New order arrived!')
}

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">New Transaction</h2>
            <BreadCrumbs />
        </div>
    </div>
    <div class="flex w-full flex-col md:flex-row gap-2">
        <div class="lg:h-[88%] md:h-[83%] h-[81%] w-full">
            <div
                class="shadow-lg rounded-md w-full h-full overflow-y-auto border-t-4 border-rose-500 bg-white p-4"
            >
                <p class="font-semibold mb-2">Menu</p>
                <MenuTable
                    @show-menu-ingredient="openMenuIngredientModal"
                    @show-order-form="addToOrder"
                    mode="order"
                />
            </div>
        </div>
        <div class="w-full xl:w-[50rem]">
            <div
                class="shadow-lg rounded-md w-full h-full overflow-y-auto border-t-4 border-rose-500 bg-white p-4"
            >
                <div class="flex justify-between items-center mb-2">
                    <p class="font-semibold text-sm">Order</p>
                    <button
                        class="px-4 py-2 bg-emerald-600 rounded-lg text-white text-sm"
                        @click="isPlaceOrderOpen = true"
                    >
                        Place Order
                    </button>
                </div>
                <OrderTable />
            </div>
        </div>
    </div>

    <Modal
        title="Menu's Ingredients"
        :show="isMenuIngredientModalOpen"
        @cancel="closeMenuIngredientModal"
        :size="modalSize.sm"
        key="3"
    >
        <template v-slot:body>
            <table class="table w-full font-normal table-auto relative">
                <thead class="top-0 shadow bg-white rounded">
                    <tr>
                        <th class="text-center px-3 py-2" width="5%">No</th>
                        <th>Ingredient</th>
                        <th class="text-center">Needs</th>
                        <th class="text-center">Available</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(ingredient, i) in menuStore.selectedMenu.ingredients"
                        :key="i"
                        class="border-b hover:bg-rose-400/20"
                        :class="
                            ingredient.ingredient.status == 0 ||
                            ingredient.ingredient.qty < ingredient.qty
                                ? 'bg-red-500/80 text-white hover:bg-red-500'
                                : 'hover:bg-rose-400/20'
                        "
                    >
                        <td class="text-center px-3 py-2">{{ i + 1 }}</td>
                        <td>{{ ingredient.ingredient.name }}</td>
                        <td class="text-center">{{ ingredient.qty }}</td>
                        <td class="text-center">{{ ingredient.ingredient.qty }}</td>
                    </tr>
                </tbody>
            </table>
        </template>
    </Modal>

    <ConfirmationModal
        :show="isPlaceOrderOpen"
        title="Place Order"
        text="Are you sure you want to place order?"
        @cancel="isPlaceOrderOpen = false"
        @ok="submitCreateTransaction"
    />
</template>
