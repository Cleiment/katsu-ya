<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { formatMoney, timestampToDatetime } from '@/tools'
import {
    modalSize,
    type Menu,
    type PaymentInfo,
    type Table,
    type TransactionCart,
    type TransactionCartDetail
} from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { useTransactionStore } from '@/stores/TransactionStore'

import Modal from '@/components/Modal.vue'
import OrderTable from '@/components/tables/OrderTable.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import OrderMenu from '@/components/tables/OrderMenu.vue'
import { ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import FormModal from '@/components/FormModal.vue'

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
                transactionStore.reset()
                router.push('/order/' + transactionStore.selectedOrder?.id)
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

const isPayFormOpen = ref(false)
const initialPaymentForm: PaymentInfo = {
    idCart: '',
    firstName: '',
    email: '',
    phone: ''
}
const paymentInfo = ref<PaymentInfo>(initialPaymentForm)

const openPayForm = (idCart: string) => {
    paymentInfo.value = initialPaymentForm

    paymentInfo.value.idCart = idCart
    isPayFormOpen.value = true
}

const closePayForm = () => {
    isPayFormOpen.value = false
    paymentInfo.value = initialPaymentForm
}

const confirmPayment = async () => {
    if (await transactionStore.getPaymentToken(paymentInfo.value)) {
        // console.log(transactionStore.paymentToken)
        if (window.snap) {
            window.snap.pay(transactionStore.paymentToken, {
                onSuccess: async (result) => {
                    const transactionId = await transactionStore.payOrder(
                        paymentInfo.value.idCart,
                        result.payment_type
                    )

                    if (typeof transactionId === 'number')
                        router.push('/order/' + transactionId.toString() + '/payment-success')
                }
            })
        }
    } else {
        appStore.addNotification('error', 'Failed to fetch payment token')
    }
}

const getTotalItem = (item: TransactionCart) => {
    let total = 0
    item.transactionCartDetail.forEach((a) => {
        total += a.menuQty
    })
    return total
}

const getTotalPrice = (item: TransactionCart) => {
    let total = 0
    item.transactionCartDetail.forEach((a) => {
        total += a.menuQty * a.menu.price
    })
    return total
}

const loadMidtransScript = () => {
    // console.log('test')
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
        script.setAttribute('data-client-key', 'Mid-client-R0iReyafb01BJ5HP')
        script.onload = () => resolve()
        script.onerror = () => reject('Failed to load Midtrans script')
        document.head.appendChild(script)
    })
}

const triggerOnMounted = async () => {
    const hasTable = 'table' in route.query
    if (hasTable) {
        const idTable = route.query.table as string

        if (await transactionStore.getOrderByTable(idTable)) {
            return
        } else {
            router.push({ name: 'NotFound' })
        }
    } else {
        router.push({ name: 'NotFound' })
    }
}

onMounted(async () => {
    appStore.isUsingSidebar = false
    await loadMidtransScript()
    // await transactionStore.fetchAvailableTable()
    // transactionStore.fetchCartLocalStorage()

    await triggerOnMounted()

    // await menuStore.getAll()

    // await refresh()
})

// const emitSocket = () => {
//     socket.emit('newOrder', 'New order arrived!')
// }

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="relative flex flex-col gap-2 h-full overflow-y-auto mx-auto">
        <div class="flex justify-between items-center">
            <p class="font-bold">Showing Orders</p>
            <div>
                <router-link
                    class="rounded-md px-2 py-2 flex items-center gap-1 text-sm font-medium bg-slate-600 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-700 focus-visible:ring-amber-500"
                    :to="'/order?table=' + (route.query.table || '')"
                >
                    <ChevronLeftIcon class="w-4 h-4" />
                    <p class="text-sm">Back</p>
                </router-link>
            </div>
        </div>
        <p class="text-sm">
            <span class="text-red-600 me-1">*</span>Pay at the cashier or Press Pay to Transfer
        </p>
        <div class="h-full overflow-y-auto">
            <template v-if="transactionStore.dataOrder.length > 0">
                <div
                    v-for="(item, i) in transactionStore.dataOrder"
                    :key="i"
                    class="shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4 mb-3"
                >
                    <div>
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col">
                                <p class="font-semibold">Order No. {{ i + 1 }}</p>
                                <p class="text-sm mb-2">
                                    {{ timestampToDatetime(item.createdAt) }}
                                </p>
                            </div>
                            <div>
                                <button
                                    v-if="item.paidStatus == 0"
                                    class="text-sm bg-blue-400 text-white rounded px-3 py-2 transition-all hover:shadow-md"
                                    @click="openPayForm(item.id)"
                                >
                                    Pay
                                </button>
                                <p
                                    class="text-sm bg-emerald-600 px-2 py-1 rounded-full text-white"
                                    v-if="item.paidStatus == 1"
                                >
                                    Paid
                                </p>
                            </div>
                        </div>
                        <div class="w-full overflow-x-auto">
                            <table
                                class="table min-w-96 max-h-80 w-full font-normal table-auto relative"
                            >
                                <thead class="shadow bg-white rounded">
                                    <tr>
                                        <th class="font-semibold" width="20%">Name</th>
                                        <th class="font-semibold" width="10%">Qty</th>
                                        <th class="font-semibold" width="10%">Price</th>
                                        <th class="font-semibold text-end" width="10%">Total</th>
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
                                        <td class="px-2 py-3">
                                            {{ v.menuQty }}
                                        </td>

                                        <td class="px-2 py-3">
                                            {{ formatMoney(v.menu.price, true) }}
                                        </td>
                                        <td class="px-2 py-3 text-end">
                                            {{ formatMoney(v.menu.price * v.menuQty, true) }}
                                        </td>
                                    </tr>

                                    <tr class="border-b hover:bg-gray-400/20 bg-slate-100">
                                        <td class="text-end font-semibold">Total Item</td>
                                        <td class="px-2 py-3 font-semibold">
                                            {{ getTotalItem(item) }}
                                        </td>
                                        <td class="text-end font-semibold">Total Price</td>
                                        <td class="px-2 py-3 text-end font-semibold">
                                            {{ formatMoney(getTotalPrice(item), true) }}
                                        </td>
                                        <!-- <td class="text-end"></td> -->
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="flex justify-center col-span-full text-gray-500">No Ongoing Order</div>
            </template>
        </div>
    </div>

    <FormModal title="Pay Order" :show="isPayFormOpen" @cancel="closePayForm" :size="modalSize.xs">
        <template v-slot:body>
            <form @submit.prevent="confirmPayment">
                <div class="flex flex-col space-y-2 h-fit">
                    <div class="flex flex-col space-y-2">
                        <div>
                            <label
                                for="name"
                                class="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Name
                            </label>
                            <div
                                class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                            >
                                <input
                                    required
                                    type="text"
                                    id="name"
                                    autocomplete="name"
                                    class="w-full text-sm border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-300"
                                    placeholder="Name"
                                    v-model="paymentInfo.firstName"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                for="email"
                                class="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email
                            </label>
                            <div
                                class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                            >
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    autocomplete="email"
                                    class="w-full text-sm border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-300"
                                    placeholder="e.g. address@mail.com"
                                    v-model="paymentInfo.email"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                for="phone"
                                class="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Phone Number
                            </label>
                            <div
                                class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                            >
                                <input
                                    required
                                    type="text"
                                    id="phone"
                                    class="w-full text-sm border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-300"
                                    placeholder="Phone Number"
                                    v-model="paymentInfo.phone"
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
        </template>
    </FormModal>
</template>
