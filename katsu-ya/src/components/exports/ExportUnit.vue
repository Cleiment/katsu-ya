<template>
    <div class="text-sm py-1">
        <div class="grid grid-cols-4 gap-2">
            <div>
                <label for="bulan-export" class="block text-sm font-medium leading-6 text-gray-900">
                    Unit
                </label>
                <Listbox v-model="exportStore.selectedUnit" by="id">
                    <div class="relative">
                        <ListboxButton
                            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                        >
                            <span class="block truncate">{{ exportStore.selectedUnit.name }}</span>
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
                                class="absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50"
                            >
                                <ListboxOption
                                    v-slot="{ active, selected }"
                                    v-for="unit in exportStore.units"
                                    :key="unit.id"
                                    :value="unit"
                                    as="template"
                                >
                                    <li
                                        :class="[
                                            active
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'text-gray-900',
                                            'relative cursor-default select-none py-2 pl-10 pr-4'
                                        ]"
                                    >
                                        <span
                                            :class="[
                                                selected ? 'font-medium' : 'font-normal',
                                                'block truncate'
                                            ]"
                                            >{{ unit.name }}</span
                                        >
                                        <span
                                            v-if="selected"
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                        >
                                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                        </span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </div>
                </Listbox>
            </div>

            <div>
                <label for="bulan-export" class="block text-sm font-medium leading-6 text-gray-900">
                    Bulan
                </label>
                <Listbox v-model="exportStore.selectedBulan" by="id">
                    <div class="relative">
                        <ListboxButton
                            id="bulan-export"
                            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                        >
                            <span class="block truncate">{{
                                exportStore.bulans[exportStore.selectedBulan]
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
                                    v-for="(bulan, i) in exportStore.bulans"
                                    :key="bulan"
                                    :value="i"
                                    as="bulan-export"
                                >
                                    <li
                                        :class="[
                                            active
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'text-gray-900',
                                            'relative cursor-default select-none py-2 pl-4 pr-4'
                                        ]"
                                    >
                                        <span class="font-normal block truncate">{{ bulan }}</span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </div>
                </Listbox>
            </div>
        </div>
        <button @click="submit" class="rounded bg-blue-300 py-1 px-3 text-sm">Submit</button>

        <p>Export Preview :</p>
    </div>
    <div class="px-4 py-3 bg-white shadow-md rounded text-xs" v-if="exportStore.dataExport">
        <div id="export-container">
            <div class="flex justify-between mb-1">
                <div>
                    <p class="font-bold text-base">
                        Rekap SPP Gembala Baik -
                        {{ exportStore.bulans[exportStore.dataExport.bulan] }}
                        {{ new Date().getFullYear() + (exportStore.dataExport.bulan < 6 ? 0 : 1) }}
                    </p>
                    <p class="text-sm">{{ exportStore.dataExport.unit }}</p>
                </div>
                <div class="flex flex-col justify-end">
                    <p>Export Time : {{ exportStore.dataExport.exportTimestamp }}</p>
                    <p>Data Update Time : {{ exportStore.dataExport.dataTimestamp }}</p>
                </div>
            </div>
        </div>
        <div
            class="border-t border-slate-500 py-1"
            v-for="(data, i) in exportStore.dataExport.data"
            :key="i"
        >
            <p class="mb-1">
                Kelas -> <span class="font-bold">{{ data.kelas }}</span>
            </p>
            <table class="w-full mb-1">
                <thead>
                    <tr class="bg-slate-300">
                        <th class="text-xs text-center">No</th>
                        <th class="text-xs">Virtual Account</th>
                        <th width="40%" class="text-xs">Nama</th>
                        <th width="40%" class="text-xs">Bulan Belum Lunas</th>
                        <th width="10%" class="text-xs text-center">Nominal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(siswa, i) in data.siswa" :key="i" class="border-b border-slate-300">
                        <td class="text-xs text-center">{{ i + 1 }}</td>
                        <td class="text-xs">{{ siswa.va }}</td>
                        <td class="text-xs">{{ siswa.nama }}</td>
                        <td class="text-xs">
                            {{ bulanString(siswa.belumLunasBulan) }}
                        </td>
                        <td class="text-xs text-end">
                            {{ formatMoney(siswa.belumLunasNominal) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useExportStore } from '@/stores/ExportStore'
import { useSPPStore } from '@/stores/SPPStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
    CheckIcon,
    ChevronUpDownIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/vue/20/solid'
import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    Switch
} from '@headlessui/vue'

const router = useRouter()

const appStore = useAppStore()
const SPPStore = useSPPStore()
const exportStore = useExportStore()

const { sortExportData } = exportStore

const { formatMoney } = SPPStore

const bulanString = (bulanArray: number[]) => {
    const bulanStrings = bulanArray.map((v) => SPPStore.bulans[v])
    return bulanStrings.join(', ')
}

const submit = async () => {
    appStore.isLoading = true
    await sortExportData()
    appStore.isLoading = false
}

onMounted(() => {
    appStore.activeMenu = 1
    appStore.isLoading = false
})
</script>

<style scoped></style>
