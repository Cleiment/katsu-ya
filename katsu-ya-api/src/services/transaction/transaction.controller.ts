import {
    Prisma,
    TransactionCart,
    TransactionCartDetail,
    TransactionDetail,
} from "@prisma/client"
import prisma from "../../tools/prisma"

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
            where: {
                status: 0,
            },
        })

        return res
    }

    getTransactionCartById = async (id: number) => {
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

        return { success: "Transaction successfuly created!" }
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

        return { transactionId: res.id }
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
