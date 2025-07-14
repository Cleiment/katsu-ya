<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

import { type Ingredient, type Menu, type MenuIngredient } from '@/tools/types'
import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { ref, watch } from 'vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { useIngredientStore } from '@/stores/IngredientStore'
import { CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'
import { image, placeholder } from '@/tools'
import { useCategoryStore } from '@/stores/CategoryStore'

const appStore = useAppStore()
const menuStore = useMenuStore()
const ingredientStore = useIngredientStore()
const categoryStore = useCategoryStore()

const emits = defineEmits(['submit', 'refresh', 'confirmDelete'])
const props = defineProps<{
    menuDetail: Menu
    mode: 'new' | 'edit'
}>()

const newDetail: Menu = JSON.parse(JSON.stringify(props.menuDetail))

const previewImageSrc = ref<string>(placeholder)
const fileInput = ref<HTMLInputElement | null>(null)

previewImageSrc.value = props.menuDetail.picture
    ? image + 'menu-image/' + props.menuDetail.picture
    : placeholder

const isToggleDataConfirmationOpen = ref(false)
const toggleMenuStatus = async (id: string, status: number) => {
    appStore.isLoading = true
    if (status == 1) await menuStore.deactivateMenu(id)
    else if (status == 0) await menuStore.activateMenu(id)
    isToggleDataConfirmationOpen.value = false
    appStore.isLoading = false
    emits('refresh')
}

const isDeleteDataOpen = ref(false)
const deleteMenu = async (id: string) => {
    if (props.menuDetail._count && props.menuDetail._count.detailTransaction > 0)
        return appStore.addNotification(
            'error',
            "Can't delete, Menu has been used in a transaction."
        )
    else {
        appStore.isLoading = true
        await menuStore.deleteMenu(id)
        isDeleteDataOpen.value = false
        emits('refresh')
    }
}

const ingredientStatus = (items: Ingredient[]) => {
    return items.filter((v) => {
        return v.status == 1
    })
}

const ingredients = ref<Ingredient[]>(newDetail.ingredients?.map((item) => item.ingredient) || [])

const menuIngredients = ref<MenuIngredient[]>(
    ingredients.value.map((v) => {
        const item = newDetail.ingredients!.filter((item) =>
            item.ingredient.id == v.id ? item : undefined
        )
        const qty = item.length > 0 && item[0] ? item[0].qty : 0
        return { qty: qty, idIngredient: v.id, ingredient: v }
    })
)

watch(ingredients, () => {
    menuIngredients.value = ingredients.value.map((v) => {
        const item = newDetail.ingredients!.filter((item) =>
            item.ingredient.id == v.id ? item : undefined
        )
        const qty = item.length > 0 && item[0] ? item[0].qty : 0
        return { qty: qty, idIngredient: v.id, ingredient: v }
    })
})

const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        newDetail.file = file
        previewImageSrc.value = URL.createObjectURL(file)
    }
}

const submit = () => {
    newDetail.ingredients = menuIngredients.value
    emits('submit', newDetail)
}
</script>
<template>
    <form action="" @submit.prevent="submit" v-if="menuDetail">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 h-fit md:min-h-60">
            <div class="flex flex-col space-y-2 h-full">
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
                        v-if="menuStore.inputError && menuStore.inputError.error.validation.name"
                    >
                        <p
                            v-for="(error, i) in menuStore.inputError.error.validation.name"
                            class="mt-2 text-sm text-red-500 dark:text-red-500"
                            :key="i"
                        >
                            {{ error }}
                        </p>
                    </template>
                </div>

                <div class="flex flex-col space-y-2">
                    <div>
                        <label
                            for="category"
                            class="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Category
                        </label>
                        <Listbox
                            v-model="newDetail.category"
                            class="flex"
                            aria-required="true"
                            by="id"
                        >
                            <div class="relative">
                                <ListboxButton
                                    id="category"
                                    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                                >
                                    <span class="block truncate">{{
                                        newDetail.category?.name ||
                                        (
                                            categoryStore.data.filter(
                                                (item) => item.id == newDetail.idCategory
                                            )[0] || categoryStore.data[0]
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
                                            v-for="item in categoryStore.data"
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
                                                    <CheckIcon
                                                        class="h-full w-full"
                                                        v-show="selected"
                                                    />
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
                                menuStore.inputError &&
                                menuStore.inputError.error.validation.category
                            "
                        >
                            <p
                                v-for="(error, i) in menuStore.inputError.error.validation
                                    .ingredients"
                                class="mt-2 text-sm text-red-500 dark:text-red-500"
                                :key="i"
                            >
                                {{ error }}
                            </p>
                        </template>
                    </div>
                </div>

                <div>
                    <label for="desc" class="block text-sm font-medium leading-6 text-gray-900">
                        Description
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
                    >
                        <textarea
                            name="desc"
                            id="desc"
                            rows="3"
                            autocomplete="off"
                            class="w-full flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            placeholder="Description"
                            v-model="newDetail.desc"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <label for="price" class="block text-sm font-medium leading-6 text-gray-900">
                        Price
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
                    >
                        <input
                            type="number"
                            name="price"
                            id="price"
                            min="100"
                            step="1"
                            autocomplete="off"
                            class="w-full flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            placeholder="Price"
                            v-model="newDetail.price"
                        />
                    </div>
                </div>

                <div class="flex flex-col space-y-2">
                    <div>
                        <label
                            for="ingredients"
                            class="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Ingredients
                        </label>
                        <Listbox
                            v-model="ingredients"
                            class="flex"
                            multiple
                            aria-required="true"
                            by="id"
                        >
                            <div class="relative">
                                <ListboxButton
                                    id="ingredients"
                                    class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                                >
                                    <span class="block truncate">{{
                                        ingredients.map((v) => v.name).join(', ') || 'Select...'
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
                                                    <CheckIcon
                                                        class="h-full w-full"
                                                        v-show="selected"
                                                    />
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
                                menuStore.inputError &&
                                menuStore.inputError.error.validation.ingredients
                            "
                        >
                            <p
                                v-for="(error, i) in menuStore.inputError.error.validation
                                    .ingredients"
                                class="mt-2 text-sm text-red-500 dark:text-red-500"
                                :key="i"
                            >
                                {{ error }}
                            </p>
                        </template>
                    </div>
                    <div class="h-72 md:h-44 overflow-y-auto">
                        <div class="flex flex-col space-y-2">
                            <template v-for="(item, i) in menuIngredients" :key="i">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                                    <div
                                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                                    >
                                        <input
                                            disabled
                                            type="text"
                                            autocomplete="off"
                                            class="w-full flex-1 border-0 bg-gray-200 py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            placeholder="Ingredient"
                                            autocapitalize="characters"
                                            :value="menuIngredients[i].ingredient.name"
                                        />
                                    </div>
                                    <div
                                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                                    >
                                        <input
                                            type="number"
                                            pattern="\d"
                                            step="1"
                                            min="0"
                                            autocomplete="off"
                                            class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            placeholder="Qty"
                                            v-model="menuIngredients[i].qty"
                                        />
                                        <div class="w-fit">
                                            <p
                                                class="border-0 bg-gray-200 py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                            >
                                                {{ menuIngredients[i].ingredient.unit?.name }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-2 h-full">
                <div>
                    <label for="file" class="block text-sm font-medium leading-6 text-gray-900">
                        Menu Picture
                    </label>
                    <div
                        class="flex focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
                    >
                        <div
                            class="bg-gray-300 h-[26rem] w-[26rem] rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200 cursor-pointer"
                        >
                            <img
                                :src="previewImageSrc"
                                alt=""
                                class="w-full h-full object-cover"
                                @click="fileInput?.click()"
                            />
                        </div>
                        <input
                            ref="fileInput"
                            type="file"
                            name="file"
                            id="file"
                            autocomplete="off"
                            accept="image/*"
                            class="hidden"
                            @change="onFileChange"
                        />
                    </div>
                    <template
                        v-if="menuStore.inputError && menuStore.inputError.error.validation.picture"
                    >
                        <p
                            v-for="(error, i) in menuStore.inputError.error.validation.picture"
                            class="mt-2 text-sm text-red-500 dark:text-red-500"
                            :key="i"
                        >
                            {{ error }}
                        </p>
                    </template>
                </div>
            </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
            <div class="flex space-x-2 items-center">
                <button
                    v-if="mode == 'edit'"
                    :disabled="menuDetail._count && menuDetail._count.detailTransaction > 0"
                    type="button"
                    @click="isDeleteDataOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:bg-rose-100 disabled:text-rose-300"
                >
                    Delete
                </button>
                <div
                    class="flex space-x-2 items-center"
                    v-if="
                        menuDetail.ingredients!.some(
                            (item) => item.ingredient.status == 0 || item.ingredient.qty < item.qty
                        )
                    "
                >
                    <InformationCircleIcon class="h-7 w-7" />
                    <p class="text-sm italic">Ingredient(s) not available</p>
                </div>
            </div>
            <div class="flex space-x-2 items-center">
                <template v-if="mode == 'edit'">
                    <button
                        v-if="menuDetail.status == 1"
                        type="button"
                        @click="isToggleDataConfirmationOpen = true"
                        class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    >
                        Deactivate
                    </button>
                    <button
                        v-else-if="menuDetail.status == 0"
                        type="button"
                        @click="
                            !menuDetail.ingredients!.some(
                                (item) =>
                                    item.ingredient.status == 0 || item.ingredient.qty < item.qty
                            )
                                ? (isToggleDataConfirmationOpen = true)
                                : appStore.addNotification(
                                      'error',
                                      `Couldn't Activate Data, there is/are ingredient(s) that's not available`
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
        :title="menuDetail.status == 1 ? 'Deactivate Menu' : 'Activate Menu'"
        :text="
            menuDetail.status == 1
                ? 'Are you sure you want to deactivate menu?'
                : 'Are you sure you want to activate menu?'
        "
        @cancel="isToggleDataConfirmationOpen = false"
        @ok="toggleMenuStatus(menuDetail.id!, menuDetail.status)"
    />

    <ConfirmationModal
        :show="isDeleteDataOpen"
        title="Delete Menu"
        text="Are you sure you want to delete menu?"
        @cancel="isDeleteDataOpen = false"
        @ok="deleteMenu(menuDetail.id!)"
    />
</template>

<style scoped></style>
