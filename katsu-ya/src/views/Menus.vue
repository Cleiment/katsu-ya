<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
import { Menu as MenuParent, MenuItem, MenuItems, MenuButton } from '@headlessui/vue'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { modalSize, TableLimits, type Menu, type TableLimit } from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'

import BreadCrumbs from '@/components/BreadCrumbs.vue'
import MenuTable from '@/components/tables/MenuTable.vue'
import MenuForm from '@/components/forms/MenuForm.vue'
import FormModal from '@/components/FormModal.vue'
import Modal from '@/components/Modal.vue'
import LimitListbox from '@/components/LimitListbox.vue'
import SwitchButton from '@/components/SwitchButton.vue'
import { useIngredientStore } from '@/stores/IngredientStore'
import { useCategoryStore } from '@/stores/CategoryStore'

const appStore = useAppStore()
const menuStore = useMenuStore()
const ingredientStore = useIngredientStore()
const categoryStore = useCategoryStore()
const { fetchData, createMenu, editMenu } = menuStore

const tableRef = ref<HTMLDivElement>()

const route = useRoute()
const router = useRouter()

// window.addEventListener('keydown', (e) => {
//     e.stopPropagation()

//     const accept = ['/']

//     if (!accept.includes(e.key)) return

//     if (e.key == '/' && e.ctrlKey) {
//         document.getElementById('search')?.focus()
//     }
// })

// const searchInput = ref('')

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
        await fetchData()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const submitEditMenu = async (menu: Menu) => {
    appStore.isLoading = true
    if (await editMenu(menu)) {
        await fetchData()
        closeDetailModal()
    }
    appStore.isLoading = false
}

watch<[number, TableLimit, boolean]>(
    () => [menuStore.currentPage, menuStore.selectedLimit, menuStore.showDeactivated],
    async ([newPage, newLimit, newShowDeactivated]) => {
        router.replace({
            query: {
                ...route.query,
                page: newPage.toString(),
                limit: newLimit.toString(),
                show_deactivated: newShowDeactivated.toString()
            }
        })
        await fetchData()
        scrollUp()
    }
)

const scrollUp = () => {
    if (tableRef.value) {
        tableRef.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

const refresh = async () => {
    appStore.isLoading = true
    await fetchData()
    closeCreateModal()
    closeDetailModal()
    appStore.isLoading = false
}

onMounted(async () => {
    await refresh()

    await ingredientStore.getAll()
    await categoryStore.getAll()

    const qPage = parseInt(route.query.page as string)
    const qLimit = parseInt(route.query.limit as string)

    if (!isNaN(qPage) && qPage > 0) menuStore.currentPage = qPage
    if (!isNaN(qLimit) && TableLimits.includes(qLimit as TableLimit))
        menuStore.selectedLimit = qLimit as TableLimit
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
        <div class="flex items-center space-x-2">
            <router-link
                to="/category"
                class="rounded-md px-4 py-2 text-sm font-medium bg-emerald-500 text-white transition-all duration-300 hover:shadow-lg hover:bg-emerald-600 focus-visible:ring-amber-500"
            >
                Category
            </router-link>
        </div>
    </div>
    <div
        class="grow shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4 flex flex-col"
    >
        <div class="flex justify-between items-start">
            <div class="flex gap-x-2">
                <div>
                    <p class="text-sm">Limit</p>
                    <LimitListbox v-model="menuStore.selectedLimit" />
                </div>
                <span class="border"></span>
                <div>
                    <SwitchButton v-model="menuStore.showDeactivated" title="Show Deactivated" />
                </div>
            </div>
            <div class="flex gap-2 h-fit">
                <button
                    class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
                    @click="openCreateModal"
                >
                    Create Menu
                </button>
            </div>
        </div>
        <div
            class="overflow-y-auto h-64 my-4 transition-all duration-300 ease-out grow"
            ref="tableRef"
        >
            <MenuTable
                mode="manage"
                @show-detail="openDetailModal"
                @show-menu-ingredient="openMenuIngredientModal"
            />
        </div>
        <div class="flex justify-center">
            <div class="flex flex-col items-center">
                <span class="text-sm flex items-end mb-2">
                    Showing {{ menuStore.offset + 1 }}-{{
                        menuStore.offset + menuStore.selectedLimit > menuStore.total
                            ? menuStore.total
                            : menuStore.offset + menuStore.selectedLimit
                    }}
                    of {{ menuStore.total }}
                </span>
                <div class="flex space-x-2 -mb-2">
                    <button
                        class="menu"
                        :disabled="menuStore.currentPage === 1"
                        @click="menuStore.currentPage--"
                    >
                        <ChevronLeftIcon class="w-5 h-5" />
                    </button>
                    <ul class="flex max-w-[232px] overflow-auto space-x-2 pb-2">
                        <li v-for="i in menuStore.totalPages" :key="i">
                            <button
                                class="menu"
                                :class="menuStore.currentPage == i ? 'active' : ''"
                                @click="menuStore.currentPage = i"
                            >
                                {{ i }}
                            </button>
                        </li>
                    </ul>
                    <button
                        class="menu"
                        :disabled="menuStore.currentPage >= menuStore.totalPages"
                        @click="menuStore.currentPage++"
                    >
                        <ChevronRightIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
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
