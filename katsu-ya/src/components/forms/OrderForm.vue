<script setup lang="ts">
import { useMenuStore } from '@/stores/MenuStore'
import { ref } from 'vue'
import { useTransactionStore } from '@/stores/TransactionStore'

const menuStore = useMenuStore()
const transactionStore = useTransactionStore()

const menuQty = ref(0)

const addOrder = async () => {
    transactionStore.newTransaction.transactionCartDetail.push({
        menu: menuStore.selectedMenu,
        menuQty: menuQty.value
    })
}
</script>
<template>
    <form action="" @submit.prevent="addOrder">
        <div class="flex flex-col space-y-2 h-fit">
            <div class="flex flex-col space-y-2">
                <div>
                    <label for="menu" class="block text-sm font-medium leading-6 text-gray-900">
                        Menu
                    </label>
                    <div
                        class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel overflow-hidden"
                    >
                        <input
                            type="text"
                            class="w-full border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 disabled:bg-gray-200 disabled:text-gray-500"
                            disabled
                            :value="menuStore.selectedMenu.name"
                        />
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-2">
                <div>
                    <label for="qty" class="block text-sm font-medium leading-6 text-gray-900">
                        Qty
                    </label>
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
                            v-model="menuQty"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-4 flex justify-end items-center">
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
</template>

<style scoped></style>
