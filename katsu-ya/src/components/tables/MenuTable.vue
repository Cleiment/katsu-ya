<script setup lang="ts">
import { useAppStore } from '@/stores/AppStore'
import { useMenuStore } from '@/stores/MenuStore'
import { formatMoney, timestampToDatetime } from '@/tools'
import { InformationCircleIcon, PlusIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const menuStore = useMenuStore()

const { copy } = appStore

const props = defineProps<{
    mode: 'manage' | 'order'
}>()
const emit = defineEmits(['showDetail', 'showMenuIngredient', 'showOrderForm'])

const showDetail = (id: string) => {
    const menu = menuStore.data.filter((item) => item.id == id)

    if (menu) {
        menuStore.selectedMenu = menu[0]
        emit('showDetail')
    } else {
        appStore.addNotification('error', 'Menu not found')
    }
}

const showMenuIngredient = (id: string) => {
    const menu = menuStore.data.filter((item) => item.id == id)

    if (menu) {
        menuStore.selectedMenu = menu[0]
        emit('showMenuIngredient')
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
    <table
        class="table w-full font-normal table-auto relative min-w-[750px]"
        v-if="props.mode == 'manage'"
    >
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold text-center px-3 py-2" width="5%">No</th>
                <th class="font-semibold" width="20%">Name</th>
                <th class="font-semibold" width="10%">Price</th>
                <th class="font-semibold text-center" width="10%">Ingredients</th>
                <th class="font-semibold" width="10%">Created At</th>
                <th class="font-semibold" width="10%">Updated At</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(menu, i) in menuStore.data"
                :key="menu.id"
                class="border-b"
                :class="
                    menu.status == 0 ||
                    menu.ingredients!.some(
                        (item) => item.ingredient.status == 0 || item.ingredient.qty < item.qty
                    )
                        ? 'bg-red-500/80 text-white hover:bg-red-500'
                        : 'hover:bg-rose-400/20'
                "
            >
                <td class="px-3 py-4 text-center">{{ i + 1 }}</td>
                <td>
                    <span class="hover:text-slate-600 cursor-pointer" @click="copy(menu.name)">{{
                        menu.name
                    }}</span>
                </td>
                <td class="px-3 py-4">{{ formatMoney(menu.price) }}</td>

                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showMenuIngredient(menu.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
                <td>
                    {{ timestampToDatetime(menu.createdAt) }}
                </td>
                <td>{{ timestampToDatetime(menu.updatedAt) }}</td>
                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showDetail(menu.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
            </tr>
            <tr v-if="menuStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
    <table
        class="table w-full font-normal table-auto relative xl:min-w-[30rem]"
        v-if="props.mode == 'order'"
    >
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold" width="20%">Name</th>
                <th class="font-semibold" width="10%">Price</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="menu in menuStore.data"
                :key="menu.id"
                class="border-b"
                :class="
                    menu.status == 0 ||
                    menu.ingredients!.some(
                        (item) => item.ingredient.status == 0 || item.ingredient.qty < item.qty
                    )
                        ? 'bg-red-500/80 text-white hover:bg-red-500'
                        : 'hover:bg-rose-400/20'
                "
            >
                <td>
                    {{ menu.name }}
                </td>
                <td class="px-3 py-4">{{ formatMoney(menu.price) }}</td>

                <td>
                    <div class="flex space-x-2 justify-center">
                        <button
                            class="rounded-full p-1 bg-blue-500 text-white"
                            @click="showMenuIngredient(menu.id!)"
                        >
                            <InformationCircleIcon class="w-6 h-6" />
                        </button>
                        <button
                            class="rounded-full p-1 bg-emerald-600 text-white"
                            @click="addToOrder(menu.id!)"
                        >
                            <PlusIcon class="w-6 h-6" />
                        </button>
                    </div>
                </td>
            </tr>
            <tr v-if="menuStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="7">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>
