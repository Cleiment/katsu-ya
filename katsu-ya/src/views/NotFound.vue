<template>
    <div class="flex min-h-full flex-col px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center pt-24">
            <img
                class="shadow-lg rounded-full mb-4 mx-auto h-[8rem] w-auto"
                src="/src/logo.jpg"
                alt="Katsu-Ya"
            />
            <h2 class="text-center text-2xl font-bold leading-6 tracking-tight text-gray-900 mb-2">
                Oops...
            </h2>
            <p class="text-center">Looks like the page you find is not available.</p>
            <p>
                Click
                <router-link
                    class="text-emerald-500 hover:text-emerald-700 transition duration-100"
                    to="/"
                    >here</router-link
                >
                to go back
            </p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/AppStore'

const appStore = useAppStore()
appStore.isLoading = false
</script>

<style lang="scss" scoped></style>
