import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type Ingredient
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useIngredientUnitStore } from './IngredientUnitStore'

export const useIngredientStore = defineStore('ingredient', () => {
    const appStore = useAppStore()
    const unitStore = useIngredientUnitStore()
    const data = ref<Ingredient[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newIngredient: Ingredient = {
        name: '',
        qty: 0,
        idUnit: 1,
        unit: undefined,
        status: 1,
        createdAt: '',
        updatedAt: ''
    }

    const selectedIngredient: Ingredient = newIngredient

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/ingredient'
        const rs = await appStore.get<Ingredient[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs))
            data.value = rs.map((v) => {
                if (v.unit?.status == 0) v.status = 0
                return v
            })

        await unitStore.getAll()
        newIngredient.unit = unitStore.data[0]
    }

    const validate = (newIngredient: Ingredient): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const name = []

        if (!newIngredient.name) name.push("Input can't be empty")
        if (name.length > 0) err.error.validation.name = name

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createIngredient = async (newIngredient: Ingredient): Promise<boolean> => {
        newIngredient.idUnit = newIngredient.unit?.id
        if (!validate(newIngredient)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/new'
        const rs = await appStore.post(url, newIngredient)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editIngredient = async (ingredient: Ingredient): Promise<boolean> => {
        ingredient.idUnit = ingredient.unit?.id
        console.log(ingredient)
        if (!validate(ingredient)) return false

        const url = import.meta.env.VITE_API_URL + '/ingredient/edit'
        const rs = await appStore.post(url, ingredient)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deactivateIngredient = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/deactivate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const activateIngredient = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/ingredient/activate'
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
        newIngredient,
        selectedIngredient,
        inputError,
        getAll,
        createIngredient,
        editIngredient,
        deactivateIngredient,
        activateIngredient
    }
})
