<script lang="ts" setup>
// import {
//     CheckIcon,
//     ChevronUpDownIcon,
//     ChevronDownIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon
// } from '@heroicons/vue/20/solid'

import { onMounted, ref } from 'vue'
import { formatMoney } from '@/tools'
import { modalSize, type Menu, type TransactionCartDetail } from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { useTransactionStore } from '@/stores/TransactionStore'

import BreadCrumbs from '@/components/BreadCrumbs.vue'
import Modal from '@/components/Modal.vue'
import OrderTable from '@/components/tables/OrderTable.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import OrderMenu from '@/components/tables/OrderMenu.vue'
import { ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const router = useRouter()

const appStore = useAppStore()
const transactionStore = useTransactionStore()
const menuStore = useMenuStore()
const { getAll, createTransaction } = transactionStore

const isPlaceOrderOpen = ref(false)

const isMenuAvailable = (transactionCartDetail: TransactionCartDetail[]) => {
    let isAvailable = true

    transactionCartDetail.forEach((item) => {
        if (!menuStore.isMenuAvailable(item.menu, item.menuQty)) isAvailable = false
    })

    return isAvailable
}

const submitCreateTransaction = async () => {
    isPlaceOrderOpen.value = false
    appStore.isLoading = true
    if (transactionStore.newTransaction.transactionCartDetail.length > 0) {
        if (isMenuAvailable(transactionStore.newTransaction.transactionCartDetail)) {
            if (await createTransaction()) {
                await getAll()
                router.go(-1)
            }
        }
    } else {
        appStore.addNotification('error', 'Insert more menu to order before placing order!')
    }
    appStore.isLoading = false
}

const refresh = async () => {
    appStore.isLoading = true
    await menuStore.fetchOrderMenu()
    appStore.isLoading = false
}

const addToOrder = async () => {
    if (
        transactionStore.newTransaction.transactionCartDetail.some(
            (item) => item.menu == menuStore.selectedMenu
        )
    ) {
        transactionStore.newTransaction.transactionCartDetail.map((item) => {
            if (
                item.menu == menuStore.selectedMenu &&
                menuStore.isMenuAvailable(menuStore.selectedMenu, item.menuQty + 1)
            )
                item.menuQty += 1
            return item
        })

        transactionStore.saveCartLocalStorage()
    } else {
        if (menuStore.isMenuAvailable(menuStore.selectedMenu, 1)) {
            transactionStore.newTransaction.transactionCartDetail.push({
                menu: menuStore.selectedMenu,
                menuQty: 1
            })
            transactionStore.saveCartLocalStorage()
        }
    }
}

const selectedMenu = ref<Menu>(menuStore.newMenu)
const isMenuDetailModalOpen = ref(false)

function closeMenuDetailModal() {
    isMenuDetailModalOpen.value = false
    menuStore.inputError = undefined
}

function openMenuDetailModal(menu: Menu) {
    selectedMenu.value = menu
    isMenuDetailModalOpen.value = true
}

const isOrderCartOpen = ref(false)
const toggleOrderCart = () => {
    isOrderCartOpen.value = !isOrderCartOpen.value
}

onMounted(async () => {
    await menuStore.getAll()
    await transactionStore.getAll()

    transactionStore.fetchCartLocalStorage()

    await refresh()
})

// const emitSocket = () => {
//     socket.emit('newOrder', 'New order arrived!')
// }

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="shrink-0 flex justify-between items-center mb-3 me-3">
        <div>
            <h2 class="font-bold mb-1">New Transaction</h2>
            <BreadCrumbs />
        </div>
        <div class="flex gap-3 items-center">
            <div>
                <button
                    class="bg-gray-400 rounded-lg flex items-center px-2 py-2 text-white gap-1"
                    @click="router.go(-1)"
                >
                    <ChevronLeftIcon class="w-5 h-5" />
                    <p>Back</p>
                </button>
            </div>
            <div>
                <p>Order From:</p>
                <p class="font-bold">{{ transactionStore.newTransaction.table?.tableName }}</p>
            </div>
            <button class="relative rounded-full p-3 bg-blue-500" @click="toggleOrderCart">
                <ShoppingCartIcon class="w-5 h-5 text-white" />
                <div
                    class="absolute top-0 right-0 px-1 flex justify-center items-center ms-1 rounded text-amber-700 transition"
                    :class="[
                        transactionStore.newTransaction.transactionCartDetail.length > 0
                            ? 'bg-orange-300'
                            : 'bg-white'
                    ]"
                >
                    <p class="text-xs m-0">
                        {{ transactionStore.newTransaction.transactionCartDetail.length }}
                    </p>
                </div>
            </button>
        </div>
    </div>
    <div class="relative flex flex-col md:flex-row gap-2 h-full overflow-y-auto">
        <div class="rounded-md w-full h-full border-t-4 border-rose-500 bg-white p-3">
            <OrderMenu @show-menu-detail="openMenuDetailModal" @show-order-form="addToOrder" />
        </div>
        <div
            class="shadow-lg rounded-md absolute right-0 top-0 w-full lg:w-1/3 h-fit transition duration-300 ease-in-out z-[5]"
            :class="[
                !isOrderCartOpen
                    ? '-translate-y-[100%] translate-x-[50%] scale-0'
                    : 'translate-x-0 translate-y-0 scale-100'
            ]"
        >
            <div
                class="rounded-md w-full h-full overflow-y-auto border-t-4 border-blue-500 bg-white p-4"
            >
                <div class="flex justify-between items-center mb-2">
                    <div>
                        <p class="font-semibold text-sm">Order</p>
                        <p class="font-semibold text-sm">
                            {{ transactionStore.newTransaction.table?.tableName }}
                        </p>
                    </div>
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
        title="Menu's Detail"
        :show="isMenuDetailModalOpen"
        @cancel="closeMenuDetailModal"
        :size="modalSize.sm"
        key="3"
    >
        <template v-slot:body>
            <p class="font-bold">{{ selectedMenu.name }}</p>
            <p class="">{{ selectedMenu.desc }}</p>
            <p class="font-bold mt-2 text-end">
                {{ formatMoney(selectedMenu.price, true) }}
            </p>

            <div class="border w-full my-2"></div>

            <p class="font-bold">Menu's Ingredients</p>
            <table class="table w-full font-normal table-auto relative">
                <thead class="top-0 shadow bg-white rounded">
                    <tr>
                        <th class="text-sm text-center px-3 py-2" width="5%">No</th>
                        <th class="text-sm">Ingredient</th>
                        <th class="text-sm text-center">Needs</th>
                        <th class="text-sm text-center">Available</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(ingredient, i) in selectedMenu.ingredients"
                        :key="i"
                        class="border-b hover:bg-rose-400/20"
                        :class="
                            ingredient.ingredient.status == 0 ||
                            ingredient.ingredient.qty < ingredient.qty
                                ? 'bg-red-500/80 text-white hover:bg-red-500'
                                : 'hover:bg-rose-400/20'
                        "
                    >
                        <td class="text-sm text-center px-3 py-2">{{ i + 1 }}</td>
                        <td class="text-sm">{{ ingredient.ingredient.name }}</td>
                        <td class="text-sm text-center">{{ ingredient.qty }}</td>
                        <td class="text-sm text-center">{{ ingredient.ingredient.qty }}</td>
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
