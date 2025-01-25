<template>
    <form action="" @submit.prevent="submit">
        <div v-if="potongan" class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
            <div>
                <label for="menjadi" class="block text-sm font-medium leading-6 text-gray-900"
                    >SPP Menjadi</label
                >
                <div class="flex rounded-lg ring-1 ring-inset ring-gray-300">
                    <span
                        class="px-4 inline-flex items-center bg-gray-200 min-w-fit rounded-s-lg text-sm text-gray-500"
                        >Rp</span
                    >
                    <input
                        type="text"
                        name="menjadi"
                        id="menjadi"
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent ring-1 ring-inset ring-gray-300 rounded-r-lg py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-yellow-pastel"
                        placeholder="Menjadi"
                        v-model="newPotongan.menjadi"
                    />
                </div>
            </div>
            <div>
                <label for="bulan-mulai" class="block text-sm font-medium leading-6 text-gray-900"
                    >Bulan Mulai</label
                >
                <div>
                    <Listbox v-model="newPotongan.bulan_mulai" class="flex" by="id">
                        <div class="relative">
                            <ListboxButton
                                id="bulan-mulai"
                                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                            >
                                <span class="block truncate">{{
                                    SPPStore.bulans[newPotongan.bulan_mulai]
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
                                        v-slot="{ active }"
                                        v-for="(bulan, i) in SPPStore.bulans"
                                        :key="bulan"
                                        :value="i"
                                        as="bulan-mulai"
                                    >
                                        <li
                                            :class="[
                                                active
                                                    ? 'bg-amber-100 text-amber-900'
                                                    : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-10 pr-4'
                                            ]"
                                        >
                                            <span class="font-normal block truncate">{{
                                                bulan
                                            }}</span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div>
                <label for="bulan-total" class="block text-sm font-medium leading-6 text-gray-900"
                    >Bulan Total</label
                >
                <div class="flex">
                    <input
                        type="number"
                        name="bulan_total"
                        id="bulan-total"
                        autocomplete="off"
                        class="block w-full border-0 bg-transparent ring-1 ring-inset ring-gray-300 rounded-lg py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-yellow-pastel"
                        placeholder="Bulan Total"
                        v-model="newPotongan.bulan_total"
                    />
                </div>
            </div>
        </div>

        <div class="mt-4 flex justify-end">
            <button
                type="submit"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
                Submit
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

import { useSPPStore } from '@/stores/SPPStore'
import { useAppStore } from '@/stores/AppStore'

const props = defineProps<{
    potongan: IPotonganSiswa
    isEditPotongan: Boolean
}>()
const emits = defineEmits(['closeModal', 'reload'])

const newPotongan: IPotonganSiswa = JSON.parse(JSON.stringify(props.potongan))

const SPPStore = useSPPStore()
const appStore = useAppStore()
const { editPotongan, tambahPotongan } = SPPStore

const submit = async () => {
    appStore.isLoading = true
    if (props.isEditPotongan) await editPotongan(newPotongan)
    else await tambahPotongan(newPotongan)

    emits('closeModal')
    emits('reload')
    appStore.isLoading = false
}
</script>

<style scoped></style>
