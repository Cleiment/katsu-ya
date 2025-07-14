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
import { useIngredientTransactionStore } from '@/stores/IngredientTransactionStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import IngredientTransactionTable from '@/components/tables/IngredientTransactionTable.vue'

import { modalSize, type IngredientTransaction } from '@/tools/types'
import IngredientTransactionForm from '@/components/forms/IngredientTransactionForm.vue'
import FormModal from '@/components/FormModal.vue'

const appStore = useAppStore()
const ingredientTransactionStore = useIngredientTransactionStore()
const { getAll, createIngredientTransaction, editIngredientTransaction } =
    ingredientTransactionStore

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
    ingredientTransactionStore.inputError = undefined
}

function openCreateModal() {
    isCreateModalOpen.value = true
}

const submitCreateIngredientTransaction = async (newDetail: IngredientTransaction) => {
    appStore.isLoading = true
    if (await createIngredientTransaction(newDetail)) {
        await getAll()
        closeCreateModal()
    }
    appStore.isLoading = false
}

const isDetailModalOpen = ref(false)

function closeDetailModal() {
    isDetailModalOpen.value = false
    ingredientTransactionStore.inputError = undefined
}

function openDetailModal() {
    isDetailModalOpen.value = true
}

const submitEditIngredientTransaction = async (ingredientTransaction: IngredientTransaction) => {
    appStore.isLoading = true
    if (await editIngredientTransaction(ingredientTransaction)) {
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

//     if (selectedPage.value != ingredientTransactionStore.pages) {
//         showNextPageButton.value = true
//     } else {
//         showNextPageButton.value = false
//     }

//     onPageChanged(selectedPage.value)
//     scrollUp()
// })

// watch(
//     () => ingredientTransactionStore.pages,
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
            <h2 class="font-bold mb-1">Ingredient Transaction</h2>
            <BreadCrumbs />
        </div>
        <div class="flex items-center space-x-2">
            <router-link
                to="/ingredient"
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
            >
                Back
            </router-link>
        </div>
    </div>
    <div class="grow shadow-lg rounded-md w-full border-t-4 border-rose-500 bg-white px-4 py-4">
        <div class="flex justify-end">
            <button
                class="rounded-md px-4 py-2 text-sm font-medium bg-slate-700 text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 focus-visible:ring-amber-500"
                @click="openCreateModal"
            >
                Create Ingredient Transaction
            </button>
        </div>
        <div class="overflow-y-auto h-fit max-h-[95%] my-4 transition-all duration-300 ease-out">
            <IngredientTransactionTable @show-detail="openDetailModal" />
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
        title="Create Ingredient Transaction"
        :show="isCreateModalOpen"
        @cancel="closeCreateModal"
        :size="modalSize.sm"
    >
        <template v-slot:body>
            <IngredientTransactionForm
                mode="new"
                :ingredient-transaction-detail="ingredientTransactionStore.newIngredientTransaction"
                @submit="submitCreateIngredientTransaction"
                key="1"
            />
        </template>
    </FormModal>

    <FormModal
        title="Ingredient Transaction Detail"
        :show="isDetailModalOpen"
        @cancel="closeDetailModal"
        :size="modalSize.md"
    >
        <template v-slot:body>
            <IngredientTransactionForm
                mode="edit"
                :ingredient-transaction-detail="
                    ingredientTransactionStore.selectedIngredientTransaction
                "
                @submit="submitEditIngredientTransaction"
                @refresh="refresh"
                key="2"
            />
        </template>
    </FormModal>
</template>
