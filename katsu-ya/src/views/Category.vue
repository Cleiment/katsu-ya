<!-- eslint-disable vue/multi-word-component-names -->

<script lang="ts" setup>
import { Menu as MenuParent, MenuItem, MenuItems, MenuButton } from '@headlessui/vue'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { modalSize, TableLimits, type Category, type TableLimit } from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useCategoryStore } from '@/stores/CategoryStore'

import BreadCrumbs from '@/components/BreadCrumbs.vue'
import CategoryTable from '@/components/tables/CategoryTable.vue'
import CategoryForm from '@/components/forms/CategoryForm.vue'
import FormModal from '@/components/FormModal.vue'
import LimitListbox from '@/components/LimitListbox.vue'

const appStore = useAppStore()
const categoryStore = useCategoryStore()
const { fetchData, createCategory, editCategory } = categoryStore

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
    categoryStore.inputError = undefined
}

function openCreateModal() {
    isCreateModalOpen.value = true
}

const isDetailModalOpen = ref(false)

function closeDetailModal() {
    isDetailModalOpen.value = false
    categoryStore.inputError = undefined
}

function openDetailModal() {
    isDetailModalOpen.value = true
}

const submitCreateCategory = async (newDetail: Category) => {
    appStore.isLoading = true
    if (await createCategory(newDetail)) {
        await fetchData()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const submitEditCategory = async (category: Category) => {
    appStore.isLoading = true
    if (await editCategory(category)) {
        await fetchData()
        closeDetailModal()
    }
    appStore.isLoading = false
}

watch<[number, TableLimit]>(
    () => [categoryStore.currentPage, categoryStore.selectedLimit],
    async ([newPage, newLimit]) => {
        router.replace({
            query: {
                ...route.query,
                page: newPage.toString(),
                limit: newLimit.toString()
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

    const qPage = parseInt(route.query.page as string)
    const qLimit = parseInt(route.query.limit as string)

    if (!isNaN(qPage) && qPage > 0) categoryStore.currentPage = qPage
    if (!isNaN(qLimit) && TableLimits.includes(qLimit as TableLimit))
        categoryStore.selectedLimit = qLimit as TableLimit
})

appStore.isLoading = false
</script>
<style scoped></style>

<template>
    <div class="flex justify-between items-end mb-3">
        <div>
            <h2 class="font-bold mb-1">Category</h2>
            <BreadCrumbs />
        </div>
        <div class="flex items-center space-x-2">
            <router-link
                to="/menu"
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
            >
                Back
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
                    <LimitListbox v-model="categoryStore.selectedLimit" />
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
                                        Create Category
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </MenuParent>
            </div>
        </div>
        <div
            class="overflow-y-auto min-h-64 my-4 transition-all duration-300 ease-out grow"
            ref="tableRef"
        >
            <CategoryTable mode="manage" @show-detail="openDetailModal" />
        </div>
        <div class="flex justify-center">
            <div class="flex flex-col items-center">
                <span class="text-sm flex items-end mb-2">
                    Showing {{ categoryStore.offset + 1 }}-{{
                        categoryStore.offset + categoryStore.selectedLimit > categoryStore.total
                            ? categoryStore.total
                            : categoryStore.offset + categoryStore.selectedLimit
                    }}
                    of {{ categoryStore.total }}
                </span>
                <div class="flex space-x-2 -mb-2">
                    <button
                        class="menu"
                        :disabled="categoryStore.currentPage === 1"
                        @click="categoryStore.currentPage--"
                    >
                        <ChevronLeftIcon class="w-5 h-5" />
                    </button>
                    <ul class="flex max-w-[232px] overflow-auto space-x-2 pb-2">
                        <li v-for="i in categoryStore.totalPages" :key="i">
                            <button
                                class="menu"
                                :class="categoryStore.currentPage == i ? 'active' : ''"
                                @click="categoryStore.currentPage = i"
                            >
                                {{ i }}
                            </button>
                        </li>
                    </ul>
                    <button
                        class="menu"
                        :disabled="categoryStore.currentPage >= categoryStore.totalPages"
                        @click="categoryStore.currentPage++"
                    >
                        <ChevronRightIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <FormModal
        title="Create Category"
        :show="isCreateModalOpen"
        @cancel="closeCreateModal"
        :size="modalSize.sm"
        key="1"
    >
        <template v-slot:body>
            <CategoryForm
                mode="new"
                :category-detail="categoryStore.newCategory"
                @submit="submitCreateCategory"
            />
        </template>
    </FormModal>

    <FormModal
        title="Category Detail"
        :show="isDetailModalOpen"
        @cancel="closeDetailModal"
        :size="modalSize.sm"
        key="2"
    >
        <template v-slot:body>
            <CategoryForm
                mode="edit"
                :category-detail="categoryStore.selectedCategory"
                @submit="submitEditCategory"
                @refresh="refresh"
            />
        </template>
    </FormModal>
</template>
