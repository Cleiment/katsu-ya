import { IngredientTransaction } from "@prisma/client"
import prisma from "../../tools/prisma"
import { ErrorResponse } from "../../definitions/errors"

export default class Ingredient {
    getIngredientUnits = async () => {
        const unit = await prisma.ingredientUnit.findMany({
            where: { status: 1 },
        })
        return unit
    }

    createIngredientUnit = async (name: string) => {
        await prisma.ingredientUnit.create({
            data: {
                name: name,
            },
        })

        return { success: "Ingredient Unit successfuly created!" }
    }

    editIngredientUnit = async (id: number, name: string) => {
        const unit = await prisma.ingredientUnit.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredientUnit.update({
            where: {
                id: id,
            },
            data: {
                name: name,
            },
        })

        return { success: "Ingredient Unit successfuly edited!" }
    }

    activateIngredientUnit = async (id: number) => {
        const unit = await prisma.ingredientUnit.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredientUnit.update({
            where: { id: id },
            data: { status: 1 },
        })

        return { success: "Ingredient Unit successfuly activated!" }
    }

    deactivateIngredientUnit = async (id: number) => {
        const unit = await prisma.ingredientUnit.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredientUnit.update({
            where: { id: id },
            data: { status: 0 },
        })

        return { success: "Ingredient Unit successfuly deactivated!" }
    }

    getIngredients = async () => {
        const ingredients = await prisma.ingredient.findMany({
            include: {
                unit: true,
                IngredientHold: true,
            },
            where: { status: 1 },
        })

        ingredients.map((item) => {
            item.IngredientHold.forEach((v) => {
                item.qty -= v.qty
            })

            return item
        })

        return ingredients
    }

    getIngredientById = async (id: number) => {
        const ingredient = await prisma.ingredient.findUniqueOrThrow({
            where: { id: id },
            include: {
                unit: true,
            },
        })

        return ingredient
    }

    createIngredient = async (name: string, idUnit: number) => {
        await prisma.ingredient.create({
            data: {
                name: name,
                idUnit: idUnit,
                qty: 0,
            },
        })

        return { success: "Ingredient successfuly created!" }
    }

    editIngredient = async (id: number, name: string, idUnit: number) => {
        const ingredient = await prisma.ingredient.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredient.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                idUnit: idUnit,
            },
        })

        return { success: "Ingredient successfuly edited!" }
    }

    activateIngredient = async (id: number) => {
        const ingredient = await prisma.ingredient.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredient.update({
            where: { id: id },
            data: { status: 1 },
        })

        return { success: "Ingredient successfuly activated!" }
    }

    deactivateIngredient = async (id: number) => {
        const ingredient = await prisma.ingredient.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.ingredient.update({
            where: { id: id },
            data: { status: 0 },
        })

        return { success: "Ingredient successfuly deactivated!" }
    }

    setIngredientsQty = async () => {
        const date = new Date()
        date.setMinutes(date.getMinutes() - 1)

        const transactionsQty = await prisma.ingredientTransaction.groupBy({
            by: ["idIngredient", "isUsage"],
            _sum: {
                qty: true,
            },
            where: {
                updatedAt: {
                    gte: date,
                },
            },
        })

        const qtyFinals: { idIngredient: number; qty: number }[] = []

        transactionsQty.forEach((item) => {
            const qty =
                item.isUsage == 0 ? item._sum.qty || 0 : -(item._sum.qty || 0)

            if (!qtyFinals.some((v) => v.idIngredient == item.idIngredient)) {
                qtyFinals.push({ idIngredient: item.idIngredient, qty: qty })
            } else {
                qtyFinals.forEach((v) => {
                    if (v.idIngredient == item.idIngredient) {
                        v.qty += qty
                        return
                    }
                })
            }
        })

        qtyFinals.forEach(async (item) => {
            await prisma.ingredient.update({
                data: {
                    qty: item.qty,
                },
                where: {
                    id: item.idIngredient,
                },
            })
        })
    }

    setIngredientQtyById = async (id: number, qty: number) => {
        await prisma.ingredient.update({
            data: {
                qty: {
                    increment: qty,
                },
            },
            where: {
                id: id,
            },
        })
    }

    getIngredientTransactions = async () => {
        const transactions = await prisma.ingredientTransaction.findMany({
            select: {
                id: true,
                stockUsage: {
                    select: {
                        idTransaction: true,
                    },
                },
                ingredient: {
                    select: {
                        id: true,
                        name: true,
                        unit: true,
                    },
                },
                isUsage: true,
                qty: true,
                user: {
                    select: {
                        username: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        })
        return transactions
    }

    getIngredientTransactionsByIdIngredient = async (idIngredient: number) => {
        const transactions =
            await prisma.ingredientTransaction.findUniqueOrThrow({
                select: {
                    id: true,
                    ingredient: {
                        select: {
                            name: true,
                            unit: true,
                        },
                    },
                    isUsage: true,
                    qty: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
                where: {
                    id: idIngredient,
                },
            })
        return transactions
    }

    createIngredientTransaction = async (
        idIngredient: number,
        qty: number,
        idUser: string,
        isUsage: number,
        idTransactionDetail: number | null = null
    ) => {
        await prisma.ingredientTransaction.create({
            data: {
                idTransactionDetail: idTransactionDetail,
                idIngredient: idIngredient,
                qty: qty,
                isUsage: isUsage,
                idUser: idUser,
            },
        })

        await this.setIngredientsQty()

        return { success: "Ingredient Transaction successfuly created!" }
    }

    editIngredientTransaction = async (
        id: number,
        idIngredient: number,
        qty: number,
        idUser: string,
        isUsage: number,
        idDetailTransaction: number | null = null
    ) => {
        const transaction =
            await prisma.ingredientTransaction.findUniqueOrThrow({
                where: { id: id },
            })

        if (transaction.idTransactionDetail) {
            throw new ErrorResponse("Transaction's usage can't be edited.")
        }

        transaction.idTransactionDetail = idDetailTransaction
        transaction.idIngredient = idIngredient
        transaction.idUser = idUser
        transaction.qty = qty
        transaction.isUsage = isUsage

        await prisma.ingredientTransaction.update({
            where: {
                id: id,
            },
            data: transaction,
        })

        await this.setIngredientsQty()

        return { success: "Ingredient Transaction successfuly edited!" }
    }

    deleteIngredientTransaction = async (id: number) => {
        const transaction =
            await prisma.ingredientTransaction.findUniqueOrThrow({
                where: { id: id },
            })

        if (transaction.idTransactionDetail) {
            throw new ErrorResponse("Transaction's usage can't be deleted.")
        }

        await this.setIngredientQtyById(
            transaction.idIngredient,
            -transaction.qty
        )

        await prisma.ingredientTransaction.delete({
            where: { id: id },
        })

        return { success: "Ingredient Transaction successfuly deleted!" }
    }
}
