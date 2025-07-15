import { MenuCategory, MenuIngredient } from "@prisma/client";
export default class Menu {
    validateMenuIngredient: (data: MenuIngredient) => data is MenuIngredient;
    getCounts: (limit?: number) => Promise<{
        total: number;
        totalPages: number;
    }>;
    getByPage: (page: number, limit: number, showDeactivated: boolean) => Promise<{
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        data: ({
            ingredients: {
                ingredient: {
                    unit: {
                        status: number;
                        id: number;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                    IngredientHold: {
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        qty: number;
                        idCartDetail: number;
                        idIngredient: number;
                    }[];
                } & {
                    status: number;
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    qty: number;
                    idUnit: number;
                };
                qty: number;
            }[];
            _count: {
                transactionDetail: number;
            };
            category: {
                status: number;
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
        } & {
            status: number;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            picture: string;
            desc: string;
            idCategory: number | null;
        })[];
    }>;
    getAll: () => Promise<({
        ingredients: {
            ingredient: {
                unit: {
                    status: number;
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
                IngredientHold: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    qty: number;
                    idCartDetail: number;
                    idIngredient: number;
                }[];
            } & {
                status: number;
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                qty: number;
                idUnit: number;
            };
            qty: number;
        }[];
        _count: {
            transactionDetail: number;
        };
    } & {
        status: number;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        picture: string;
        desc: string;
        idCategory: number | null;
    })[]>;
    getMenuById: (id: string) => Promise<{
        ingredients: {
            ingredient: {
                unit: {
                    status: number;
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                status: number;
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                qty: number;
                idUnit: number;
            };
            qty: number;
        }[];
        _count: {
            transactionDetail: number;
        };
    } & {
        status: number;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        picture: string;
        desc: string;
        idCategory: number | null;
    }>;
    getOrderMenu: () => Promise<({
        menus: ({
            ingredients: {
                ingredient: {
                    unit: {
                        status: number;
                        id: number;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                    IngredientHold: {
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        qty: number;
                        idCartDetail: number;
                        idIngredient: number;
                    }[];
                } & {
                    status: number;
                    id: number;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    qty: number;
                    idUnit: number;
                };
                qty: number;
            }[];
        } & {
            status: number;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            picture: string;
            desc: string;
            idCategory: number | null;
        })[];
    } & {
        status: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createMenu: (name: string, price: number, ingredients: MenuIngredient[], category: MenuCategory, picture: string, desc: string) => Promise<{
        success: string;
    }>;
    editMenu: (id: string, name: string, price: number, ingredients: MenuIngredient[], category: MenuCategory, picture: (string | null) | undefined, desc: string) => Promise<{
        data: {
            status: number;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            picture: string;
            desc: string;
            idCategory: number | null;
        };
        success: string;
    }>;
    deactivateMenu: (id: string) => Promise<{
        success: string;
    }>;
    activateMenu: (id: string) => Promise<{
        success: string;
    }>;
    deleteMenu: (id: string) => Promise<{
        success: string;
    }>;
}
