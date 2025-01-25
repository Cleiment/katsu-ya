<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

import { Roles, type User } from '@/tools/types'
import { useAppStore } from '@/stores/AppStore'
import { useUserStore } from '@/stores/UserStore'
import { ref } from 'vue'
import ConfirmationModal from '../ConfirmationModal.vue'
import { CheckIcon } from '@heroicons/vue/24/solid'

const appStore = useAppStore()
const userStore = useUserStore()

const emits = defineEmits(['submit', 'refresh'])
const props = defineProps<{
    userDetail: User
    mode: 'new' | 'edit'
}>()

const newDetail: User = JSON.parse(JSON.stringify(props.userDetail))

const isToggleDataConfirmationOpen = ref(false)
const toggleUserStatus = async (id: string, status: number) => {
    appStore.isLoading = true
    if (status == 1) await userStore.deactivateUser(id)
    else if (status == 0) await userStore.activateUser(id)
    isToggleDataConfirmationOpen.value = false
    emits('refresh')
}
</script>
<template>
    <form action="" @submit.prevent="emits('submit', newDetail)" v-if="userDetail">
        <div class="grid grid-cols-1 gap-x-2 gap-y-2">
            <div>
                <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
                    Username
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastelyellow-pastel"
                >
                    <input
                        type="text"
                        name="username"
                        id="username"
                        autocomplete="off"
                        class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Username"
                        autocapitalize="characters"
                        v-model="newDetail.username"
                    />
                </div>
                <template
                    v-if="userStore.inputError && userStore.inputError.error.validation.username"
                >
                    <p
                        v-for="(error, i) in userStore.inputError.error.validation.username"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>
            <div>
                <label for="role" class="block text-sm font-medium leading-6 text-gray-900">
                    Role
                </label>
                <div>
                    <Listbox v-model="newDetail.userRole" class="flex" by="id">
                        <div class="relative">
                            <ListboxButton
                                id="role"
                                class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastel sm:text-sm"
                            >
                                <span class="block truncate">{{
                                    newDetail.userRole.role || ''
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
                                        v-for="role in Roles"
                                        :key="role.id"
                                        :value="role"
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
                                                role.role
                                            }}</span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div v-if="mode == 'new'">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastelyellow-pastel"
                >
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autocomplete="off"
                        class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Password"
                        autocapitalize="characters"
                        v-model="newDetail.password"
                    />
                </div>
                <template
                    v-if="userStore.inputError && userStore.inputError.error.validation.password"
                >
                    <p
                        v-for="(error, i) in userStore.inputError.error.validation.password"
                        class="mt-2 text-sm text-red-500 dark:text-red-500"
                        :key="i"
                    >
                        {{ error }}
                    </p>
                </template>
            </div>
            <div v-if="mode == 'new'">
                <label
                    for="confirm-password"
                    class="block text-sm font-medium leading-6 text-gray-900"
                >
                    Confirm Password
                </label>
                <div
                    class="flex rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-pastelyellow-pastel"
                >
                    <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        autocomplete="off"
                        class="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="Confirm Password"
                        autocapitalize="characters"
                        v-model="newDetail.confirmPassword"
                    />
                </div>
                <template
                    v-if="
                        userStore.inputError &&
                        userStore.inputError.error.validation.confirmPassword
                    "
                >
                    <p
                        v-for="(error, i) in userStore.inputError.error.validation.confirmPassword"
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
                    v-if="userDetail.status == 1"
                    type="button"
                    @click="isToggleDataConfirmationOpen = true"
                    class="inline-flex justify-center rounded-md border border-transparent bg-rose-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                    Deactivate
                </button>
                <button
                    v-else-if="userDetail.status == 0"
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
        :title="userDetail.status == 1 ? 'Deactivate User' : 'Activate User'"
        :text="
            userDetail.status == 1
                ? 'Are you sure you want to deactivate user?'
                : 'Are you sure you want to activate user?'
        "
        @cancel="isToggleDataConfirmationOpen = false"
        @ok="toggleUserStatus(userDetail.id!, userDetail.status)"
    />
</template>

<style scoped></style>
