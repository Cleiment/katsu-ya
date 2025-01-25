import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type Menu
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useIngredientStore } from './IngredientStore'

export const useMenuStore = defineStore('menu', () => {
    const appStore = useAppStore()
    const ingredientStore = useIngredientStore()
    const data = ref<Menu[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newMenu: Menu = {
        name: '',
        price: 0,
        status: 1,
        createdAt: '',
        updatedAt: '',
        ingredients: []
    }

    const selectedMenu: Menu = newMenu

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/menu'
        const rs = await appStore.get<Menu[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs))
            data.value = rs.map((item) => {
                if (
                    item.ingredients?.some(
                        (i) => i.ingredient.status == 0 || i.ingredient.qty < i.qty
                    )
                )
                    item.status = 0
                return item
            })

        await ingredientStore.getAll()
    }

    const validate = (newMenu: Menu): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const name = []
        const ingredients = []

        if (!newMenu.name) name.push("Input can't be empty")
        if (name.length > 0) err.error.validation.name = name

        if (newMenu.ingredients?.length == 0) ingredients.push("Input can't be empty")
        else
            newMenu.ingredients?.forEach((item) => {
                item.qty == 0 ? ingredients.push(`Qty on ${item.ingredient.name} can't be 0`) : ''
            })
        if (ingredients.length > 0) err.error.validation.ingredients = ingredients

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createMenu = async (newMenu: Menu): Promise<boolean> => {
        if (!validate(newMenu)) return false

        const url = import.meta.env.VITE_API_URL + '/menu/new'
        const rs = await appStore.post(url, newMenu)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editMenu = async (menu: Menu): Promise<boolean> => {
        if (!validate(menu)) return false

        const url = import.meta.env.VITE_API_URL + '/menu/edit'
        const rs = await appStore.post(url, menu)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deactivateMenu = async (id: string): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/menu/deactivate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const activateMenu = async (id: string): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/menu/activate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deleteMenu = async (id: string): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/menu/delete'
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
        newMenu,
        selectedMenu,
        inputError,
        getAll,
        createMenu,
        editMenu,
        deactivateMenu,
        activateMenu,
        deleteMenu
    }
})
