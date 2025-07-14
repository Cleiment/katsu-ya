<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { formatMoney, image, placeholder } from '@/tools'
import type { Menu } from '@/tools/types'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { InformationCircleIcon, PlusIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const menuStore = useMenuStore()

const emit = defineEmits(['showDetail', 'showMenuDetail', 'showOrderForm'])

const showMenuDetail = (menu: Menu) => {
    if (menu) {
        emit('showMenuDetail', menu)
    } else {
        appStore.addNotification('error', 'Menu not found')
    }
}

const addToOrder = (id: string) => {
    const menu = menuStore.data.filter((item) => item.id == id)

    if (menu) {
        menuStore.selectedMenu = menu[0]
        emit('showOrderForm')
    } else {
        appStore.addNotification('error', 'Menu not found')
    }
}
</script>
<template>
    <TabGroup as="div" class="flex flex-col md:flex-col-reverse w-full h-full gap-2">
        <TabPanels class="grow overflow-y-auto w-full">
            <TabPanel
                v-for="(category, i) in menuStore.orderMenu"
                :key="i"
                class="grid grid-cols-1 gap-3 auto-rows-min w-full"
                :class="category.menus.length == 0 ? '' : 'md:grid-cols-2 xl:grid-cols-3'"
            >
                <div v-if="category.menus.length == 0">
                    <p class="text-sm text-gray-500 text-center">No Menu</p>
                </div>
                <div
                    v-for="(menu, j) in category.menus"
                    :key="j"
                    class="relative flex w-full transition duration-100 border rounded-xl p-2"
                >
                    <div
                        v-if="menu.status == 0"
                        class="w-full h-full absolute left-0 top-0 rounded-lg bg-gray-400/50 flex items-center justify-center"
                    >
                        <p class="text-sm text-white font-bold">Not Enough Ingredient</p>
                    </div>
                    <div
                        class="bg-gray-300 h-24 w-24 me-3 lg:h-32 lg:w-32 rounded-lg overflow-hidden ring-1 ring-gray-300"
                    >
                        <img
                            :src="image + 'menu-image/' + menu.picture || placeholder"
                            alt=""
                            class="h-full w-full object-cover"
                        />
                    </div>
                    <div class="grow h-full flex flex-col">
                        <p class="text-sm font-semibold">{{ menu.name }}</p>
                        <p class="text-xs text-gray-400 leading-4">{{ menu.desc }}</p>
                        <div class="mt-auto flex items-center justify-between">
                            <p class="text-sm font-bold">{{ formatMoney(menu.price, true) }}</p>
                            <div class="flex gap-x-1">
                                <button
                                    class="rounded-full p-1 bg-blue-500 text-white"
                                    @click="showMenuDetail(menu)"
                                    :disabled="menu.status == 0"
                                >
                                    <InformationCircleIcon class="w-6 h-6" />
                                </button>
                                <button
                                    class="rounded-full p-1 bg-emerald-600 text-white"
                                    @click="addToOrder(menu.id!)"
                                    :disabled="menu.status == 0"
                                >
                                    <PlusIcon class="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabPanels>

        <TabList class="shrink-0 w-full flex overflow-x-auto rounded-xl bg-rose-200 p-1">
            <Tab
                v-for="(category, i) in menuStore.orderMenu"
                as="template"
                :key="i"
                v-slot="{ selected }"
            >
                <button
                    class="w-full flex justify-center transition duration-200 min-w-40"
                    :class="[
                        'rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white/60 ring-offset-1 ring-offset-rose-400 focus:outline-none focus:ring-1',
                        selected
                            ? 'bg-white text-rose-500 shadow'
                            : 'text-red-500/80 hover:bg-white/[0.12] hover:text-red-600'
                    ]"
                >
                    {{ category.name }}
                    <div
                        class="px-1 flex justify-center items-center ms-1 rounded"
                        :class="[
                            selected
                                ? 'bg-rose-500 text-white shadow'
                                : 'text-red-500/80 bg-white hover:text-red-600'
                        ]"
                    >
                        <p class="text-xs m-0">{{ category.menus.length }}</p>
                    </div>
                </button>
            </Tab>
        </TabList>
    </TabGroup>
</template>

<style scoped></style>
