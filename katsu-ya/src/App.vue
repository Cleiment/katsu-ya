<template>
    <div class="loader-container" :class="{ ['show']: appStore.isLoading }">
        <div class="loader"></div>
    </div>
    <div class="notif-container">
        <TransitionGroup name="notif">
            <Notification
                class="mb-2"
                v-for="notif in appStore.notifications"
                :key="notif.id"
                :status="notif.status"
                :message="notif.message"
                :id="notif.id"
            />
        </TransitionGroup>
    </div>
    <div class="flex flex-col lg:flex-row">
        <SideNavbar />
        <div class="py-3 px-5 h-screen overflow-y-auto bg-slate-100 grow">
            <RouterView />
        </div>
    </div>
</template>
<script setup lang="ts">
import SideNavbar from '@/components/SideNavbar.vue'
import Notification from '@/components/NotificationNode.vue'

import { useAppStore } from './stores/AppStore'

document.title = 'Management System | YPGB'

const appStore = useAppStore()
</script>
<style scoped>
.notif-enter-active,
.notif-leave-active {
    transition: all 0.3s ease;
}

.notif-enter-from,
.notif-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
