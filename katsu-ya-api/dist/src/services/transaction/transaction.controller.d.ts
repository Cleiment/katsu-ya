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
        cashier: {
            username: string;
        };
        _count: {
            detail: number;
        };
        detail: {
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
    } & {
        total: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        paid: number;
        paymentType: string;
        idOrder: string;
    }>;
    getTransactionByIdOrder: (id: string) => Promise<({
        cashier: {
            username: string;
        };
        _count: {
            detail: number;
        };
        detail: {
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
    } & {
        total: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        paid: number;
        paymentType: string;
        idOrder: string;
    }) | ({
        cashier: {
            username: string;
        };
        _count: {
            transactionCartDetail: number;
        };
        transactionCartDetail: {
            menu: {
                name: string;
                price: number;
            };
        }[];
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        idTable: number;
        paid: number;
        paymentType: string;
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
                        createdAt: Date;
                        updatedAt: Date;
                        qty: number;
                        idIngredient: number;
                        idMenu: string;
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
                };
            }[];
        } & {
            total: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            idUser: string;
            idTable: number;
            paid: number;
            paymentType: string;
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
                    createdAt: Date;
                    updatedAt: Date;
                    qty: number;
                    idIngredient: number;
                    idMenu: string;
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
            };
        }[];
        table: {
            tableName: string;
        };
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        idTable: number;
        paid: number;
        paymentType: string;
        paidStatus: number;
    })[]>;
    getOrderByTable: (idTable: number) => Promise<({
        transactionCartDetail: {
            menuQty: number;
            menu: {
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
        }[];
        table: {
            tableName: string;
        };
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        idTable: number;
        paid: number;
        paymentType: string;
        paidStatus: number;
    })[]>;
    getTransactionCartById: (id: string) => Promise<{
        cashier: {
            username: string;
        };
        _count: {
            transactionCartDetail: number;
        };
        transactionCartDetail: {
            id: number;
            menuQty: number;
            menu: {
                name: string;
                price: number;
            };
        }[];
        table: {
            id: number;
            tableName: string;
        };
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        idTable: number;
        paid: number;
        paymentType: string;
        paidStatus: number;
    }>;
    createTransactionCart: (orderedMenus: TransactionCartDetail[], idUser: string, idTable: number) => Promise<{
        transactionCartDetail: {
            id: number;
            menuQty: number;
            menu: {
                ingredients: {
                    ingredient: {
                        id: number;
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
            };
        }[];
    } & {
        total: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        idUser: string;
        idTable: number;
        paid: number;
        paymentType: string;
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
