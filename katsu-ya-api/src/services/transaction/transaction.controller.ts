import {
    Menu,
    Prisma,
    TransactionCart,
    TransactionCartDetail,
    TransactionDetail,
} from "@prisma/client"
import prisma from "../../tools/prisma"
import { connect } from "http2"
import { ErrorResponse } from "../../definitions/errors"
import { midtransServerKey } from "../../config/env.config"

const midtransClient = require("midtrans-client")

export default class Transaction {
    validateTransactionDetail = (
        data: TransactionDetail
    ): data is TransactionDetail =>
        (data as TransactionDetail) &&
        data.idMenu !== undefined &&
        data.menuQty !== undefined

    validateTransactionCartDetail = (
        data: TransactionCartDetail
    ): data is TransactionCartDetail =>
        (data as TransactionCartDetail) &&
        data.idMenu !== undefined &&
        data.menuQty !== undefined

    getTransactions = async (startDate: string, endDate: string) => {
        const dateStartDate = new Date(startDate)
        const dateEndDate = new Date(endDate)
        dateStartDate.setHours(0, 0, 0, 0)
        dateEndDate.setHours(0, 0, 0, 0)

        dateEndDate.setDate(dateEndDate.getDate() + 1)

        const totalMenuQty = await prisma.transactionDetail.groupBy({
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
        })

        const menu = await prisma.menu.findMany({
            select: {
                id: true,
                name: true,
                price: true,
            },
        })
        const totalTransaction = await prisma.transaction.aggregate({
            _sum: {
                total: true,
            },
            where: {
                createdAt: {
                    gte: dateStartDate,
                    lt: dateEndDate,
                },
            },
        })

        let menuSummary: { name: string; price: number; totalQty: number }[] =
            []
        menuSummary = totalMenuQty.map((item) => {
            const total = menu.filter((v) => item.idMenu == v.id)[0]

            return {
                name: total.name,
                price: total.price,
                totalQty: item._sum.menuQty || 0,
            }
        })

        return {
            startDate: startDate,
            endDate: endDate,
            menuSummary: menuSummary,
            transactionSummary: totalTransaction,
        }
    }

    getTransactionById = async (id: number) => {
        const transaction = await prisma.transaction.findUniqueOrThrow({
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
        })
        return transaction
    }

    getTransactionByIdOrder = async (id: string) => {
        const transaction = await prisma.transaction.findUnique({
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
        })

        if (transaction) return transaction
        const transactionCart = await prisma.transactionCart.findUniqueOrThrow({
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
        })

        return transactionCart
    }

    getAvailableTable = async () => {
        const table = await prisma.table.findMany({
            select: {
                id: true,
                tableName: true,
                isOccupied: true,
            },
        })

        return table
    }

    createTransaction = async (
        orderedMenus: TransactionDetail[],
        idUser: string
    ) => {
        const details: Prisma.TransactionDetailCreateWithoutTransactionInput[] =
            orderedMenus.map((item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
            }))

        await prisma.transaction.create({
            data: {
                cashier: { connect: { id: idUser } },
                detail: { create: details },
            },
        })

        return { success: "Transaction successfuly created!" }
    }

    editTransaction = async (
        id: number,
        orderedMenus: TransactionDetail[],
        idUser: string
    ) => {
        const transaction = await prisma.transaction.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.transactionDetail.deleteMany({
            where: {
                idTransaction: transaction.id,
            },
        })

        const details: Prisma.TransactionDetailCreateInput[] = orderedMenus.map(
            (item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
                transaction: { connect: { id: transaction.id } },
            })
        )

        await prisma.transaction.update({
            where: { id: id },
            data: {
                cashier: { connect: { id: idUser } },
                detail: { create: details },
            },
        })

        return { success: "Transaction successfuly edited!" }
    }

    getTableOrder = async () => {
        const res = await prisma.table.findMany({
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
        })

        return res
    }

    getTransactionsCart = async () => {
        const res = await prisma.transactionCart.findMany({
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
        })

        return res
    }

    getOrderByTable = async (idTable: number) => {
        const res = await prisma.transactionCart.findMany({
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
        })

        return res
    }

    getTransactionCartById = async (id: string) => {
        const transaction = await prisma.transactionCart.findUniqueOrThrow({
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
        })
        return transaction
    }

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

    createTransactionCart = async (
        orderedMenus: TransactionCartDetail[],
        idUser: string,
        idTable: number
    ) => {
        const details: Prisma.TransactionCartDetailCreateWithoutCartInput[] =
            orderedMenus.map((item) => ({
                menu: { connect: { id: item.idMenu } },
                menuQty: item.menuQty,
            }))

        const newCart = await prisma.transactionCart.create({
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
        })

        await prisma.table.update({
            data: { isOccupied: 1 },
            where: { id: idTable },
        })

        const ingredients: {
            id: number
            qtyUsage: number
            idTransactionCartDetail: number
        }[] = []

        let total = 0
        newCart.transactionCartDetail.forEach((item) => {
            total += item.menuQty * item.menu.price
            item.menu.ingredients.forEach((v) => {
                ingredients.push({
                    id: v.ingredient.id,
                    qtyUsage: v.qty * item.menuQty,
                    idTransactionCartDetail: item.id,
                })
            })
        })

        await prisma.transactionCart.update({
            data: {
                total: total,
            },
            where: {
                id: newCart.id,
            },
        })

        const ingredientHold: Prisma.IngredientHoldCreateManyInput[] =
            ingredients.map((item) => ({
                idCartDetail: item.idTransactionCartDetail,
                idIngredient: item.id,
                qty: item.qtyUsage,
            }))

        await prisma.ingredientHold.createMany({ data: ingredientHold })

        return newCart
    }

    getPaymentToken = async (
        idCart: string,
        firstName: string,
        email: string,
        phone: string,
        finishLink: string
    ) => {
        const cart = await this.getTransactionCartById(idCart)

        // Create Snap API instance
        let snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction: false,
            serverKey: midtransServerKey,
        })

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
        }

        let token = ""
        await snap.createTransaction(parameter).then((transaction: any) => {
            let transactionToken: string = transaction.token
            token = transactionToken
        })

        if (token !== "") {
            return {
                token: token,
            }
        } else {
            throw new ErrorResponse()
        }
    }

    finishTransactionCart = async (paid: number, cart: TransactionCart) => {
        const transactionCart = await prisma.transactionCart.findUniqueOrThrow({
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
        })

        const transaction: Prisma.TransactionCreateInput = {
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
        }

        const ingredients: {
            idIngredient: number
            idHold: number
            qtyUsage: number
        }[] = []

        transactionCart.transactionCartDetail.forEach((item) => {
            item.IngredientHold.forEach((v) => {
                ingredients.push({
                    idIngredient: v.idIngredient,
                    qtyUsage: v.qty,
                    idHold: v.id,
                })
            })
        })

        ingredients.forEach(async (item) => {
            await prisma.ingredient.update({
                data: {
                    qty: {
                        decrement: item.qtyUsage,
                    },
                },
                where: {
                    id: item.idIngredient,
                },
            })
        })

        await prisma.ingredientHold.deleteMany({
            where: {
                id: {
                    in: ingredients.map((item) => item.idHold),
                },
            },
        })

        await prisma.table.update({
            data: { isOccupied: 0 },
            where: { id: transactionCart.idTable },
        })

        await prisma.transactionCartDetail.deleteMany({
            where: {
                id: {
                    in: transactionCart.transactionCartDetail.map(
                        (item) => item.id
                    ),
                },
            },
        })

        await prisma.transactionCart.delete({
            where: { id: transactionCart.id },
        })

        const res = await prisma.transaction.create({
            data: transaction,
        })

        return { transactionId: res.idOrder }
    }

    payCart = async (idCart: string, paymentType: string) => {
        const transactionCart = await prisma.transactionCart.findUniqueOrThrow({
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
        })

        await prisma.transactionCart.update({
            data: {
                paid: transactionCart.total,
                paymentType: paymentType,
                paidStatus: 1,
            },
            where: { id: idCart },
        })

        return { success: "Order have been paid succesfuly!" }
    }

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
