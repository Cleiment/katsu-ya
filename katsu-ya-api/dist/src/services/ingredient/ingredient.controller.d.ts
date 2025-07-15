export default class Ingredient {
    getIngredientUnitCounts: (limit?: number) => Promise<{
        total: number;
        totalPages: number;
    }>;
    getIngredientCounts: (limit?: number) => Promise<{
        total: number;
        totalPages: number;
    }>;
    getIngredientUnitByPage: (page: number, limit: number) => Promise<{
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        data: {
            status: number;
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getAllIngredientUnit: () => Promise<{
        status: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createIngredientUnit: (name: string) => Promise<{
        success: string;
    }>;
    editIngredientUnit: (id: number, name: string) => Promise<{
        success: string;
    }>;
    activateIngredientUnit: (id: number) => Promise<{
        success: string;
    }>;
    deactivateIngredientUnit: (id: number) => Promise<{
        success: string;
    }>;
    getIngredientByPage: (page: number, limit: number, showDeactivated: boolean) => Promise<{
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        data: ({
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
        })[];
    }>;
    getAllIngredient: () => Promise<({
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
    })[]>;
    getIngredientById: (id: number) => Promise<{
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
    }>;
    createIngredient: (name: string, idUnit: number) => Promise<{
        success: string;
    }>;
    editIngredient: (id: number, name: string, idUnit: number) => Promise<{
        success: string;
    }>;
    activateIngredient: (id: number) => Promise<{
        success: string;
    }>;
    deactivateIngredient: (id: number) => Promise<{
        success: string;
    }>;
    setIngredientsQty: () => Promise<void>;
    setIngredientQtyById: (id: number, qty: number) => Promise<void>;
    getIngredientTransactions: () => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        ingredient: {
            id: number;
            name: string;
            unit: {
                status: number;
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        };
        qty: number;
        isUsage: number;
        stockUsage: {
            idTransaction: number;
        } | null;
        user: {
            username: string;
        };
    }[]>;
    getIngredientTransactionsByIdIngredient: (idIngredient: number) => Promise<{
        id: number;
        ingredient: {
            name: string;
            unit: {
                status: number;
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        };
        qty: number;
        isUsage: number;
        user: {
            username: string;
        };
    }>;
    createIngredientTransaction: (idIngredient: number, qty: number, idUser: string, isUsage: number, idTransactionDetail?: number | null) => Promise<{
        success: string;
    }>;
    editIngredientTransaction: (id: number, idIngredient: number, qty: number, idUser: string, isUsage: number, idDetailTransaction?: number | null) => Promise<{
        success: string;
    }>;
    deleteIngredientTransaction: (id: number) => Promise<{
        success: string;
    }>;
}
