<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex min-h-full flex-col px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                class="shadow-lg rounded-full mb-4 mx-auto h-[8rem] w-auto"
                src="/src/logo.jpg"
                alt="Katsu-Ya"
            />
            <h2 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Login ke akun anda
            </h2>
        </div>

        <div
            class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm shadow-lg rounded overflow-hidden border-t-4 border-rose-500 bg-white p-4"
        >
            <form
                class="space-y-4"
                method="POST"
                @submit.prevent="authStore.login(username, password)"
            >
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
                        Username
                    </label>
                    <div class="mt-2">
                        <input
                            id="username"
                            name="username"
                            type="username"
                            v-model="username"
                            autocomplete="username"
                            required
                            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-400 sm:text-sm sm:leading-6 transition-all duration-200"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label
                            for="password"
                            class="block text-sm font-medium leading-6 text-gray-900"
                            >Password</label
                        >
                    </div>
                    <div class="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            v-model="password"
                            autocomplete="current-password"
                            required
                            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-rose-400 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-slate-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-pastel-600"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useAppStore } from '@/stores/AppStore'

const emit = defineEmits(['changeSidebarMenu'])

const appStore = useAppStore()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

emit('changeSidebarMenu', 1)
appStore.isLoading = false
</script>
<style scoped></style>
