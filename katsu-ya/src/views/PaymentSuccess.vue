<template>
    <div class="flex min-h-full flex-col px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center pt-24">
            <CheckBadgeIcon class="h-32 w-32 text-emerald-500" />
            <h2 class="text-center text-2xl font-bold leading-6 tracking-tight text-gray-900 mb-2">
                Payment Success
            </h2>
            <p class="text-center">Thank you for Dining in Katsu-Ya</p>
            <p>
                Click
                <router-link
                    class="text-emerald-500 hover:text-emerald-700 transition duration-100"
                    :to="'/struk/' + route.params.id"
                    >here</router-link
                >
                to view the receipt.
            </p>
            <p>Or</p>
            <p>
                Click
                <button
                    class="text-blue-400 hover:text-blue-700 transition duration-100"
                    @click="router.back()"
                >
                    here
                </button>
                to go back
            </p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores/AppStore'
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const appStore = useAppStore()
appStore.isLoading = false
appStore.isUsingSidebar = false
</script>

<style lang="scss" scoped></style>
