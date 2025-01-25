<script setup lang="ts">
import { type IngredientUnit } from '@/tools/types'
import { useAppStore } from '@/stores/AppStore'
import { useIngredientUnitStore } from '@/stores/IngredientUnitStore'
import { ref } from 'vue'
import ConfirmationModal from '../ConfirmationModal.vue'

const appStore = useAppStore()
const ingredientUnitStore = useIngredientUnitStore()

const emits = defineEmits(['submit', 'refresh'])
const props = defineProps<{
    ingredientUnitDetail: IngredientUnit
    mode: 'new' | 'edit'
}>()

const newDetail: IngredientUnit = JSON.parse(JSON.stringify(props.ingredientUnitDetail))

const isToggleDataConfirmationOpen = ref(false)
const toggleIngredientUnitStatus = async (id: number, status: number) => {
    appStore.isLoading = true
    if (status == 1) await ingredientUnitStore.deactivateIngredientUnit(id)
    else if (status == 0) await ingredientUnitStore.activateIngredientUnit(id)
    isToggleDataConfirmationOpen.value = false
    emits('refresh')
}
</script>
<template>
    <form action="" @submit.prevent="emits('submit', newDetail)" v-if="ingredientUnitDetail">
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
                        ingredientUnitStore.inputError &&
                        ingredientUnitStore.inputError.error.validation.name
                    "
                >
                    <p
                        v-for="(error, i) in ingredientUnitStore.inputError.error.validation.name"
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
                    v-if="ingredientUnitDetail.status == 1"
                    type="button"
                    @click="isToggleDataConfirmationOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                    Deactivate
                </button>
                <button
                    v-else-if="ingredientUnitDetail.status == 0"
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
        :title="
            ingredientUnitDetail.status == 1
                ? 'Deactivate Ingredient Unit'
                : 'Activate Ingredient Unit'
        "
        :text="
            ingredientUnitDetail.status == 1
                ? 'Are you sure you want to deactivate ingredient unit?'
                : 'Are you sure you want to activate ingredient unit?'
        "
        @cancel="isToggleDataConfirmationOpen = false"
        @ok="toggleIngredientUnitStatus(ingredientUnitDetail.id!, ingredientUnitDetail.status)"
    />
</template>

<style scoped></style>
