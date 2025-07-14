import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type Menu,
    type MenuIngredient,
    type OrderMenu,
    type PaginatedData,
    type TableLimit
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'
import { useIngredientStore } from './IngredientStore'
import { useCategoryStore } from './CategoryStore'

export const useMenuStore = defineStore('menu', () => {
    const appStore = useAppStore()
    const ingredientStore = useIngredientStore()
    const data = ref<Menu[]>([])
    const orderMenu = ref<OrderMenu[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newMenu: Menu = {
        name: '',
        idCategory: null,
        price: 0,
        status: 1,
        desc: '',
        createdAt: '',
        updatedAt: '',
        ingredients: []
    }

    const selectedMenu: Menu = newMenu
    const selectedLimit = ref<TableLimit>(10)
    const showDeactivated = ref<boolean>(false)
    const currentPage = ref(1)

    const total = ref(0)
    const totalPages = ref(0)

    const offset = ref((currentPage.value - 1) * selectedLimit.value)

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/menu/all'
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

        // await ingredientStore.getAll()
    }

    const fetchData = async () => {
        const url =
            import.meta.env.VITE_API_URL +
            '/menu/' +
            '?page=' +
            currentPage.value +
            '&limit=' +
            selectedLimit.value +
            '&show_deactivated=' +
            showDeactivated.value

        const rs = await appStore.get<PaginatedData<Menu[]>>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            totalPages.value = rs.totalPages
            total.value = rs.total
            currentPage.value = rs.currentPage
            offset.value = (rs.currentPage - 1) * selectedLimit.value

            data.value = rs.data.map((item) => {
                if (
                    item.ingredients?.some(
                        (i) => i.ingredient.status == 0 || i.ingredient.qty < i.qty
                    )
                )
                    item.status = 0
                return item
            })
        }
    }

    const fetchOrderMenu = async () => {
        const url = import.meta.env.VITE_API_URL + '/menu/order-menu'

        const rs = await appStore.get<OrderMenu[]>(url)
        if (rs && !isErrorValidation(rs)) {
            orderMenu.value = rs
        }
    }

    const validate = (newMenu: Menu, isCreate: Boolean = true): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const name = []
        const picture = []
        const ingredients = []

        if (!newMenu.name) name.push('Menu need a name')
        if (name.length > 0) err.error.validation.name = name

        if (isCreate && !newMenu.file) picture.push('Menu requires a Picture')
        if (picture.length > 0) err.error.validation.picture = picture

        if (newMenu.ingredients?.length == 0) ingredients.push('Menu needs ingredient(s)')
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

    const isMenuAvailable = (menu: Menu, menuQty: number = 1) => {
        let canBeOrdered = true

        menu.ingredients?.forEach((item) => {
            if (item.ingredient.qty < item.qty * menuQty) {
                canBeOrdered = false
                appStore.addNotification(
                    'error',
                    'Sorry, the ingredient for ' + menu.name + ' menu is not enough'
                )
                return
            }
        })

        return canBeOrdered
    }

    const createMenu = async (newMenu: Menu): Promise<boolean> => {
        if (!validate(newMenu)) return false

        const formData = new FormData()
        for (const key in newMenu) {
            const item = newMenu[key as keyof Menu]
            if (item) {
                if (item instanceof File) {
                    formData.append(key, item, item.name)
                } else formData.append(key, JSON.stringify(item))
            }
        }

        const url = import.meta.env.VITE_API_URL + '/menu/new'
        const rs = await appStore.post(url, formData, false)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editMenu = async (menu: Menu): Promise<boolean> => {
        if (!validate(menu, false)) return false

        const formData = new FormData()
        for (const key in menu) {
            const item = menu[key as keyof Menu]
            if (item) {
                if (item instanceof File) {
                    formData.append(key, item, item.name)
                } else formData.append(key, JSON.stringify(item))
            }
        }

        const url = import.meta.env.VITE_API_URL + '/menu/edit'
        const rs = await appStore.post(url, formData, false)
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
        orderMenu,
        pages,
        newMenu,
        selectedMenu,
        selectedLimit,
        showDeactivated,
        currentPage,
        total,
        totalPages,
        offset,
        inputError,
        getAll,
        fetchData,
        fetchOrderMenu,
        createMenu,
        editMenu,
        deactivateMenu,
        activateMenu,
        deleteMenu,
        isMenuAvailable
    }
})
