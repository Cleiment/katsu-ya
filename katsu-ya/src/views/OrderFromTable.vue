<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { formatMoney } from '@/tools'
import { modalSize, type Menu, type Table, type TransactionCartDetail } from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { useTransactionStore } from '@/stores/TransactionStore'

import Modal from '@/components/Modal.vue'
import OrderTable from '@/components/tables/OrderTable.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import OrderMenu from '@/components/tables/OrderMenu.vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
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
                router.push('/order/all/?table=' + (route.query.table || ''))
                transactionStore.reset()
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
        if (menuStore.isMenuAvailable(menuStore.selectedMenu, 1))
            transactionStore.newTransaction.transactionCartDetail.push({
                menu: menuStore.selectedMenu,
                menuQty: 1
            })
        transactionStore.saveCartLocalStorage()
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

const triggerOnMounted = () => {
    const hasTable = 'table' in route.query
    if (hasTable) {
        const idTable = hasTable ? route.query.table : 0

        const table: Table | undefined = transactionStore.availableTable.find(
            (item) => item.id == idTable
        )
        if (table) {
            transactionStore.newTransaction.table = table
            transactionStore.saveCartLocalStorage()
        } else {
            router.push({ name: 'NotFound' })
        }
    } else {
        router.push({ name: 'NotFound' })
    }
}

onMounted(async () => {
    appStore.isUsingSidebar = false
    await transactionStore.fetchAvailableTable()
    transactionStore.fetchCartLocalStorage()

    triggerOnMounted()

    await menuStore.getAll()

    await refresh()
})

// const emitSocket = () => {
//     socket.emit('newOrder', 'New order arrived!')
// }

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-center mb-2">
        <div>
            <p class="text-sm">Order from :</p>
            <span class="font-bold">{{ transactionStore.newTransaction.table?.tableName }}</span>
        </div>
        <div>
            <router-link
                :to="'/order/all?table=' + (route.query.table || '')"
                class="rounded-md px-2 py-2 text-sm font-medium bg-emerald-600 text-white transition-all duration-300 hover:shadow-lg hover:bg-emerald-700 focus-visible:ring-amber-500"
            >
                Ongoing Order
            </router-link>
        </div>
    </div>
    <div class="relative flex flex-col md:flex-row gap-2 h-full overflow-y-auto">
        <div class="rounded-md w-full h-full border-t-4 border-rose-500 bg-white p-3">
            <OrderMenu @show-menu-detail="openMenuDetailModal" @show-order-form="addToOrder" />
        </div>
        <div
            class="shadow-xl rounded-md absolute right-0 bottom-0 w-full lg:w-1/3 h-fit transition duration-300 ease-in-out z-[5]"
            :class="[
                !isOrderCartOpen
                    ? 'translate-y-[100%] translate-x-[50%] scale-0'
                    : 'translate-x-0 translate-y-0 scale-100'
            ]"
        >
            <div
                class="rounded-md w-full h-full overflow-y-auto border-t-4 border-blue-500 bg-white p-4"
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
                <div class="w-full overflow-x-auto">
                    <OrderTable />
                </div>
            </div>
        </div>

        <div class="absolute bottom-2 right-2 z-[6]">
            <button
                class="relative shadow-lg rounded-full p-3 bg-blue-500"
                @click="toggleOrderCart"
            >
                <ShoppingCartIcon class="w-7 h-7 text-white" />
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
