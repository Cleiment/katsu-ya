<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
// import {
//     CheckIcon,
//     ChevronUpDownIcon,
//     ChevronDownIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon
// } from '@heroicons/vue/20/solid'

import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/AppStore'
import { useUserStore } from '@/stores/UserStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import UserTable from '@/components/tables/UserTable.vue'

import { modalSize, type User } from '@/tools/types'
import UserForm from '@/components/forms/UserForm.vue'
import FormModal from '@/components/FormModal.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const { getAll, createUser, editUser } = userStore

// window.addEventListener('keydown', (e) => {
//     e.stopPropagation()

//     const accept = ['/']

//     if (!accept.includes(e.key)) return

//     if (e.key == '/' && e.ctrlKey) {
//         document.getElementById('search')?.focus()
//     }
// })

// const selectedPage = ref(1)
// const searchInput = ref('')

// const showBeforePageButton = ref(false)
// const showNextPageButton = ref(false)

// const onSearch = () => {
//     if (selectedPage.value != 1) selectedPage.value = 1
//     filterBySearch(searchInput.value)
//     scrollUp()
// }

const isCreateModalOpen = ref(false)

function closeCreateModal() {
    isCreateModalOpen.value = false
    userStore.inputError = undefined
}

function openCreateModal() {
    isCreateModalOpen.value = true
}

const submitCreateUser = async (newDetail: User) => {
    appStore.isLoading = true
    if (await createUser(newDetail)) {
        await getAll()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const isDetailModalOpen = ref(false)

function closeDetailModal() {
    isDetailModalOpen.value = false
    userStore.inputError = undefined
}

function openDetailModal() {
    isDetailModalOpen.value = true
}

const submitEditUser = async (user: User) => {
    appStore.isLoading = true
    if (await editUser(user)) {
        await getAll()
        closeDetailModal()
    }
    appStore.isLoading = false
}

// watch(selectedPage, () => {
//     if (selectedPage.value != 1) {
//         showBeforePageButton.value = true
//     } else {
//         showBeforePageButton.value = false
//     }

//     if (selectedPage.value != userStore.pages) {
//         showNextPageButton.value = true
//     } else {
//         showNextPageButton.value = false
//     }

//     onPageChanged(selectedPage.value)
//     scrollUp()
// })

// watch(
//     () => userStore.pages,
//     (v) => {
//         if (v <= 1) showNextPageButton.value = false
//         else showNextPageButton.value = true
//     }
// )

const refresh = async () => {
    appStore.isLoading = true
    await getAll()
    closeCreateModal()
    closeDetailModal()
    appStore.isLoading = false
}

onMounted(async () => {
    await refresh()
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">User</h2>
            <BreadCrumbs />
        </div>
    </div>
    <div class="grow shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white px-4 py-4">
        <div class="flex justify-end">
            <button
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
                @click="openCreateModal"
            >
                Create User
            </button>
            <!-- <div class="flex gap-2 h-fit">
                <Menu as="div" class="relative">
                    <div>
                        <MenuButton
                            class="inline-flex w-full items-center justify-center rounded-md bg-orange-400/90 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                        >
                            Options

                            <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                        </MenuButton>
                    </div>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems
                            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
                        >
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                    <button
                                        :class="[
                                            active ? 'bg-orange-400 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                        ]"
                                    >
                                        Extract
                                    </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button
                                        :class="[
                                            active ? 'bg-orange-400 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                        ]"
                                    >
                                        Deactivate
                                    </button>
                                </MenuItem>
                            </div>
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }">
                                    <button
                                        :class="[
                                            active ? 'bg-orange-500 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                        ]"
                                    >
                                        Archive
                                    </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                    <button
                                        :class="[
                                            active ? 'bg-orange-500 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                        ]"
                                    >
                                        Move
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div> -->
        </div>
        <div class="overflow-y-auto h-fit max-h-[95%] my-4 transition-all duration-300 ease-out">
            <UserTable @show-detail="openDetailModal" />
        </div>
        <!-- <div class="flex">
            <div class="ms-auto flex space-x-2">
                <button class="menu" :disabled="!showBeforePageButton" @click="selectedPage--">
                    <ChevronLeftIcon class="w-6 h-6" />
                </button>
                <ul class="flex max-w-[232px] overflow-auto space-x-2 pb-2">
                    <li v-for="i in SPPStore.pages" :key="i">
                        <button
                            class="menu"
                            :class="selectedPage == i ? 'active' : ''"
                            @click="selectedPage = i"
                        >
                            {{ i }}
                        </button>
                    </li>
                </ul>
                <button class="menu" :disabled="!showNextPageButton" @click="selectedPage++">
                    <ChevronRightIcon class="w-6 h-6" />
                </button>
            </div>
        </div> -->
    </div>

    <FormModal
        title="Create User"
        :show="isCreateModalOpen"
        @cancel="closeCreateModal"
        :size="modalSize.sm"
    >
        <template v-slot:body>
            <UserForm
                mode="new"
                :user-detail="userStore.newUser"
                @submit="submitCreateUser"
                key="1"
            />
        </template>
    </FormModal>

    <FormModal
        title="User Detail"
        :show="isDetailModalOpen"
        @cancel="closeDetailModal"
        :size="modalSize.md"
    >
        <template v-slot:body>
            <UserForm
                mode="edit"
                :user-detail="userStore.selectedUser"
                @submit="submitEditUser"
                @refresh="refresh"
                key="2"
            />
        </template>
    </FormModal>
</template>
