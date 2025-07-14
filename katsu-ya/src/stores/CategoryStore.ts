import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type Category,
    type PaginatedData,
    type TableLimit
} from '@/tools/types'

import { useAppStore } from './AppStore'

export const useCategoryStore = defineStore('category', () => {
    const appStore = useAppStore()
    const data = ref<Category[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newCategory: Category = {
        name: '',
        status: 1,
        createdAt: '',
        updatedAt: ''
    }

    const selectedCategory: Category = newCategory
    const selectedLimit = ref<TableLimit>(10)
    const currentPage = ref(1)

    const total = ref(0)
    const totalPages = ref(0)

    const offset = ref((currentPage.value - 1) * selectedLimit.value)

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/category/all'
        const rs = await appStore.get<Category[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs))
            data.value = rs
    }

    const fetchData = async () => {
        const url =
            import.meta.env.VITE_API_URL +
            '/category/' +
            '?page=' +
            currentPage.value +
            '&limit=' +
            selectedLimit.value

        const rs = await appStore.get<PaginatedData<Category[]>>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs)) {
            totalPages.value = rs.totalPages
            total.value = rs.total
            currentPage.value = rs.currentPage
            offset.value = (rs.currentPage - 1) * selectedLimit.value

            data.value = rs.data
        }
    }

    const validate = (newCategory: Category): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const name = []

        if (!newCategory.name) name.push('Category need a name')
        if (name.length > 0) err.error.validation.name = name

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createCategory = async (newCategory: Category): Promise<boolean> => {
        if (!validate(newCategory)) return false

        const url = import.meta.env.VITE_API_URL + '/category/new'
        const rs = await appStore.post(url, newCategory)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editCategory = async (category: Category): Promise<boolean> => {
        if (!validate(category)) return false

        const url = import.meta.env.VITE_API_URL + '/category/edit'
        const rs = await appStore.post(url, category)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deactivateCategory = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/category/deactivate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const activateCategory = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/category/activate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deleteCategory = async (id: number): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/category/delete'
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
        newCategory,
        selectedCategory,
        selectedLimit,
        currentPage,
        total,
        totalPages,
        offset,
        inputError,
        getAll,
        fetchData,
        createCategory,
        editCategory,
        deactivateCategory,
        activateCategory,
        deleteCategory
    }
})
