import {
    ClipboardDocumentListIcon,
    ClipboardIcon,
    CubeIcon,
    RectangleStackIcon,
    Square3Stack3DIcon,
    UserGroupIcon
} from '@heroicons/vue/24/solid'
import type { FunctionalComponent } from 'vue'

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

export type Menu = {
    id?: string
    name: string
    price: number
    status: number
    createdAt: string
    updatedAt: string

    ingredients?: MenuIngredient[]
    _count?: {
        detailTransaction: number
    }
}

export type Table = {
    id?: number
    tableName?: string
    isOccupied: number
    updatedAt: string
    TransactionCart: TransactionCart[]
}

export type TransactionCart = {
    id: number
    transactionCartDetail: TransactionCartDetail[]
    createdAt: string
    updatedAt: string
    paid?: number
    total: number
    table?: {
        tableName: string
    }
}

export type TransactionCartDetail = {
    idMenu?: string
    menu: Menu
    menuQty: number
}

export type Transaction = {
    id: string
    total: number
    paid: number
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
                icon: RectangleStackIcon
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
        dashboard: 'NewTransaction',
        menu: [
            {
                to: '/new-transaction',
                title: 'New Transaction',
                icon: Square3Stack3DIcon
            },
            {
                to: '/queue',
                title: 'Queue',
                icon: ClipboardIcon
            },
            {
                to: '/table',
                title: 'Table',
                icon: RectangleStackIcon
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

export type OModalSize = 'xs' | 'sm' | 'md' | 'lg'

type ModalSize = {
    [k in OModalSize]: string
}

export const modalSize: ModalSize = {
    xs: 'md',
    sm: 'lg',
    md: '2xl',
    lg: '4xl'
}
