import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type IngredientTransaction
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useIngredientStore } from './IngredientStore'

export const useIngredientTransactionStore = defineStore('ingredientTransaction', () => {
    const appStore = useAppStore()
    const ingredientStore = useIngredientStore()
    const data = ref<IngredientTransaction[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newIngredientTransaction: IngredientTransaction = {
        id: undefined,
        isUsage: 0,
        qty: 0,
        user: undefined,
        ingredient: undefined,
        createdAt: '',
        updatedAt: ''
    }

    const selectedIngredientTransaction: IngredientTransaction = newIngredientTransaction

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/transaction'
        const rs = await appStore.get<IngredientTransaction[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs))
            data.value = rs

        await ingredientStore.getAll()
    }

    const validate = (newIngredientTransaction: IngredientTransaction): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const qty = []
        const ingredient = []

        if (!newIngredientTransaction.qty) qty.push("Input can't be empty")
        if (newIngredientTransaction.qty <= 0) qty.push('Input must be 1 or more')
        if (qty.length > 0) err.error.validation.qty = qty

        if (!newIngredientTransaction.ingredient) ingredient.push("Input can't be empty")
        if (ingredient.length > 0) err.error.validation.ingredient = ingredient

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createIngredientTransaction = async (
        newIngredientTransaction: IngredientTransaction
    ): Promise<boolean> => {
        newIngredientTransaction.idIngredient = newIngredientTransaction.ingredient?.id
        if (!validate(newIngredientTransaction)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/transaction/new'
        const rs = await appStore.post(url, newIngredientTransaction)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editIngredientTransaction = async (
        ingredientTransaction: IngredientTransaction
    ): Promise<boolean> => {
        console.log(ingredientTransaction)
        ingredientTransaction.idIngredient = ingredientTransaction.ingredient?.id
        if (!validate(ingredientTransaction)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/transaction/edit'
        const rs = await appStore.post(url, ingredientTransaction)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deleteIngredientTransaction = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/transaction/delete'
        const rs = await appStore.post(url, { id: id })
        if (rs && isErrorValidation(rs)) {
            inputError.value = rs
            return false
        }

        return true
    }

    return {
        data,
        pages,
        newIngredientTransaction,
        selectedIngredientTransaction,
        inputError,
        getAll,
        createIngredientTransaction,
        editIngredientTransaction,
        deleteIngredientTransaction
    }
})
