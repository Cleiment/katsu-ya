import {
    isErrorResponse,
    isErrorValidation,
    isFetchSuccess,
    type Notification,
    type OErrorTypes,
    type ONotificationStatus,
    type SuccessResponse,
    type FetchResponse,
    type PromiseFetchResponse
} from '@/tools/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { socket } from '@/tools'

export const useAppStore = defineStore('app', () => {
    const authStore = useAuthStore()
    const isLoading = ref(true)
    const isHotkeying = ref(false)
    const notifications = ref<Notification[]>([])
    const addNotification = (status: ONotificationStatus, body: SuccessResponse | OErrorTypes) => {
        const id = Date.now()

        if (isFetchSuccess(body)) {
            const notif: Notification = {
                id: id,
                status: status,
                message: body.success
            }

            notifications.value.push(notif)
        } else if (typeof body === 'string') {
            const notif: Notification = {
                id: id,
                status: status,
                message: body
            }
            notifications.value.push(notif)
        } else if (isErrorResponse(body)) {
            const notif: Notification = {
                id: id,
                status: status,
                message: body.error.message
            }
            notifications.value.push(notif)
        } else if (isErrorValidation(body)) {
            const message = 'Input error, please check the input'
            const notif: Notification = {
                id: id,
                status: status,
                message: message
            }
            notifications.value.push(notif)
        }

        setTimeout(() => {
            notifications.value = notifications.value.filter((i) => i.id != id)
        }, 5000)
    }

    const removeNode = (key: number | undefined) => {
        notifications.value = notifications.value.filter((i) => i.id != key)
    }

    const copy = async (text: string) => {
        try {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            document.execCommand('copy')
            textArea.remove()

            addNotification('success', 'Successfuly copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const activeMenu = ref(0)
    const changeSidebarMenu = (menuIndex: number) => {
        activeMenu.value = menuIndex
    }

    const sidebarActive = ref(false)
    const toggleSidebar = () => {
        sidebarActive.value = !sidebarActive.value
    }

    const setHeaders = () => {
        const headers = {
            Authorization: `${authStore.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }

        return headers
    }

    const responseHandler = async <T>(rs: any): PromiseFetchResponse<T> => {
        let notifType: ONotificationStatus = 'error'
        let response: any = ''
        let isReturn: boolean = false

        if (isErrorValidation(rs)) {
            response = rs
            isReturn = true
        } else if (isErrorResponse(rs)) {
            response = rs
        } else if (rs.message) {
            response = rs.message
        } else if (isFetchSuccess(rs)) {
            notifType = 'success'
            response = rs
        } else if (rs !== undefined) {
            isReturn = true
            response = rs
        } else {
            response = 'Something went wrong. Please try again later.'
        }

        addNotification(notifType, response)
        if (isReturn) return response
        else return
    }

    const get = async <T>(url: string): PromiseFetchResponse<T> => {
        const headers = setHeaders()

        let returnResponse: FetchResponse<T>
        await fetch(url, { mode: 'cors', headers: headers })
            .then((rs) => rs.json())
            .then(async (response) => {
                const res = await responseHandler<T>(response)
                returnResponse = res
            })
            .catch((err) => {
                console.error(err)
                addNotification('error', 'Something went wrong. Please try again later.')
            })

        return returnResponse
    }

    const post = async <T>(url: string, body: any): PromiseFetchResponse<T> => {
        const headers = setHeaders()

        let returnResponse: FetchResponse<T>
        await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(body)
        })
            .then((rs) => rs.json())
            .then(async (response) => {
                const res = await responseHandler<T>(response)
                returnResponse = res
            })
            .catch((err) => {
                console.error(err)
                addNotification('error', 'Something went wrong. Please try again later.')
            })

        return returnResponse
    }

    socket.on('newOrder', (msg) => {
        addNotification('info', msg)
    })

    return {
        isLoading,
        notifications,
        isHotkeying,
        activeMenu,
        sidebarActive,
        addNotification,
        removeNode,
        copy,
        changeSidebarMenu,
        toggleSidebar,
        get,
        post
    }
})
