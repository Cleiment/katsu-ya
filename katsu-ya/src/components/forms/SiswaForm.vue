<template>
  <form action="" @submit.prevent="emits('submit', newDetail)">
    <div v-if="siswaDetail" class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
      <div>
        <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Nama</label>
        <div
          class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
        >
          <input
            type="text"
            name="name"
            id="name"
            autocomplete="off"
            class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder="Name"
            autocapitalize="characters"
            v-model="newDetail.nama"
          />
        </div>
      </div>
      <div>
        <label for="unit" class="block text-sm font-medium leading-6 text-gray-900">Unit</label>
        <div>
          <Listbox v-model="newDetail.id_unit" class="flex">
            <div class="relative">
              <ListboxButton
                id="unit"
                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
              >
                <span class="block truncate">{{
                  SPPStore.units.filter((item) => item.value == newDetail.id_unit)[0].name
                }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                    v-for="unit in SPPStore.units"
                    :key="unit.id"
                    :value="unit.value"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4'
                      ]"
                    >
                      <span class="font-normal block truncate">{{ unit.name }}</span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <div>
          <label for="kelas_1" class="block text-sm font-medium leading-6 text-gray-900"
            >Kelas</label
          >
          <div
            class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
          >
            <input
              type="text"
              name="kelas_1"
              id="kelas_1"
              autocomplete="off"
              class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="Kelas"
              v-model="newDetail.kelas_1"
            />
          </div>
        </div>
        <div>
          <label for="kelas_2" class="block text-sm font-medium leading-6 text-gray-900"
            >Kategori Kelas</label
          >
          <div
            class="rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
          >
            <input
              type="text"
              name="kelas_2"
              id="kelas_2"
              autocomplete="off"
              class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="Kategori Kelas"
              v-model="newDetail.kelas_2"
            />
          </div>
        </div>
      </div>
      <div>
        <label for="va" class="block text-sm font-medium leading-6 text-gray-900">Nomor VA</label>
        <div
          class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
        >
          <input
            type="text"
            pattern="\d{16}"
            name="va"
            id="va"
            autocomplete="off"
            class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder="Virtual Account"
            v-model="newDetail.va"
          />
        </div>
      </div>
      <div>
        <label for="spp" class="block text-sm font-medium leading-6 text-gray-900"
          >SPP / Bulan</label
        >
        <div class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300">
          <span
            class="px-4 inline-flex items-center bg-gray-200 min-w-fit rounded-s-lg text-sm text-gray-500"
            >Rp</span
          >
          <input
            type="text"
            name="spp"
            id="spp"
            autocomplete="off"
            class="block flex-1 border-0 bg-transparent ring-1 ring-inset ring-gray-300 rounded-r-lg py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-2 focus:ring-inset focus:ring-yellow-pastel"
            placeholder="SPP / Bulan"
            v-model="newDetail.biaya_spp_bulanan"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-x-4">
        <div>
          <label for="bulan-masuk" class="block text-sm font-medium leading-6 text-gray-900"
            >Bulan Masuk</label
          >
          <div>
            <Listbox v-model="newDetail.bulan_masuk" class="flex">
              <div class="relative">
                <ListboxButton
                  id="bulan-masuk"
                  class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                >
                  <span class="block truncate">{{ SPPStore.bulans[newDetail.bulan_masuk] }}</span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
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
                      as="bulan-masuk"
                    >
                      <li
                        :class="[
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-10 pr-4'
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

        <div>
          <label for="tahun" class="block text-sm font-medium leading-6 text-gray-900"
            >Tahun Ajaran</label
          >
          <div
            class="rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel"
          >
            <input
              type="text"
              name="tahun"
              id="tahun"
              autocomplete="off"
              class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              placeholder="Tahun Ajaran"
              v-model="newDetail.tahun"
            />
          </div>
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
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'

import { useSPPStore } from '@/stores/SPPStore'
import { onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/AppStore'

const emits = defineEmits(['submit'])

const props = defineProps<{
  siswaDetail: ISPPSiswa
}>()

const newDetail: ISPPSiswa = JSON.parse(JSON.stringify(props.siswaDetail))

const route = useRoute()
const router = useRouter()

const SPPStore = useSPPStore()

const va = route.params.va
</script>

<style scoped>
th {
  @apply text-start;
}
tr {
  @apply transition-all duration-150;
}
table {
  @apply transition-all duration-300 ease-out;
}
</style>
