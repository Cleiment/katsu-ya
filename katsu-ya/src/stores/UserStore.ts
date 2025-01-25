import {
    defaultRole,
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type ErrorValidation,
    type User
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './AppStore'

export const useUserStore = defineStore('user', () => {
    const appStore = useAppStore()
    const data = ref<User[]>([])
    const pages = ref()

    const inputError = ref<ErrorValidation>()

    const newUser: User = {
        username: '',
        userRole: defaultRole,
        status: 1,
        createdAt: '',
        updatedAt: ''
    }

    const selectedUser: User = newUser

    const getAll = async () => {
        const url = import.meta.env.VITE_API_URL + '/user'
        const rs = await appStore.get<User[]>(url)
        if (rs && !isErrorResponse(rs) && !isErrorValidation(rs) && !isFetchSuccess(rs))
            data.value = rs
    }

    const validate = (newUser: User, mode: 'new' | 'edit'): boolean => {
        const err: ErrorValidation = {
            error: {
                validation: {}
            }
        }

        const username = []

        if (!newUser.username) username.push("Input can't be empty")
        if (newUser.username.toLowerCase().match(/[^a-z_\d]|\s/g))
            username.push('Input can only include alphabets, numbers, & underscore')

        if (username.length > 0) err.error.validation.username = username

        if (mode == 'new') {
            const password = []
            const confirmPassword = []
            if (!newUser.password) password.push("Input can't be empty")
            if (!newUser.confirmPassword) confirmPassword.push("Input can't be empty")
            if (newUser.confirmPassword != newUser.password)
                confirmPassword.push('Confirm Password is different than password')

            if (password.length > 0) err.error.validation.password = password
            if (confirmPassword.length > 0) err.error.validation.confirmPassword = confirmPassword
        }

        if (Object.keys(err.error.validation).length > 0) {
            inputError.value = err
            return false
        } else {
            return true
        }
    }

    const createUser = async (newUser: User): Promise<boolean> => {
        newUser.idRole = newUser.userRole.id
        if (!validate(newUser, 'new')) return false

        const url = import.meta.env.VITE_API_URL + '/user/new'
        const rs = await appStore.post(url, newUser)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const editUser = async (user: User): Promise<boolean> => {
        user.idRole = user.userRole.id
        if (!validate(user, 'edit')) return false

        const url = import.meta.env.VITE_API_URL + '/user/edit'
        const rs = await appStore.post(url, user)
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const activateUser = async (id: string): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/user/activate'
        const rs = await appStore.post(url, { id: id })
        if (rs) {
            if (isErrorValidation(rs)) {
                inputError.value = rs
                return false
            }
        }
        return true
    }

    const deactivateUser = async (id: string): Promise<boolean> => {
        const url = import.meta.env.VITE_API_URL + '/user/deactivate'
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
        newUser,
        selectedUser,
        inputError,
        getAll,
        createUser,
        editUser,
        activateUser,
        deactivateUser
    }
})
