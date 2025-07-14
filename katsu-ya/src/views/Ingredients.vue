<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
import { Menu as MenuParent, MenuItem, MenuItems, MenuButton } from '@headlessui/vue'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { modalSize, TableLimits, type Ingredient, type TableLimit } from '@/tools/types'

import { useAuthStore } from '@/stores/AuthStore'
import { useAppStore } from '@/stores/AppStore'
import { useIngredientStore } from '@/stores/IngredientStore'

import BreadCrumbs from '@/components/BreadCrumbs.vue'
import IngredientTable from '@/components/tables/IngredientTable.vue'
import IngredientForm from '@/components/forms/IngredientForm.vue'
import FormModal from '@/components/FormModal.vue'
import LimitListbox from '@/components/LimitListbox.vue'
import { useIngredientUnitStore } from '@/stores/IngredientUnitStore'
import SwitchButton from '@/components/SwitchButton.vue'

const appStore = useAppStore()
const authStore = useAuthStore()
const unitStore = useIngredientUnitStore()
const ingredientStore = useIngredientStore()

const { fetchData, createIngredient, editIngredient } = ingredientStore

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
    ingredientStore.inputError = undefined
}

function openCreateModal() {
    isCreateModalOpen.value = true
}

const isDetailModalOpen = ref(false)

function closeDetailModal() {
    isDetailModalOpen.value = false
    ingredientStore.inputError = undefined
}

function openDetailModal() {
    isDetailModalOpen.value = true
}

const submitCreateIngredient = async (newDetail: Ingredient) => {
    appStore.isLoading = true
    if (await createIngredient(newDetail)) {
        await fetchData()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const submitEditIngredient = async (ingredient: Ingredient) => {
    appStore.isLoading = true
    if (await editIngredient(ingredient)) {
        await fetchData()
        closeDetailModal()
    }
    appStore.isLoading = false
}

watch<[number, TableLimit, boolean]>(
    () => [
        ingredientStore.currentPage,
        ingredientStore.selectedLimit,
        ingredientStore.showDeactivated
    ],
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

    await unitStore.getAll()

    const qPage = parseInt(route.query.page as string)
    const qLimit = parseInt(route.query.limit as string)

    if (!isNaN(qPage) && qPage > 0) ingredientStore.currentPage = qPage
    if (!isNaN(qLimit) && TableLimits.includes(qLimit as TableLimit))
        ingredientStore.selectedLimit = qLimit as TableLimit
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">Ingredient</h2>
            <BreadCrumbs />
        </div>
        <div class="flex items-center space-x-2">
            <router-link
                v-if="authStore.role?.id == 2"
                to="/ingredient-transaction"
                class="rounded-md px-4 py-2 text-sm font-medium bg-blue-500 text-white transition-all duration-300 hover:shadow-lg hover:bg-blue-700 focus-visible:ring-amber-500"
            >
                Transaction
            </router-link>
            <router-link
                to="/ingredient-unit"
                class="rounded-md px-4 py-2 text-sm font-medium bg-red-500 text-white transition-all duration-300 hover:shadow-lg hover:bg-rose-700 focus-visible:ring-amber-500"
            >
                Units
            </router-link>
        </div>
    </div>
    <div
        class="grow shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white p-4 flex flex-col"
    >
        <div class="flex justify-between items-start">
            <div class="flex gap-2">
                <div>
                    <p class="text-sm">Limit</p>
                    <LimitListbox v-model="ingredientStore.selectedLimit" />
                </div>
                <div class="border"></div>
                <div>
                    <SwitchButton
                        v-model="ingredientStore.showDeactivated"
                        title="Show Deactivated"
                    />
                </div>
            </div>
            <div class="flex gap-2 h-fit">
                <MenuParent as="div" class="relative">
                    <div>
                        <MenuButton
                            class="inline-flex w-full items-center justify-center rounded-md bg-slate-700/90 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
                            class="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50"
                        >
                            <div class="px-1 py-1">
                                <MenuItem v-slot="{ active }" as="div">
                                    <button
                                        :class="[
                                            active ? 'bg-slate-700 text-white' : 'text-gray-900',
                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm transition'
                                        ]"
                                        @click="openCreateModal"
                                    >
                                        Create Ingredient
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </MenuParent>
            </div>
        </div>
        <div
            class="overflow-y-auto h-64 my-4 transition-all duration-300 ease-out grow"
            ref="tableRef"
        >
            <IngredientTable @show-detail="openDetailModal" />
        </div>
        <div class="flex justify-center">
            <div class="flex flex-col items-center">
                <span class="text-sm flex items-end mb-2">
                    Showing {{ ingredientStore.offset + 1 }}-{{
                        ingredientStore.offset + ingredientStore.selectedLimit >
                        ingredientStore.total
                            ? ingredientStore.total
                            : ingredientStore.offset + ingredientStore.selectedLimit
                    }}
                    of {{ ingredientStore.total }}
                </span>
                <div class="flex space-x-2 -mb-2">
                    <button
                        class="menu"
                        :disabled="ingredientStore.currentPage === 1"
                        @click="ingredientStore.currentPage--"
                    >
                        <ChevronLeftIcon class="w-5 h-5" />
                    </button>
                    <ul class="flex max-w-[232px] overflow-auto space-x-2 pb-2">
                        <li v-for="i in ingredientStore.totalPages" :key="i">
                            <button
                                class="menu"
                                :class="ingredientStore.currentPage == i ? 'active' : ''"
                                @click="ingredientStore.currentPage = i"
                            >
                                {{ i }}
                            </button>
                        </li>
                    </ul>
                    <button
                        class="menu"
                        :disabled="ingredientStore.currentPage >= ingredientStore.totalPages"
                        @click="ingredientStore.currentPage++"
                    >
                        <ChevronRightIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <FormModal
        title="Create Ingredient"
        :show="isCreateModalOpen"
        @cancel="closeCreateModal"
        :size="modalSize.sm"
    >
        <template v-slot:body>
            <IngredientForm
                mode="new"
                :ingredient-detail="ingredientStore.newIngredient"
                @submit="submitCreateIngredient"
                key="1"
            />
        </template>
    </FormModal>

    <FormModal
        title="Ingredient Detail"
        :show="isDetailModalOpen"
        @cancel="closeDetailModal"
        :size="modalSize.sm"
    >
        <template v-slot:body>
            <IngredientForm
                mode="edit"
                :ingredient-detail="ingredientStore.selectedIngredient"
                @submit="submitEditIngredient"
                @refresh="refresh"
                key="2"
            />
        </template>
    </FormModal>
</template>
