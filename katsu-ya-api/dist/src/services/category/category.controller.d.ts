export default class Category {
    getCounts: (limit?: number) => Promise<{
        total: number;
        totalPages: number;
    }>;
    getByPage: (page: number, limit: number) => Promise<{
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
    getAll: () => Promise<{
        status: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getCategoryById: (id: number) => Promise<{
        _count: {
            menus: number;
        };
    } & {
        status: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createCategory: (name: string) => Promise<{
        success: string;
    }>;
    editCategory: (id: number, name: string) => Promise<{
        data: {
            status: number;
            id: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        success: string;
    }>;
    deactivateCategory: (id: number) => Promise<{
        success: string;
    }>;
    activateCategory: (id: number) => Promise<{
        success: string;
    }>;
    deleteCategory: (id: number) => Promise<{
        success: string;
    }>;
}
