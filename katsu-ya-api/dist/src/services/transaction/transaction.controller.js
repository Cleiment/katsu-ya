"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../tools/prisma"));
const errors_1 = require("../../definitions/errors");
const env_config_1 = require("../../config/env.config");
const midtransClient = require("midtrans-client");
class Transaction {
    constructor() {
        this.validateTransactionDetail = (data) => data &&
            data.idMenu !== undefined &&
            data.menuQty !== undefined;
        this.validateTransactionCartDetail = (data) => data &&
            data.idMenu !== undefined &&
            data.menuQty !== undefined;
        this.getTransactions = (startDate, endDate) => __awaiter(this, void 0, void 0, function* () {
            const dateStartDate = new Date(startDate);
            const dateEndDate = new Date(endDate);
            dateStartDate.setHours(0, 0, 0, 0);
            dateEndDate.setHours(0, 0, 0, 0);
            dateEndDate.setDate(dateEndDate.getDate() + 1);
            const totalMenuQty = yield prisma_1.default.transactionDetail.groupBy({
                by: ["idMenu"],
                _sum: {
                    menuQty: true,
                },
                where: {
                    createdAt: {
                        gte: dateStartDate,
                        lt: dateEndDate,
                    },
                },
            });
            const menu = yield prisma_1.default.menu.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                },
            });
            const totalTransaction = yield prisma_1.default.transaction.aggregate({
                _sum: {
                    total: true,
                },
                where: {
                    createdAt: {
                        gte: dateStartDate,
                        lt: dateEndDate,
                    },
                },
            });
            let menuSummary = [];
            menuSummary = totalMenuQty.map((item) => {
                const total = menu.filter((v) => item.idMenu == v.id)[0];
                return {
                    name: total.name,
                    price: total.price,
                    totalQty: item._sum.menuQty || 0,
                };
            });
            return {
                startDate: startDate,
                endDate: endDate,
                menuSummary: menuSummary,
                transactionSummary: totalTransaction,
            };
        });
        this.getTransactionById = (id) => __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.default.transaction.findUniqueOrThrow({
                include: {
                    detail: {
                        select: {
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                },
                            },
                            menuQty: true,
                        },
                    },
                    cashier: {
                        select: {
                            username: true,
                        },
                    },
                    _count: {
                        select: {
                            detail: true,
                        },
                    },
                },
                where: { id: id },
            });
            return transaction;
        });
        this.getTransactionByIdOrder = (id) => __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.default.transaction.findUnique({
                include: {
                    detail: {
                        select: {
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                },
                            },
                            menuQty: true,
                        },
                    },
                    cashier: {
                        select: {
                            username: true,
                        },
                    },
                    _count: {
                        select: {
                            detail: true,
                        },
                    },
                },
                where: { idOrder: id },
            });
            if (transaction)
                return transaction;
            const transactionCart = yield prisma_1.default.transactionCart.findUniqueOrThrow({
                include: {
                    transactionCartDetail: {
                        select: {
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                },
                            },
                            menuQty: true,
                        },
                    },
                    cashier: {
                        select: { username: true },
                    },
                    _count: {
                        select: { transactionCartDetail: true },
                    },
                },
                where: { id: id },
            });
            return transactionCart;
        });
        this.getAvailableTable = () => __awaiter(this, void 0, void 0, function* () {
            const table = yield prisma_1.default.table.findMany({
                select: {
                    id: true,
                    tableName: true,
                    isOccupied: true,
                },
            });
            return table;
        });
        this.createTransaction = (orderedMenus, idUser) => __awaiter(this, void 0, void 0, function* () {
            const details = orderedMenus.map((item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
            }));
            yield prisma_1.default.transaction.create({
                data: {
                    cashier: { connect: { id: idUser } },
                    detail: { create: details },
                },
            });
            return { success: "Transaction successfuly created!" };
        });
        this.editTransaction = (id, orderedMenus, idUser) => __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.default.transaction.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.transactionDetail.deleteMany({
                where: {
                    idTransaction: transaction.id,
                },
            });
            const details = orderedMenus.map((item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
                transaction: { connect: { id: transaction.id } },
            }));
            yield prisma_1.default.transaction.update({
                where: { id: id },
                data: {
                    cashier: { connect: { id: idUser } },
                    detail: { create: details },
                },
            });
            return { success: "Transaction successfuly edited!" };
        });
        this.getTableOrder = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.default.table.findMany({
                include: {
                    TransactionCart: {
                        include: {
                            transactionCartDetail: {
                                select: {
                                    menu: {
                                        include: {
                                            ingredients: true,
                                        },
                                    },
                                    menuQty: true,
                                },
                            },
                        },
                    },
                },
            });
            return res;
        });
        this.getTransactionsCart = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.default.transactionCart.findMany({
                include: {
                    table: {
                        select: {
                            tableName: true,
                        },
                    },
                    transactionCartDetail: {
                        select: {
                            menu: {
                                include: {
                                    ingredients: true,
                                },
                            },
                            menuQty: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
                // where: {
                //     status: 0,
                // },
            });
            return res;
        });
        this.getOrderByTable = (idTable) => __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.default.transactionCart.findMany({
                include: {
                    table: {
                        select: {
                            tableName: true,
                        },
                    },
                    transactionCartDetail: {
                        select: {
                            menu: true,
                            menuQty: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    idTable: idTable,
                },
            });
            return res;
        });
        this.getTransactionCartById = (id) => __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.default.transactionCart.findUniqueOrThrow({
                include: {
                    transactionCartDetail: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    name: true,
                                    price: true,
                                },
                            },
                            menuQty: true,
                        },
                    },
                    cashier: {
                        select: {
                            username: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            tableName: true,
                        },
                    },
                    _count: {
                        select: {
                            transactionCartDetail: true,
                        },
                    },
                },
                where: { id: id },
            });
            return transaction;
        });
        // createTransactionCart = async (
        //     orderedMenus: TransactionCartDetail[],
        //     idUser: string,
        //     idTable: number
        // ) => {
        //     const newCart = await prisma.transactionCart.create({
        //         data: {
        //             cashier: { connect: { id: idUser } },
        //             table: { connect: { id: idTable } },
        //         },
        //         include: {
        //             transactionCartDetail: {
        //                 select: {
        //                     id: true,
        //                     menu: {
        //                         include: {
        //                             ingredients: {
        //                                 select: {
        //                                     ingredient: {
        //                                         select: {
        //                                             id: true,
        //                                         },
        //                                     },
        //                                     qty: true,
        //                                 },
        //                             },
        //                         },
        //                     },
        //                     menuQty: true,
        //                 },
        //             },
        //         },
        //     })
        //     await prisma.table.update({
        //         data: { isOccupied: 1 },
        //         where: { id: idTable },
        //     })
        //     const ingredients: {
        //         id: number
        //         qtyUsage: number
        //         idTransactionCartDetail: number
        //     }[] = []
        //     let total = 0
        //     newCart.transactionCartDetail.forEach((item) => {
        //         total += item.menuQty * item.menu.price
        //         item.menu.ingredients.forEach((v) => {
        //             ingredients.push({
        //                 id: v.ingredient.id,
        //                 qtyUsage: v.qty * item.menuQty,
        //                 idTransactionCartDetail: item.id,
        //             })
        //         })
        //     })
        //     await prisma.transactionCart.update({
        //         where: {
        //             id: newCart.id,
        //         },
        //     })
        //     const ingredientHold: Prisma.IngredientHoldCreateManyInput[] =
        //         ingredients.map((item) => ({
        //             idCartDetail: item.idTransactionCartDetail,
        //             idIngredient: item.id,
        //             qty: item.qtyUsage,
        //         }))
        //     await prisma.ingredientHold.createMany({ data: ingredientHold })
        //     return { success: "Item added to Cart!" }
        // }
        // deleteFromCart = async (idCartDetail: number) => {
        //     const cartItem = await prisma.transactionCartDetail.findUniqueOrThrow({
        //         where: { id: idCartDetail },
        //         include: {
        //             menu: {
        //                 select: {
        //                     price: true,
        //                 },
        //             },
        //         },
        //     })
        //     const cart = await prisma.transactionCart.findUniqueOrThrow({
        //         where: {
        //             id: cartItem.idCart,
        //         },
        //     })
        //     await prisma.transactionCart.update({
        //         where: {
        //             id: cartItem.idCart,
        //         },
        //         data: {
        //             total: cart.total - cartItem.menuQty * cartItem.menu.price,
        //         },
        //     })
        //     await prisma.ingredientHold.deleteMany({
        //         where: {
        //             idCartDetail: idCartDetail,
        //         },
        //     })
        //     await prisma.transactionCartDetail.delete({
        //         where: { id: idCartDetail },
        //     })
        //     return { success: "Removed Item from Cart" }
        // }
        this.createTransactionCart = (orderedMenus, idUser, idTable) => __awaiter(this, void 0, void 0, function* () {
            const details = orderedMenus.map((item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
            }));
            const newCart = yield prisma_1.default.transactionCart.create({
                data: {
                    cashier: { connect: { id: idUser } },
                    transactionCartDetail: { create: details },
                    table: { connect: { id: idTable } },
                    paidStatus: 0,
                },
                include: {
                    transactionCartDetail: {
                        select: {
                            id: true,
                            menu: {
                                include: {
                                    ingredients: {
                                        select: {
                                            ingredient: {
                                                select: {
                                                    id: true,
                                                },
                                            },
                                            qty: true,
                                        },
                                    },
                                },
                            },
                            menuQty: true,
                        },
                    },
                },
            });
            yield prisma_1.default.table.update({
                data: { isOccupied: 1 },
                where: { id: idTable },
            });
            const ingredients = [];
            let total = 0;
            newCart.transactionCartDetail.forEach((item) => {
                total += item.menuQty * item.menu.price;
                item.menu.ingredients.forEach((v) => {
                    ingredients.push({
                        id: v.ingredient.id,
                        qtyUsage: v.qty * item.menuQty,
                        idTransactionCartDetail: item.id,
                    });
                });
            });
            yield prisma_1.default.transactionCart.update({
                data: {
                    total: total,
                },
                where: {
                    id: newCart.id,
                },
            });
            const ingredientHold = ingredients.map((item) => ({
                idCartDetail: item.idTransactionCartDetail,
                idIngredient: item.id,
                qty: item.qtyUsage,
            }));
            yield prisma_1.default.ingredientHold.createMany({ data: ingredientHold });
            return newCart;
        });
        this.getPaymentToken = (idCart, firstName, email, phone, finishLink) => __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.getTransactionCartById(idCart);
            // Create Snap API instance
            let snap = new midtransClient.Snap({
                // Set to true if you want Production Environment (accept real transaction).
                isProduction: false,
                serverKey: env_config_1.midtransServerKey,
            });
            let parameter = {
                transaction_details: {
                    order_id: cart.id,
                    gross_amount: cart.total,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: firstName,
                    email: email,
                    phone: phone,
                },
                item_details: cart.transactionCartDetail.map((item) => ({
                    name: item.menu.name,
                    quantity: item.menuQty,
                    price: item.menu.price,
                })),
                // gopay: {
                //     enable_callback: true,
                // },
                callbacks: {
                    finish: "javascript:void(0)",
                },
            };
            let token = "";
            yield snap.createTransaction(parameter).then((transaction) => {
                let transactionToken = transaction.token;
                token = transactionToken;
            });
            if (token !== "") {
                return {
                    token: token,
                };
            }
            else {
                throw new errors_1.ErrorResponse();
            }
        });
        this.finishTransactionCart = (paid, cart) => __awaiter(this, void 0, void 0, function* () {
            const transactionCart = yield prisma_1.default.transactionCart.findUniqueOrThrow({
                include: {
                    transactionCartDetail: {
                        select: {
                            id: true,
                            IngredientHold: true,
                            menuQty: true,
                            idMenu: true,
                        },
                    },
                },
                where: { id: cart.id },
            });
            const transaction = {
                paid: paid,
                total: cart.total,
                idOrder: cart.id,
                paymentType: transactionCart.paymentType,
                cashier: { connect: { id: transactionCart.idUser } },
                detail: {
                    create: transactionCart.transactionCartDetail.map((item) => ({
                        menuQty: item.menuQty,
                        menu: { connect: { id: item.idMenu } },
                    })),
                },
            };
            const ingredients = [];
            transactionCart.transactionCartDetail.forEach((item) => {
                item.IngredientHold.forEach((v) => {
                    ingredients.push({
                        idIngredient: v.idIngredient,
                        qtyUsage: v.qty,
                        idHold: v.id,
                    });
                });
            });
            ingredients.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield prisma_1.default.ingredient.update({
                    data: {
                        qty: {
                            decrement: item.qtyUsage,
                        },
                    },
                    where: {
                        id: item.idIngredient,
                    },
                });
            }));
            yield prisma_1.default.ingredientHold.deleteMany({
                where: {
                    id: {
                        in: ingredients.map((item) => item.idHold),
                    },
                },
            });
            yield prisma_1.default.table.update({
                data: { isOccupied: 0 },
                where: { id: transactionCart.idTable },
            });
            yield prisma_1.default.transactionCartDetail.deleteMany({
                where: {
                    id: {
                        in: transactionCart.transactionCartDetail.map((item) => item.id),
                    },
                },
            });
            yield prisma_1.default.transactionCart.delete({
                where: { id: transactionCart.id },
            });
            const res = yield prisma_1.default.transaction.create({
                data: transaction,
            });
            return { transactionId: res.idOrder };
        });
        this.payCart = (idCart, paymentType) => __awaiter(this, void 0, void 0, function* () {
            const transactionCart = yield prisma_1.default.transactionCart.findUniqueOrThrow({
                include: {
                    transactionCartDetail: {
                        select: {
                            id: true,
                            IngredientHold: true,
                            menuQty: true,
                            idMenu: true,
                        },
                    },
                },
                where: { id: idCart },
            });
            yield prisma_1.default.transactionCart.update({
                data: {
                    paid: transactionCart.total,
                    paymentType: paymentType,
                    paidStatus: 1,
                },
                where: { id: idCart },
            });
            return { success: "Order have been paid succesfuly!" };
        });
        // cancelTransactionCart = async (id: number) => {
        //     const transaction = await prisma.transaction.findUniqueOrThrow({
        //         where: { id: id },
        //     })
        //     await prisma.transactionCart.update({
        //         where: { id: id },
        //         data: { status: 0 },
        //     })
        //     return { success: "Transaction successfuly deactivated!" }
        // }
    }
}
exports.default = Transaction;
