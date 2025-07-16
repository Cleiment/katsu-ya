import { Prisma, TransactionCart, TransactionCartDetail, TransactionDetail } from "@prisma/client";
export default class Transaction {
    validateTransactionDetail: (data: TransactionDetail) => data is TransactionDetail;
    validateTransactionCartDetail: (data: TransactionCartDetail) => data is TransactionCartDetail;
    getTransactions: (startDate: string, endDate: string) => Promise<{
        startDate: string;
        endDate: string;
        menuSummary: {
            name: string;
            price: number;
            totalQty: number;
        }[];
        transactionSummary: Prisma.GetTransactionAggregateType<{
            _sum: {
                total: true;
            };
            where: {
                createdAt: {
                    gte: Date;
                    lt: Date;
                };
            };
        }>;
    }>;
    getTransactionById: (id: number) => Promise<{
        _count: {
            detail: number;
        };
        cashier: {
            username: string;
        };
        detail: {
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        idOrder: string;
        paid: number;
        paymentType: string;
        idUser: string;
    }>;
    getTransactionByIdOrder: (id: string) => Promise<({
        _count: {
            detail: number;
        };
        cashier: {
            username: string;
        };
        detail: {
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        idOrder: string;
        paid: number;
        paymentType: string;
        idUser: string;
    }) | ({
        transactionCartDetail: {
            menu: {
                name: string;
                price: number;
            };
        }[];
        _count: {
            transactionCartDetail: number;
        };
        cashier: {
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        paid: number;
        paymentType: string;
        idUser: string;
        idTable: number;
        paidStatus: number;
    })>;
    getAvailableTable: () => Promise<{
        id: number;
        tableName: string;
        isOccupied: number;
    }[]>;
    createTransaction: (orderedMenus: TransactionDetail[], idUser: string) => Promise<{
        success: string;
    }>;
    editTransaction: (id: number, orderedMenus: TransactionDetail[], idUser: string) => Promise<{
        success: string;
    }>;
    getTableOrder: () => Promise<({
        TransactionCart: ({
            transactionCartDetail: {
                menuQty: number;
                menu: {
                    ingredients: {
                        id: number;
                        idMenu: string;
                        createdAt: Date;
                        updatedAt: Date;
                        idIngredient: number;
                        qty: number;
                    }[];
                } & {
                    name: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    price: number;
                    status: number;
                    picture: string;
                    desc: string;
                    idCategory: number | null;
                };
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: number;
            paid: number;
            paymentType: string;
            idUser: string;
            idTable: number;
            paidStatus: number;
        })[];
    } & {
        id: number;
        updatedAt: Date;
        tableName: string;
        isOccupied: number;
    })[]>;
    getTransactionsCart: () => Promise<({
        transactionCartDetail: {
            menuQty: number;
            menu: {
                ingredients: {
                    id: number;
                    idMenu: string;
                    createdAt: Date;
                    updatedAt: Date;
                    idIngredient: number;
                    qty: number;
                }[];
            } & {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                status: number;
                picture: string;
                desc: string;
                idCategory: number | null;
            };
        }[];
        table: {
            tableName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        paid: number;
        paymentType: string;
        idUser: string;
        idTable: number;
        paidStatus: number;
    })[]>;
    getOrderByTable: (idTable: number) => Promise<({
        transactionCartDetail: {
            menuQty: number;
            menu: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                status: number;
                picture: string;
                desc: string;
                idCategory: number | null;
            };
        }[];
        table: {
            tableName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        paid: number;
        paymentType: string;
        idUser: string;
        idTable: number;
        paidStatus: number;
    })[]>;
    getTransactionCartById: (id: string) => Promise<{
        transactionCartDetail: {
            id: number;
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
        _count: {
            transactionCartDetail: number;
        };
        cashier: {
            username: string;
        };
        table: {
            id: number;
            tableName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        paid: number;
        paymentType: string;
        idUser: string;
        idTable: number;
        paidStatus: number;
    }>;
    createTransactionCart: (orderedMenus: TransactionCartDetail[], idUser: string, idTable: number) => Promise<{
        transactionCartDetail: {
            id: number;
            menuQty: number;
            menu: {
                ingredients: {
                    qty: number;
                    ingredient: {
                        id: number;
                    };
                }[];
            } & {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                status: number;
                picture: string;
                desc: string;
                idCategory: number | null;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: number;
        paid: number;
        paymentType: string;
        idUser: string;
        idTable: number;
        paidStatus: number;
    }>;
    getPaymentToken: (idCart: string, firstName: string, email: string, phone: string) => Promise<{
        token: string;
    }>;
    finishTransactionCart: (paid: number, cart: TransactionCart) => Promise<{
        transactionId: string;
    }>;
    payCart: (idCart: string, paymentType: string) => Promise<{
        transactionId: string;
    }>;
}
