<template>
    <div>
        <ul class="flex space-x-1">
            <li v-for="(crumb, index) in breadcrumbs" :key="index">
                /
                <template v-if="crumb.to">
                    <RouterLink class="hover:text-emerald-500 transition-all" :to="crumb.to">
                        {{ crumb.label }}
                    </RouterLink>
                </template>
                <span class="font-medium text-emerald-500" v-else>{{ crumb.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import type { Breadcrumb } from '@/tools/types'
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = ref<Breadcrumb[]>()

const getBreadcrumbs = () => {
    const matchedRoute = route.matched

    const routes: Breadcrumb[] = []

    matchedRoute.forEach((item, i) => {
        let crumb: Breadcrumb = {
            label:
                typeof item.meta?.breadcrumb === 'string'
                    ? item.meta.breadcrumb
                    : item.name?.toString() || ''
        }

        if (matchedRoute.length > i + 1)
            crumb.to = matchedRoute
                .slice(0, i + 1)
                .map((route) => route.path)
                .join('')
                .replace(/\/\//g, '/')

        routes.push(crumb)
    })

    breadcrumbs.value = routes
}

onMounted(() => {
    getBreadcrumbs()
})
</script>

<style scoped></style>
