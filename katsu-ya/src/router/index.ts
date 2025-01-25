import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Users from '@/views/Users.vue'
import Ingredients from '@/views/Ingredients.vue'
import IngredientUnits from '@/views/IngredientUnits.vue'
import Menus from '@/views/Menus.vue'
import IngredientTransactions from '@/views/IngredientTransactions.vue'
import NewTransaction from '@/views/NewTransaction.vue'
import Queue from '@/views/Queue.vue'
import TablesOrder from '@/views/TablesOrder.vue'
import StrukPenjualan from '@/components/exports/StrukPenjualan.vue'
import Report from '@/views/Report.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            component: () => {},
            meta: {
                requiresAuth: true
            }
        },
        { path: '/login', component: Login, name: 'Login' },
        {
            path: '/user',
            component: Users,
            name: 'User',
            meta: {
                requiresAuth: true,
                role: [1],
                breadcrumb: 'Users'
            }
        },
        {
            path: '/ingredient',
            component: Ingredients,
            name: 'Ingredient',
            children: [],
            meta: {
                requiresAuth: true,
                role: [1, 2],
                breadcrumb: 'Ingredients'
            }
        },
        {
            path: '/ingredient-transaction',
            component: IngredientTransactions,
            name: 'IngredientTransaction',
            meta: {
                requiresAuth: true,
                role: [2],
                breadcrumb: 'Ingredient Transactions'
            }
        },
        {
            path: '/ingredient-unit',
            component: IngredientUnits,
            name: 'IngredientUnit',
            meta: {
                requiresAuth: true,
                role: [1, 2],
                breadcrumb: 'Ingredient Units'
            }
        },
        {
            path: '/menu',
            component: Menus,
            name: 'Menu',
            meta: {
                requiresAuth: true,
                role: [1, 2],
                breadcrumb: 'Menus'
            }
        },
        {
            path: '/new-transaction',
            component: NewTransaction,
            name: 'NewTransaction',
            meta: {
                requiresAuth: true,
                role: [3],
                breadcrumb: 'New Transaction'
            }
        },
        {
            path: '/queue',
            component: Queue,
            name: 'Queue',
            meta: {
                requiresAuth: true,
                role: [3, 4],
                breadcrumb: 'Queue'
            }
        },
        {
            path: '/table',
            component: TablesOrder,
            name: 'TableOrder',
            meta: {
                requiresAuth: true,
                role: [3, 4],
                breadcrumb: "Table's Order"
            }
        },
        {
            path: '/struk/:id',
            component: StrukPenjualan,
            name: 'StrukPenjualan',
            meta: {
                requiresAuth: true,
                role: [2, 3, 4],
                breadcrumb: 'Struk Penjualan'
            }
        },
        {
            path: '/report',
            component: Report,
            name: 'Report',
            meta: {
                requiresAuth: true,
                role: [2, 3, 4],
                breadcrumb: 'Report'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
            meta: {
                requiresAuth: true
            }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    await authStore.checkLoggedIn()

    if (authStore.loggedIn) {
        if (to.meta.role && Array.isArray(to.meta.role)) {
            if (to.meta.role.includes(authStore.role!.id)) return next()
            else next({ name: 'Login' })
        } else if (to.name == 'Main' || to.name == 'Login') {
            return next({ name: authStore.role!.dashboard })
        } else if (to.fullPath == '/logout') {
            authStore.logout()
            return next()
        } else {
            return next()
        }
    } else {
        if (to.matched.some((rec) => rec.meta.requiresAuth)) {
            return next({ name: 'Login' })
        } else {
            return next()
        }
    }
})

export default router
