<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

import { type Ingredient, type IngredientTransaction } from '@/tools/types'
import { useAppStore } from '@/stores/AppStore'
import { useIngredientTransactionStore } from '@/stores/IngredientTransactionStore'
import { ref } from 'vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { useIngredientStore } from '@/stores/IngredientStore'

const appStore = useAppStore()
const ingredientStore = useIngredientStore()
const ingredientTransactionStore = useIngredientTransactionStore()

const emits = defineEmits(['submit', 'refresh'])
const props = defineProps<{
    ingredientTransactionDetail: IngredientTransaction
    mode: 'new' | 'edit'
}>()

const newDetail: IngredientTransaction = JSON.parse(
    JSON.stringify(props.ingredientTransactionDetail)
)

const ingredientStatus = (items: Ingredient[]) => {
    return items.filter((v) => {
        return v.status == 1
    })
}

const isDeleteDataOpen = ref(false)
const deleteData = async (id: number) => {
    if (
        props.ingredientTransactionDetail.stockUsage &&
        props.ingredientTransactionDetail.stockUsage.id
    ) {
        appStore.addNotification('error', "Ingredient used in transaction can't be deleted.")
    } else {
        appStore.isLoading = true
        await ingredientTransactionStore.deleteIngredientTransaction(id)
        isDeleteDataOpen.value = false
        appStore.isLoading = false
        emits('refresh')
    }
}
</script>
<template>
    <form @submit.prevent="emits('submit', newDetail)" v-if="ingredientTransactionDetail">
        <div class="grid grid-cols-1 gap-x-2 gap-y-2">
            <div>
                <label for="ingredient" class="block text-sm font-medium leading-6 text-gray-900">
                    Ingredient
                </label>
                <Listbox v-model="newDetail.ingredient" class="flex" aria-required="true" by="id">
                    <div class="relative">
                        <ListboxButton
                            id="ingredients"
                            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                        >
                            <span class="block truncate">{{
                                newDetail.ingredient?.name || 'Select...'
                            }}</span>
                            <span
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                            >
                                <ChevronUpDownIcon
                                    class="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </ListboxButton>

                        <transition
                            enter-active-class="transition duration-100 ease-in"
                            enter-from-class="opacity-0"
                            enter-to-class="opacity-100"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                        >
                            <ListboxOptions
                                class="absolute w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                            >
                                <ListboxOption
                                    v-slot="{ active, selected }"
                                    v-for="item in ingredientStatus(ingredientStore.data)"
                                    :key="item.id"
                                    :value="item"
                                    as="template"
                                    class="transition duration-100"
                                >
                                    <li
                                        :class="[
                                            selected
                                                ? 'text-amber-800 bg-amber-100'
                                                : active
                                                  ? 'text-amber-700 bg-amber-50'
                                                  : 'text-gray-900 bg-white',
                                            'relative cursor-default select-none py-2 px-2 flex space-x-2'
                                        ]"
                                    >
                                        <span class="h-5 w-5">
                                            <CheckIcon class="h-full w-full" v-show="selected" />
                                        </span>
                                        <span class="font-normal block truncate">
                                            {{ item.name }}
                                        </span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </div>
                </Listbox>
                <template
                    v-if="
                        ingredientTransactionStore.inputError &&
                        ingredientTransactionStore.inputError.error.validation.ingredient
                    "
                >
                    <p
                        v-for="(error, i) in ingredientTransactionStore.inputError.error.validation
                            .ingredient"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>
            <div>
                <label for="qty" class="block text-sm font-medium leading-6 text-gray-900">
                    Qty
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                >
                    <input
                        type="number"
                        id="qty"
                        pattern="\d"
                        step="1"
                        min="0"
                        autocomplete="off"
                        class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Qty"
                        v-model="newDetail.qty"
                    />
                </div>
                <template
                    v-if="
                        ingredientTransactionStore.inputError &&
                        ingredientTransactionStore.inputError.error.validation.qty
                    "
                >
                    <p
                        v-for="(error, i) in ingredientTransactionStore.inputError.error.validation
                            .qty"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>
        </div>

        <div class="mt-4 flex space-x-2 justify-between items-center">
            <div class="flex space-x-2 items-center">
                <button
                    v-if="mode == 'edit'"
                    type="button"
                    @click="isDeleteDataOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:bg-rose-100 disabled:text-rose-300"
                >
                    Delete
                </button>
            </div>
            <div class="flex space-x-2 items-center">
                <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                    Submit
                </button>
            </div>
        </div>
    </form>

    <ConfirmationModal
        :show="isDeleteDataOpen"
        title="Delete Menu"
        text="Are you sure you want to delete transaction?"
        @cancel="isDeleteDataOpen = false"
        @ok="deleteData(ingredientTransactionDetail.id!)"
    />
</template>

<style scoped></style>
