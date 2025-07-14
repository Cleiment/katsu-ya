<template>
    <div
        class="flex items-center py-2 px-4"
        :class="appStore.isUsingSidebar ? 'lg:hidden justify-between' : 'justify-center'"
    >
        <button
            role="button"
            @click="appStore.toggleSidebar"
            :class="{ hidden: !appStore.isUsingSidebar }"
        >
            <Bars3Icon class="w-7 h-7" />
        </button>
        <div class="flex items-center">
            <img src="/src/logo.jpg" width="40" alt="Logo" class="" />
            <p class="font-bold">Katsu-Ya</p>
        </div>
        <span class="w-7" :class="{ hidden: !appStore.isUsingSidebar }"></span>
    </div>
    <div
        class="transition-margin duration-300 ease-out w-screen absolute w-100 sm:w-[274px] lg:ms-0 lg:static h-full overflow-y-auto shadow-xl flex flex-col z-20"
        :class="{ ['-ms-[100vw]']: !appStore.sidebarActive, ['hidden']: !appStore.isUsingSidebar }"
    >
        <div class="py-3 px-4 bg-red-500 flex items-center gap-2 text-white">
            <img src="/src/logo.jpg" width="40" alt="Logo" class="" />
            <a href="/" class="text-xl font-semibold">Katsu-Ya</a>
            <button class="lg:hidden ms-auto" @click="appStore.toggleSidebar">
                <XMarkIcon class="w-7 h-7" />
            </button>
        </div>
        <div class="pb-2 px-4 bg-rose-200 md:bg-rose-200 grow flex flex-col">
            <div
                class="py-3 border-b border-slate-800/50 flex gap-2 items-center"
                :title="authStore.username"
            >
                <div>
                    <div class="bg-slate-600 text-white w-8 h-8 rounded-full flex">
                        <UserIcon class="w-5 m-auto" />
                    </div>
                </div>
                <p
                    class="whitespace-nowrap overflow-hidden text-sm text-ellipsis cursor-default font-semibold"
                >
                    {{ authStore.username }}
                </p>
            </div>
            <div class="flex flex-col my-2" v-if="!authStore.loggedIn">
                <RouterLink to="/login" class="sidebar-menu active">
                    <ArrowLeftEndOnRectangleIcon class="w-6" />
                    Login
                </RouterLink>
            </div>
            <div
                class="flex flex-col h-full my-2 gap-2 text-sm font-medium"
                v-else-if="authStore.role !== undefined"
            >
                <template v-for="(item, i) in authStore.role.menu" :key="i">
                    <router-link
                        :to="item.to"
                        class="sidebar-menu"
                        active-class="active"
                        :class="
                            item.activeLinks && item.activeLinks.some((v) => v == route.fullPath)
                                ? 'active'
                                : ''
                        "
                    >
                        <component :is="item.icon" class="h-5 w-5"></component>
                        {{ item.title }}
                    </router-link>
                </template>
                <div class="mt-auto pt-4 pb-2 flex flex-col border-t border-slate-800/50">
                    <router-link to="/logout" class="text-start text-sm sidebar-menu active">
                        <ArrowRightStartOnRectangleIcon class="w-6" />
                        Logout
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div
        class="absolute left-0 h-full w-full lg:hidden z-10"
        :class="{ ['-ms-[100vw]']: !appStore.sidebarActive }"
        @click="appStore.toggleSidebar"
    ></div>
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import {
    ArrowLeftEndOnRectangleIcon,
    ArrowRightStartOnRectangleIcon,
    UserIcon,
    XMarkIcon,
    Bars3Icon
} from '@heroicons/vue/24/solid'
import { useAppStore } from '@/stores/AppStore'

const authStore = useAuthStore()
const appStore = useAppStore()

const route = useRoute()
</script>

<style scoped></style>
