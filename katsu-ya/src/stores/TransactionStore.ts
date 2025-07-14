import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type Transaction,
    type ErrorValidation,
    type Table,
    type TransactionCart,
    type Report,
    type PaymentInfo
    // type Menu,
    // type TransactionCartDetail
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useMenuStore } from './MenuStore'
import { socket } from '@/tools'
// import { useRoute, useRouter } from 'vue-router'

export const useTransactionStore = defineStore('transaction', () => {
    // const route = useRoute()
    // const router = useRouter()

    const appStore = useAppStore()
    const menuStore = useMenuStore()
    const data = ref<Table[]>([])
    const dataOrder = ref<TransactionCart[]>([])
    const dataReport = ref<Report>()
    const reportDateStart = ref('')
    const reportDateEnd = ref('')
    const pages = ref()

    const paymentToken = ref<string>('')

    const inputError = ref<ErrorValidation>()

    const newTransaction = ref<TransactionCart>({
        transactionCartDetail: [],
        createdAt: '',
        updatedAt: '',
        id: '',
        total: 0,
        status: 0
    })

    const availableTable = ref<Table[]>([])
    const selectedTableForOrder = ref<Table>()
    const selectedOrder = ref<TransactionCart>()

    const selectedStrukTransaction = ref<Transaction>({
        id: '',
        paid: 0,
        total: 0,
        cashier: {
            id: undefined,
            username: '',
            idRole: undefined,
            userRole: {
                id: 0,
                role: '',
                dashboard: undefined,
                menu: undefined
            },
            status: 0,
            createdAt: '',
            updatedAt: '',
            password: undefined,
            confirmPassword: undefined
        },
        detail: [],
        createdAt: '',
        updatedAt: ''
    })

    const reset = () => {
        newTransaction.value = {
            id: '',
            total: 0,
            transactionCartDetail: [],
            createdAt: '',
            updatedAt: '',
            status: 0
        }

        selectedStrukTransaction.value = {
            id: '',
            paid: 0,
            total: 0,
            cashier: {
                id: undefined,
                username: '',
                idRole: undefined,
                userRole: {
                    id: 0,
                    role: '',
                    dashboard: undefined,
                    menu: undefined
                },
                status: 0,
                createdAt: '',
                updatedAt: '',
                password: undefined,
                confirmPassword: undefined
            },
            detail: [],
            createdAt: '',
            updatedAt: ''
        }

        deleteCartLocalStorage()
    }

    const getTransactions = async () => {
        if (reportDateStart.value == '' || reportDateEnd.value == '')
            return appStore.addNotification('error', 'Select date range for report')

        const url = import.meta.env.VITE_API_URL + '/transaction/report'
        const rs = await appStore.post<Report>(url, {
            startDate: reportDateStart.value,
            endDate: reportDateEnd.value
        })
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            dataReport.value = rs
        }
    }

    const getTransaction = async (id: number) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/' + id
        const rs = await appStore.get<Transaction>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            selectedStrukTransaction.value = rs
        }
        await menuStore.getAll()
    }

    const getReceipt = async (id: string) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/struk/' + id
        const rs = await appStore.get<Transaction>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            selectedStrukTransaction.value = rs
        }
        await menuStore.getAll()
    }

    const getOrders = async () => {
        const url = import.meta.env.VITE_API_URL + '/transaction/orders'
        const rs = await appStore.get<TransactionCart[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            dataOrder.value = rs
        }
    }

    const getOrderByTable = async (idTable: string) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/order/table/' + idTable
        const rs = await appStore.get<TransactionCart[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            dataOrder.value = rs
            return true
        }
        return false
    }

    const getOrderById = async (idCart: string) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/get-cart/' + idCart
        const rs = await appStore.get<TransactionCart>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            selectedOrder.value = rs
            return true
        }

        return false
    }

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/transaction'
        const rs = await appStore.get<Table[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            data.value = rs
        }
    }

    const fetchAvailableTable = async () => {
        const url = import.meta.env.VITE_API_URL + '/transaction/available-table'
        const rs = await appStore.get<Table[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            availableTable.value = rs
        }
    }

    // const fetchCart = async (id: string) => {
    //     const url = import.meta.env.VITE_API_URL + '/transaction/get-cart/' + id
    //     const rs = await appStore.get<TransactionCart>(url)
    //     if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
    //         newTransaction.value = rs
    //     }
    // }

    // const setNewTransactionCartTable = async () => {
    //     validateSelectedTable()

    //     const url = import.meta.env.VITE_API_URL + '/transaction/cart/new'
    //     const rs = await appStore.post<TransactionCart>(url, {
    //         idTable: selectedTableForOrder.value?.id
    //     })

    //     if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
    //         newTransaction.value = rs
    //     }
    // }

    // const addCartItem = async (idCart: string, menu: Menu): Promise<boolean> => {
    //     const cartItem: TransactionCartDetail = {
    //         idMenu: menu.id,
    //         menu: menu,
    //         menuQty: 1
    //     }

    //     const url = import.meta.env.VITE_API_URL + '/transaction/cart/add_item'
    //     const rs = await appStore.post(url, { idCart: idCart, TransactionCartDetail: cartItem })
    //     if (rs) {
    //         if (isErrorValidation(rs)) {
    //             inputError.value = rs
    //             return false
    //         }
    //     }

    //     // socket.emit('newOrder', `New order on ${selectedTable.value.tableName}`)
    //     await fetchCart(idCart)
    //     return true
    // }

    // const removeCartItem = async (idCartDetail: number): Promise<boolean> => {
    //     const url = import.meta.env.VITE_API_URL + '/transaction/cart/remove_item'
    //     const rs = await appStore.post(url, { idCartDetail: idCartDetail })
    //     if (rs) {
    //         if (isErrorValidation(rs)) {
    //             inputError.value = rs
    //             return false
    //         }
    //     }

    //     // socket.emit('newOrder', `New order on ${selectedTable.value.tableName}`)
    //     // await fetchCart(idCart)
    //     return true
    // }

    // const validateCartDetail = async () => {
    //     const hasCartId = 'id' in route.params
    //     if (hasCartId) {
    //         const cartId = route.params.id as string
    //         await fetchCart(cartId)
    //     } else {
    //         router.push({ name: 'NotFound' })
    //     }
    // }

    const fetchCartLocalStorage = () => {
        const localCart = localStorage.getItem('cart')

        const cart: TransactionCart = localCart ? JSON.parse(localCart) : newTransaction.value

        newTransaction.value = cart
    }

    const saveCartLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(newTransaction.value))
    }

    const deleteCartLocalStorage = () => {
        localStorage.removeItem('cart')
    }

    const validateSelectedTable = () => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const table = []

        if (!selectedTableForOrder.value) table.push('Please choose a table')
        if (table.length > 0) err.error.validation.table = table

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const validate = (newTransaction: TransactionCart): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const menus = []

        if (newTransaction.transactionCartDetail.length == 0) menus.push("Input can't be empty")
        else
            newTransaction.transactionCartDetail.forEach((item) => {
                item.menuQty < 1 ? menus.push(`Qty on ${item.menu.name} can't be 0`) : ''
            })
        if (menus.length > 0) err.error.validation.menus = menus

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const setNewTransactionCartTable = async () => {
        validateSelectedTable()

        reset()
        newTransaction.value.table = selectedTableForOrder.value

        saveCartLocalStorage()
    }

    const createTransaction = async (): Promise<boolean> => {
        newTransaction.value.transactionCartDetail.map((item) => {
            item.idMenu = item.menu.id
            return item
        })

        if (!validate(newTransaction.value)) return false

        // if (!selectNotOccupiedTable()) return false

        const postBody = {
            idTable: newTransaction.value.table?.id,
            TransactionCart: newTransaction.value
        }

        const url = import.meta.env.VITE_API_URL + '/transaction/cart/new'
        const rs = await appStore.post<TransactionCart>(url, postBody)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            } else {
                selectedOrder.value = rs
                appStore.addNotification(
                    'success',
                    'Order have been placed in. Please choose payment method'
                )
            }
        }

        socket.emit('newOrder', `New order on ${newTransaction.value.table?.tableName}`)

        reset()
        return true
    }

    const getPaymentToken = async (paymentInfo: PaymentInfo) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/pay/get-token'
        const rs = await appStore.post<{ token: string }>(url, paymentInfo)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            } else {
                paymentToken.value = rs.token
            }
        }

        return true
    }

    const finishTransaction = async (transactionCart: TransactionCart) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/cart/finish'
        const rs = await appStore.post<{ transactionId: number }>(url, {
            paid: transactionCart.paid,
            transactionCart: transactionCart
        })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            } else {
                appStore.addNotification('success', 'Transaction is Finished!')
                // socket.emit('finishOrder', `Finished order on ${transactionCart.table?.tableName}`)
                return rs.transactionId
            }
        }

        return true
    }

    const payOrder = async (idCart: string, paymentType: string) => {
        const url = import.meta.env.VITE_API_URL + '/transaction/order/pay'
        const rs = await appStore.post<{ transactionId: number }>(url, {
            idCart: idCart,
            paymentType: paymentType
        })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            } else {
                appStore.addNotification('success', 'Transaction is Finished!')
                // socket.emit('finishOrder', `Finished order on ${transactionCart.table?.tableName}`)
                return rs.transactionId
            }
        }

        return true
    }

    const cancelTransaction = async (idTable: number, idTransaction: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/transaction/cancel'
        const rs = await appStore.post(url, { idTable: idTable, idTransaction: idTransaction })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    return {
        availableTable,
        data,
        dataOrder,
        dataReport,
        reportDateStart,
        reportDateEnd,
        pages,
        paymentToken,
        newTransaction,
        selectedOrder,
        selectedTableForOrder,
        selectedStrukTransaction,
        inputError,
        getAll,
        getOrders,
        getOrderByTable,
        getOrderById,
        getReceipt,
        getTransaction,
        getTransactions,
        getPaymentToken,
        // fetchCart,
        // addCartItem,
        // removeCartItem,
        createTransaction,
        finishTransaction,
        cancelTransaction,
        payOrder,
        fetchAvailableTable,
        setNewTransactionCartTable,
        // validateCartDetail,
        saveCartLocalStorage,
        fetchCartLocalStorage,
        deleteCartLocalStorage,
        reset
    }
})
