import { Ingredient, MenuIngredient, Prisma } from "@prisma/client"
import prisma from "../../tools/prisma"
import { ErrorResponse } from "../../definitions/errors"

export default class Menu {
    validateMenuIngredient = (data: MenuIngredient): data is MenuIngredient =>
        (data as MenuIngredient) &&
        data.idIngredient !== undefined &&
        data.qty !== undefined

    getMenus = async () => {
        const res = await prisma.menu.findMany({
            include: {
                ingredients: {
                    select: {
                        qty: true,
                        ingredient: {
                            include: {
                                IngredientHold: true,
                                unit: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        transactionDetail: true,
                    },
                },
            },
            where: { status: 1 },
        })

        res.map((item) => {
            item.ingredients.forEach((a) => {
                a.ingredient.IngredientHold.forEach((v) => {
                    a.ingredient.qty -= v.qty
                })
            })

            return item
        })
        return res
    }

    getMenuById = async (id: string) => {
        const menu = await prisma.menu.findUniqueOrThrow({
            include: {
                ingredients: {
                    select: {
                        qty: true,
                        ingredient: {
                            include: {
                                unit: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        transactionDetail: true,
                    },
                },
            },
            where: { id: id, status: 1 },
        })
        return menu
    }

    createMenu = async (
        name: string,
        price: number,
        ingredients: MenuIngredient[]
    ) => {
        const menuIngredients: Prisma.MenuIngredientCreateWithoutMenuInput[] =
            ingredients.map((item) => ({
                ingredient: { connect: { id: item.idIngredient } },
                qty: item.qty,
            }))

        await prisma.menu.create({
            data: {
                name: name,
                price: price,
                ingredients: {
                    create: menuIngredients,
                },
            },
        })

        return { success: "Menu successfuly created!" }
    }

    editMenu = async (
        id: string,
        name: string,
        price: number,
        ingredients: MenuIngredient[]
    ) => {
        const menu = await prisma.menu.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menuIngredient.deleteMany({
            where: {
                idMenu: menu.id,
            },
        })

        const menuIngredients: Prisma.MenuIngredientCreateInput[] =
            ingredients.map((item) => ({
                ingredient: { connect: { id: item.idIngredient } },
                qty: item.qty,
                menu: { connect: { id: menu.id } },
            }))

        await prisma.menu.update({
            where: { id: id },
            data: {
                name: name,
                price: price,
                ingredients: {
                    create: menuIngredients,
                },
            },
        })

        return { success: "Menu successfuly edited" }
    }

    deactivateMenu = async (id: string) => {
        const menu = await prisma.menu.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menu.update({
            where: { id: id },
            data: { status: 0 },
        })

        return { success: "Menu successfuly deactivated" }
    }

    activateMenu = async (id: string) => {
        const menu = await prisma.menu.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menu.update({
            where: { id: id },
            data: { status: 1 },
        })

        return { success: "Menu successfuly activated" }
    }

    deleteMenu = async (id: string) => {
        const menu = await this.getMenuById(id)

        if (menu._count.transactionDetail > 0)
            throw new ErrorResponse(
                "Can't delete, Menu has been used in a transaction."
            )

        await prisma.menuIngredient.deleteMany({
            where: {
                idMenu: menu.id,
            },
        })

        await prisma.menu.delete({
            where: { id: menu.id },
        })

        return { success: "Menu successfuly deleted" }
    }
}
