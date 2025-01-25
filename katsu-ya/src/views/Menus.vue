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
import { useMenuStore } from '@/stores/MenuStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import MenuTable from '@/components/tables/MenuTable.vue'

import { modalSize, type Menu } from '@/tools/types'
import MenuForm from '@/components/forms/MenuForm.vue'
import FormModal from '@/components/FormModal.vue'
import Modal from '@/components/Modal.vue'

const appStore = useAppStore()
const menuStore = useMenuStore()
const { getAll, createMenu, editMenu } = menuStore

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
    menuStore.inputError = undefined
}

function openCreateModal() {
    isCreateModalOpen.value = true
}

const isDetailModalOpen = ref(false)

function closeDetailModal() {
    isDetailModalOpen.value = false
    menuStore.inputError = undefined
}

function openDetailModal() {
    isDetailModalOpen.value = true
}

const isMenuIngredientModalOpen = ref(false)

function closeMenuIngredientModal() {
    isMenuIngredientModalOpen.value = false
    menuStore.inputError = undefined
}

function openMenuIngredientModal() {
    isMenuIngredientModalOpen.value = true
}

const submitCreateMenu = async (newDetail: Menu) => {
    appStore.isLoading = true
    if (await createMenu(newDetail)) {
        await getAll()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const submitEditMenu = async (menu: Menu) => {
    appStore.isLoading = true
    if (await editMenu(menu)) {
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

//     if (selectedPage.value != menuStore.pages) {
//         showNextPageButton.value = true
//     } else {
//         showNextPageButton.value = false
//     }

//     onPageChanged(selectedPage.value)
//     scrollUp()
// })

// watch(
//     () => menuStore.pages,
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
            <h2 class="font-bold mb-1">Menu</h2>
            <BreadCrumbs />
        </div>
    </div>
    <div
        class="lg:h-[88%] md:h-[83%] h-[81%] shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4"
    >
        <div class="flex justify-end">
            <button
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
                @click="openCreateModal"
            >
                Create Menu
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
            <MenuTable
                mode="manage"
                @show-detail="openDetailModal"
                @show-menu-ingredient="openMenuIngredientModal"
            />
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
        title="Create Menu"
        :show="isCreateModalOpen"
        @cancel="closeCreateModal"
        :size="modalSize.lg"
        key="1"
    >
        <template v-slot:body>
            <MenuForm mode="new" :menu-detail="menuStore.newMenu" @submit="submitCreateMenu" />
        </template>
    </FormModal>

    <FormModal
        title="Menu Detail"
        :show="isDetailModalOpen"
        @cancel="closeDetailModal"
        :size="modalSize.lg"
        key="2"
    >
        <template v-slot:body>
            <MenuForm
                mode="edit"
                :menu-detail="menuStore.selectedMenu"
                @submit="submitEditMenu"
                @refresh="refresh"
            />
        </template>
    </FormModal>

    <Modal
        title="Menu's Ingredients"
        :show="isMenuIngredientModalOpen"
        @cancel="closeMenuIngredientModal"
        :size="modalSize.sm"
        key="3"
    >
        <template v-slot:body>
            <table class="table w-full font-normal table-auto relative">
                <thead class="top-0 shadow bg-white rounded">
                    <tr>
                        <th class="text-center px-3 py-2" width="5%">No</th>
                        <th>Ingredient</th>
                        <th class="text-center">Needs</th>
                        <th class="text-center">Available</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(ingredient, i) in menuStore.selectedMenu.ingredients"
                        :key="i"
                        class="border-b hover:bg-rose-400/20"
                        :class="
                            ingredient.ingredient.status == 0 ||
                            ingredient.ingredient.qty < ingredient.qty
                                ? 'bg-red-500/80 text-white hover:bg-red-500'
                                : 'hover:bg-rose-400/20'
                        "
                    >
                        <td class="text-center px-3 py-2">{{ i + 1 }}</td>
                        <td>{{ ingredient.ingredient.name }}</td>
                        <td class="text-center">{{ ingredient.qty }}</td>
                        <td class="text-center">{{ ingredient.ingredient.qty }}</td>
                    </tr>
                </tbody>
            </table>
        </template>
    </Modal>
</template>
