<script setup lang="ts">
import { type Category } from '@/tools/types'
import { useAppStore } from '@/stores/AppStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { ref } from 'vue'
import ConfirmationModal from '../ConfirmationModal.vue'

const appStore = useAppStore()
const categoryStore = useCategoryStore()

const emits = defineEmits(['submit', 'refresh'])
const props = defineProps<{
    categoryDetail: Category
    mode: 'new' | 'edit'
}>()

const newDetail: Category = JSON.parse(JSON.stringify(props.categoryDetail))

const isToggleDataConfirmationOpen = ref(false)
const toggleCategoryStatus = async (id: number, status: number) => {
    appStore.isLoading = true
    if (status == 1) await categoryStore.deactivateCategory(id)
    else if (status == 0) await categoryStore.activateCategory(id)
    isToggleDataConfirmationOpen.value = false
    emits('refresh')
}
</script>
<template>
    <form action="" @submit.prevent="emits('submit', newDetail)" v-if="categoryDetail">
        <div class="grid grid-cols-1 gap-x-2 gap-y-2">
            <div>
                <label
                    for="name"
                    class="block lg:text-sm text-xs font-medium leading-6 text-gray-900"
                >
                    Name
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastelyellow-pastel"
                >
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autocomplete="off"
                        class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 text-xs md:text-sm md:leading-6"
                        placeholder="Name"
                        autocapitalize="characters"
                        v-model="newDetail.name"
                    />
                </div>
                <template
                    v-if="
                        categoryStore.inputError && categoryStore.inputError.error.validation.name
                    "
                >
                    <p
                        v-for="(error, i) in categoryStore.inputError.error.validation.name"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>
        </div>

        <div class="mt-4 flex space-x-2 justify-end">
            <template v-if="mode == 'edit'">
                <button
                    v-if="categoryDetail.status == 1"
                    type="button"
                    @click="isToggleDataConfirmationOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                    Deactivate
                </button>
                <button
                    v-else-if="categoryDetail.status == 0"
                    type="button"
                    @click="isToggleDataConfirmationOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                    Activate
                </button>
            </template>
            <button
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
                Submit
            </button>
        </div>
    </form>

    <ConfirmationModal
        :show="isToggleDataConfirmationOpen"
        :title="categoryDetail.status == 1 ? 'Deactivate Category' : 'Activate Category'"
        :text="
            categoryDetail.status == 1
                ? 'Are you sure you want to deactivate category?'
                : 'Are you sure you want to activate category?'
        "
        @cancel="isToggleDataConfirmationOpen = false"
        @ok="toggleCategoryStatus(categoryDetail.id!, categoryDetail.status)"
    />
</template>

<style scoped></style>
