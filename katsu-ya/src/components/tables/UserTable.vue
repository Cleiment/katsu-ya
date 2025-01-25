<script setup lang="ts">
// import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/AppStore'
import { useUserStore } from '@/stores/UserStore'
import { timestampToDatetime } from '@/tools'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

// const router = useRouter()

const appStore = useAppStore()
const userStore = useUserStore()

const { copy } = appStore

const emit = defineEmits(['showDetail'])

const showDetail = (id: string) => {
    const user = userStore.data.filter((item) => item.id == id)

    if (user) {
        userStore.selectedUser = user[0]
        emit('showDetail')
    } else {
        appStore.addNotification('error', 'User not found')
    }
}
</script>
<template>
    <table class="table w-full font-normal table-auto relative">
        <thead class="sticky top-0 shadow bg-white rounded">
            <tr>
                <th class="font-semibold text-center px-3 py-2" width="5%">No</th>
                <th class="font-semibold" width="35%">Username</th>
                <th class="font-semibold" width="10%">Role</th>
                <th class="font-semibold" width="20%">Created At</th>
                <th class="font-semibold" width="20%">Updated At</th>
                <th class="font-semibold text-center" width="10%">Action</th>
            </tr>
        </thead>
        <tbody class="text-sm">
            <tr
                v-for="(user, i) in userStore.data"
                :key="user.id"
                class="border-b"
                :class="
                    user.status == 0
                        ? 'bg-red-500/80 text-white hover:bg-red-500'
                        : 'hover:bg-rose-400/20'
                "
            >
                <td class="px-3 py-4 text-center">{{ i + 1 }}</td>
                <td>
                    <span
                        class="hover:text-slate-600 cursor-pointer"
                        @click="copy(user.username)"
                        >{{ user.username }}</span
                    >
                </td>
                <td>{{ user.userRole.role }}</td>
                <td>
                    {{ timestampToDatetime(user.createdAt) }}
                </td>
                <td>{{ timestampToDatetime(user.updatedAt) }}</td>
                <td class="text-center">
                    <button
                        class="rounded-full p-1 bg-blue-500 text-white"
                        @click="showDetail(user.id!)"
                    >
                        <InformationCircleIcon class="w-6 h-6" />
                    </button>
                </td>
            </tr>
            <tr v-if="userStore.data?.length == 0">
                <td class="py-4 border-b hover:bg-orange-400/20" colspan="6">
                    <p class="text-gray-400 text-center">Data Not Found</p>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>
