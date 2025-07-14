import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type IngredientUnit
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'

export const useIngredientUnitStore = defineStore('ingredientUnit', () => {
    const appStore = useAppStore()
    const data = ref<IngredientUnit[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newIngredientUnit: IngredientUnit = {
        name: '',
        status: 1,
        createdAt: '',
        updatedAt: ''
    }

    const selectedIngredientUnit: IngredientUnit = newIngredientUnit

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/unit/all'
        const rs = await appStore.get<IngredientUnit[]>(url)
        if (
            rs &&
            !isErrorResponse(rs) &&
            !isErrorValidation(rs) &&
            !isFetchSuccess(rs) &&
            rs.length > 0
        )
            data.value = rs
    }

    const validate = (newIngredientUnit: IngredientUnit): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const name = []

        if (!newIngredientUnit.name) name.push("Input can't be empty")

        if (name.length > 0) err.error.validation.name = name

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createIngredientUnit = async (newIngredientUnit: IngredientUnit): Promise<boolean> => {
        if (!validate(newIngredientUnit)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/unit/new'
        const rs = await appStore.post(url, newIngredientUnit)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editIngredientUnit = async (ingredientUnit: IngredientUnit): Promise<boolean> => {
        if (!validate(ingredientUnit)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/unit/edit'
        const rs = await appStore.post(url, ingredientUnit)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deactivateIngredientUnit = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/unit/deactivate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const activateIngredientUnit = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/unit/activate'
        const rs = await appStore.post(url, { id: id })
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
        pages,
        newIngredientUnit,
        selectedIngredientUnit,
        inputError,
        getAll,
        createIngredientUnit,
        editIngredientUnit,
        deactivateIngredientUnit,
        activateIngredientUnit
    }
})
