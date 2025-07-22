import {
    ClipboardDocumentListIcon,
    ClipboardIcon,
    CubeIcon,
    RectangleStackIcon,
    Square3Stack3DIcon,
    UserGroupIcon
} from '@heroicons/vue/24/solid'
import type { FunctionalComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

export type OErrorTypes = string | ErrorResponse | ErrorValidation
export type ONotificationStatus = 'success' | 'error' | 'warning' | 'info'
export type ORoles = 'admin' | 'manager' | 'cashier' | 'kitchen' | 'customer'

export type FetchResponse<T> = Awaited<T> | ErrorValidation | undefined

export type PromiseFetchResponse<T> = Promise<FetchResponse<T>>

export interface ErrorValidation {
    error: {
        validation: {
            [k: string]: string[]
        }
    }
}

export interface ErrorResponse {
    error: {
        message: string
    }
}

export interface SuccessResponse {
    success: string
}

export const isErrorValidation = (err: any): err is ErrorValidation =>
    (err as ErrorValidation).error !== undefined &&
    (err as ErrorValidation).error.validation !== undefined

export const isErrorResponse = (err: any): err is ErrorResponse =>
    (err as ErrorResponse).error !== undefined && (err as ErrorResponse).error.message !== undefined

export const isFetchSuccess = (body: any): body is SuccessResponse =>
    (body as SuccessResponse).success !== undefined

export type Notification = {
    id: number
    status: ONotificationStatus
    message: string
}

export type Breadcrumb = {
    label: string
    to?: string
}

export type Login = {
    username: string
    password: string
}

export type LoginSuccessResponse = {
    token: string
}

export type PaginatedData<T> = {
    total: number
    totalPages: number
    currentPage: number
    limit: number
    data: T
}

export type User = {
    id?: string
    username: string
    idRole?: number
    userRole: Role
    status: number
    createdAt: string
    updatedAt: string
    password?: string
    confirmPassword?: string
}

export type IngredientUnit = {
    id?: number
    name: string
    status: number
    createdAt: string
    updatedAt: string
}

export type Ingredient = {
    id?: number
    name: string
    qty: number
    idUnit?: number
    unit?: IngredientUnit
    status: number
    createdAt: string
    updatedAt: string
}

export type IngredientTransaction = {
    id?: number
    stockUsage?: DetailTransaction
    isUsage: number
    qty: number
    user?: {
        username: string
    }
    idIngredient?: Ingredient['id']
    ingredient?: Ingredient
    createdAt: string
    updatedAt: string
}

export type MenuIngredient = {
    idIngredient?: number
    qty: number
    ingredient: Ingredient
}

export type Category = {
    id?: number
    name: string
    status: number
    createdAt: string
    updatedAt: string
}

export type Menu = {
    id?: string
    name: string
    idCategory: null | number
    picture?: string
    file?: File
    desc: string
    price: number
    status: number
    createdAt: string
    updatedAt: string

    category?: Category
    ingredients?: MenuIngredient[]
    _count?: {
        detailTransaction: number
    }
}

export type OrderMenu = Category & {
    menus: Menu[]
}

export type Table = {
    id?: number
    tableName?: string
    isOccupied: number
    updatedAt: string
    TransactionCart?: TransactionCart[]
}

export type TransactionCart = {
    id: string
    transactionCartDetail: TransactionCartDetail[]
    createdAt: string
    cashier?: User
    updatedAt: string
    paid?: number
    paymentType?: string
    paidStatus?: number
    total?: number
    table?: Pick<Table, 'id' | 'tableName'>
    status: number
}

export type TransactionCartDetail = {
    id?: number
    idMenu?: string
    menu: Menu
    menuQty: number
}

export type Transaction = {
    id: string
    transactionCartDetail?: TransactionCartDetail[]
    total: number
    paid: number
    paymentType?: string
    cashier: User
    detail: DetailTransaction[]
    createdAt: string
    updatedAt: string
}

export type DetailTransaction = {
    id?: number
    menu: Menu
    menuQty: number
}

export type Report = {
    startDate: string
    endDate: string
    menuSummary: [
        {
            name: string
            price: number
            totalQty: number
        }
    ]
    transactionSummary: {
        _sum: {
            total: number
        }
    }
}

export type TokenPayload = {
    id: number
    username: string
    idRole: number
    exp: number
    iat: number
}

export type Role = {
    id: number
    role: string
    dashboard?: string
    menu?: { to: string; title: string; icon: FunctionalComponent; activeLinks?: string[] }[]
}

export const Roles: Role[] = [
    {
        id: 1,
        role: 'ADMIN',
        dashboard: 'User',
        menu: [
            {
                to: '/user',
                title: 'User',
                icon: UserGroupIcon
            },
            {
                to: '/ingredient',
                title: 'Ingredient',
                icon: CubeIcon
            },
            {
                to: '/menu',
                title: 'Menu',
                icon: RectangleStackIcon
            },
            {
                to: '/transaction-report',
                title: 'Transaction',
                icon: ClipboardDocumentListIcon
            }
        ]
    },
    {
        id: 2,
        role: 'MANAGER',
        dashboard: 'Ingredient',
        menu: [
            {
                to: '/ingredient',
                title: 'Ingredient',
                icon: CubeIcon,
                activeLinks: ['/ingredient-unit', '/ingredient-transaction']
            },
            {
                to: '/menu',
                title: 'Menu',
                icon: RectangleStackIcon,
                activeLinks: ['/category']
            },
            {
                to: '/report',
                title: 'Report',
                icon: ClipboardDocumentListIcon
            }
        ]
    },
    {
        id: 3,
        role: 'CASHIER',
        dashboard: 'TableOrder',
        menu: [
            {
                to: '/table',
                title: 'Table',
                icon: RectangleStackIcon,
                activeLinks: ['/new-transaction']
            },
            {
                to: '/queue',
                title: 'Queue',
                icon: Square3Stack3DIcon
            }
        ]
    },
    {
        id: 4,
        role: 'KITCHEN',
        dashboard: 'Queue',
        menu: [
            {
                to: '/queue',
                title: 'Queue',
                icon: ClipboardIcon
            }
        ]
    },
    {
        id: 5,
        role: 'GUEST',
        dashboard: 'Guest'
    }
]

export const defaultRole: Role = Roles[4]

export type OModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type ModalSize = {
    [k in OModalSize]: string
}

export const modalSize: ModalSize = {
    xs: 'md',
    sm: 'lg',
    md: '2xl',
    lg: '4xl',
    xl: '6xl'
}

export type TableLimit = 10 | 25 | 50
export const TableLimits: TableLimit[] = [10, 25, 50]

export type RouterRoutes = RouteRecordRaw & {
    meta?: {
        requiresAuth?: boolean
        role?: number[]
        breadcrumb?: string
    }
}

export type PaymentInfo = {
    idCart: string
    firstName: string
    email: string
    phone: string
    cartItems?: TransactionCartDetail[]
    finishLink: string
}
