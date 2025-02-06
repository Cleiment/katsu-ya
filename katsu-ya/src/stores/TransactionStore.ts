import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type Transaction,
    type ErrorValidation,
    type Table,
    type TransactionCart,
    type Report
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useMenuStore } from './MenuStore'
import { socket } from '@/tools'
import { useRouter } from 'vue-router'

export const useTransactionStore = defineStore('transaction', () => {
    const appStore = useAppStore()
    const menuStore = useMenuStore()
    const data = ref<Table[]>([])
    const dataOrder = ref<TransactionCart[]>([])
    const dataReport = ref<Report>()
    const reportDateStart = ref('')
    const reportDateEnd = ref('')
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newTransaction = ref<TransactionCart>({
        transactionCartDetail: [],
        createdAt: '',
        updatedAt: '',
        id: -1,
        total: 0
    })

    const selectedTable = ref<Table>({
        isOccupied: 0,
        TransactionCart: [],
        updatedAt: ''
    })

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
            id: -1,
            total: 0,
            transactionCartDetail: [],
            createdAt: '',
            updatedAt: ''
        }

        selectedTable.value = {
            isOccupied: 0,
            TransactionCart: [],
            updatedAt: ''
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

    const getOrders = async () => {
        const url = import.meta.env.VITE_API_URL + '/transaction/orders'
        const rs = await appStore.get<TransactionCart[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            dataOrder.value = rs
        }
    }

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/transaction'
        const rs = await appStore.get<Table[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            data.value = rs
            selectedTable.value = rs[0]
        }

        await menuStore.getAll()
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

    const selectNotOccupiedTable = () => {
        const notOccupied = data.value.filter((item) => item.isOccupied == 0)

        if (notOccupied.length == 0) {
            appStore.addNotification('error', 'No table is available')
            return false
        }
        selectedTable.value = notOccupied[0]
        return true
    }

    const createTransaction = async (): Promise<boolean> => {
        newTransaction.value.transactionCartDetail.map((item) => {
            item.idMenu = item.menu.id
            return item
        })

        if (!validate(newTransaction.value)) return false

        if (!selectNotOccupiedTable()) return false
        selectedTable.value.TransactionCart.push(newTransaction.value)
        const url = import.meta.env.VITE_API_URL + '/transaction/cart/new'
        const rs = await appStore.post(url, selectedTable.value)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }

        socket.emit('newOrder', `New order on ${selectedTable.value.tableName}`)

        reset()
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
                socket.emit('finishOrder', `Finished order on ${selectedTable.value.tableName}`)
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
        data,
        dataOrder,
        dataReport,
        reportDateStart,
        reportDateEnd,
        pages,
        newTransaction,
        selectedTable,
        selectedStrukTransaction,
        inputError,
        getAll,
        getOrders,
        getTransaction,
        getTransactions,
        createTransaction,
        finishTransaction,
        cancelTransaction
    }
})
