import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, removeToken, saveToken } from '../auth'
import { jwtDecode } from 'jwt-decode'
import { useAppStore } from './AppStore'
import { useRouter } from 'vue-router'
import {
    isErrorValidation,
    Roles,
    type LoginSuccessResponse,
    type Role,
    type TokenPayload
} from '@/tools/types'

export const useAuthStore = defineStore('auth', () => {
    const appStore = useAppStore()
    const router = useRouter()

    const token = ref('')
    const loggedIn = ref(false)

    const id = ref(0)
    const username = ref('Guest')
    const role = ref<Role>()
    const iat = ref(0)
    const exp = ref(0)

    const newToken = (newToken: string) => {
        saveToken(newToken)
        token.value = newToken
    }

    const $reset = () => {
        id.value = 0
        username.value = 'Guest'
        role.value = undefined
        iat.value = 0
        exp.value = 0
        removeToken()
    }

    const getPayload = async () => {
        token.value = getToken() || ''

        if (token.value == '') {
            $reset()
        } else {
            const payload: TokenPayload = jwtDecode(token.value)
            const payloadRole = Roles.filter((v) => {
                return payload.idRole == v.id
            })

            if (!payloadRole) {
                $reset
                appStore.addNotification('error', 'Error occured. Please login again.')
                router.push('/')
                return
            }

            id.value = payload.id
            username.value = payload.username
            role.value = payloadRole[0]
            iat.value = payload.iat
            exp.value = payload.exp
        }
    }

    const checkLoggedIn = async () => {
        getPayload()
        const timestamp = Math.ceil(Date.now() / 1000)
        if (timestamp > exp.value) {
            if (token.value != '')
                appStore.addNotification('info', 'Session Expired, please login again.')
            loggedIn.value = false
            $reset()
        } else {
            loggedIn.value = true
        }
        return loggedIn.value
    }

    const login = async (username: string, password: string) => {
        appStore.isLoading = true
        const url = import.meta.env.VITE_API_URL + '/login'

        const loginData = {
            username: username,
            password: password
        }

        const rs = await appStore.post<LoginSuccessResponse>(url, loginData)

        if (rs && !isErrorValidation(rs)) {
            newToken(rs.token)
            getPayload()

            appStore.addNotification('success', 'Login Sukses!')
        }

        appStore.isLoading = false
        router.push({ path: '/' })
    }

    const logout = () => {
        $reset()
        appStore.addNotification('info', 'Logout Berhasil, Terima Kasih')
        router.push({ name: 'Login' })
    }

    return {
        token,
        username,
        role,
        loggedIn,
        newToken,
        getPayload,
        checkLoggedIn,
        login,
        logout
    }
})
