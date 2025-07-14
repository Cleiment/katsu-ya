<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

import { onMounted, ref } from 'vue'
import { type Ingredient, type IngredientUnit } from '@/tools/types'

import { useAppStore } from '@/stores/AppStore'
import { useIngredientStore } from '@/stores/IngredientStore'
import { useIngredientUnitStore } from '@/stores/IngredientUnitStore'

import ConfirmationModal from '../ConfirmationModal.vue'
import { CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const ingredientStore = useIngredientStore()
const ingredientUnitStore = useIngredientUnitStore()

const emits = defineEmits(['submit', 'refresh'])
const props = defineProps<{
    ingredientDetail: Ingredient
    mode: 'new' | 'edit'
}>()

const newDetail: Ingredient = JSON.parse(JSON.stringify(props.ingredientDetail))

const isToggleDataConfirmationOpen = ref(false)
const toggleIngredientStatus = async (id: number, status: number) => {
    appStore.isLoading = true
    if (status == 1) await ingredientStore.deactivateIngredient(id)
    else if (status == 0) await ingredientStore.activateIngredient(id)
    isToggleDataConfirmationOpen.value = false
    appStore.isLoading = false
    emits('refresh')
}

const ingredientUnitStatus = (items: IngredientUnit[]) => {
    if (items.length == 0)
        items = [
            {
                name: 'Select...',
                status: 1,
                createdAt: '',
                updatedAt: ''
            }
        ]
    return items.filter((v) => {
        return v.status == 1
    })
}

onMounted(() => {
    if (!newDetail.unit) newDetail.unit = ingredientUnitStore.data[0]
})
</script>
<template>
    <form action="" @submit.prevent="emits('submit', newDetail)" v-if="ingredientDetail">
        <div class="grid grid-cols-1 gap-x-2 gap-y-2">
            <div>
                <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                    Name
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
                >
                    <input
                        type="text"
                        name="name"
                        id="name"
                        autocomplete="off"
                        class="w-full flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Name"
                        autocapitalize="characters"
                        v-model="newDetail.name"
                    />
                </div>
                <template
                    v-if="
                        ingredientStore.inputError &&
                        ingredientStore.inputError.error.validation.name
                    "
                >
                    <p
                        v-for="(error, i) in ingredientStore.inputError.error.validation.name"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>

            <div>
                <label for="role" class="block text-sm font-medium leading-6 text-gray-900">
                    Unit
                </label>
                <div>
                    <Listbox v-model="newDetail.unit" class="flex" by="id">
                        <div class="relative">
                            <ListboxButton
                                id="role"
                                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                            >
                                <span class="block truncate">{{
                                    (
                                        ingredientUnitStore.data.filter(
                                            (item) => item.id == newDetail.unit?.id
                                        )[0] || ingredientUnitStore.data[0]
                                    ).name
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
                                leave-active-class="transition duration-100 ease-in"
                                leave-from-class="opacity-100"
                                leave-to-class="opacity-0"
                            >
                                <ListboxOptions
                                    class="absolute w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                                >
                                    <ListboxOption
                                        v-slot="{ active, selected }"
                                        v-for="unit in ingredientUnitStatus(
                                            ingredientUnitStore.data
                                        )"
                                        :key="unit.id"
                                        :value="unit"
                                        as="template"
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
                                                <CheckIcon
                                                    class="h-full w-full"
                                                    v-show="selected"
                                                />
                                            </span>
                                            <span class="font-normal block truncate">{{
                                                unit.name
                                            }}</span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </div>
                    </Listbox>
                </div>
            </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
            <div>
                <div class="flex space-x-2 items-center" v-if="ingredientDetail.unit?.status == 0">
                    <InformationCircleIcon class="h-7 w-7" />
                    <p class="text-sm italic">Ingredient Unit can't be used</p>
                </div>
            </div>
            <div class="flex space-x-2 justify-end">
                <template v-if="mode == 'edit'">
                    <button
                        v-if="ingredientDetail.status == 1"
                        @click="isToggleDataConfirmationOpen = true"
                        type="button"
                        class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    >
                        Deactivate
                    </button>
                    <button
                        v-else-if="ingredientDetail.status == 0"
                        type="button"
                        @click="
                            ingredientDetail.unit?.status == 1
                                ? (isToggleDataConfirmationOpen = true)
                                : appStore.addNotification(
                                      'error',
                                      `Couldn't Activate Data, the ingredient unit is deactivated`
                                  )
                        "
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
        </div>
    </form>

    <ConfirmationModal
        :show="isToggleDataConfirmationOpen"
        :title="ingredientDetail.status == 1 ? 'Deactivate Ingredient' : 'Activate Ingredient'"
        :text="
            ingredientDetail.status == 1
                ? 'Are you sure you want to deactivate ingredient?'
                : 'Are you sure you want to activate ingredient?'
        "
        @cancel="isToggleDataConfirmationOpen = false"
        @ok="toggleIngredientStatus(ingredientDetail.id!, ingredientDetail.status)"
    />
</template>

<style scoped></style>
