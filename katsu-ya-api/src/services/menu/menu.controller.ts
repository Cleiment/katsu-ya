import {
    Ingredient,
    MenuCategory,
    MenuIngredient,
    Prisma,
} from "@prisma/client"
import prisma from "../../tools/prisma"
import { ErrorResponse } from "../../definitions/errors"
import Category from "../category/category.controller"

export default class Menu {
    validateMenuIngredient = (data: MenuIngredient): data is MenuIngredient =>
        (data as MenuIngredient) &&
        data.idIngredient !== undefined &&
        data.qty !== undefined

    getCounts = async (limit: number = 5) => {
        const total = await prisma.menu.count({ where: { status: 1 } })
        const totalPages = Math.ceil(total / limit)

        return {
            total: total,
            totalPages: totalPages,
        }
    }

    getByPage = async (
        page: number,
        limit: number,
        showDeactivated: boolean
    ) => {
        const { total, totalPages } = await this.getCounts(limit)

        const currentPage = Math.min(page, totalPages || 1)
        const offset = (currentPage - 1) * limit

        const data = await prisma.menu.findMany({
            skip: offset,
            take: limit,
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
                category: true,
                _count: {
                    select: {
                        transactionDetail: true,
                    },
                },
            },
            where: {
                OR: [{ status: 1 }, { status: showDeactivated ? 0 : 1 }],
            },
        })

        data.map((item) => {
            item.ingredients.forEach((a) => {
                a.ingredient.IngredientHold.forEach((v) => {
                    a.ingredient.qty -= v.qty
                })
            })

            return item
        })

        return {
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit: limit,
            data: data,
        }
    }

    getAll = async () => {
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

    getOrderMenu = async () => {
        const categories = await prisma.menuCategory.findMany({
            include: {
                menus: {
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
                    },
                },
            },
        })

        categories.map((category) => {
            category.menus.map((menu) => {
                menu.ingredients.forEach((menuIngredient) => {
                    menuIngredient.ingredient.IngredientHold.forEach(
                        (onHold) => {
                            menuIngredient.ingredient.qty -= onHold.qty
                        }
                    )
                    if (menuIngredient.qty > menuIngredient.ingredient.qty) {
                        menu.status = 0
                    }
                })
            })

            return category
        })

        return categories
    }

    createMenu = async (
        name: string,
        price: number,
        ingredients: MenuIngredient[],
        category: MenuCategory,
        picture: string,
        desc: string
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
                idCategory: category.id,
                picture: picture,
                desc: desc,
            },
        })

        return { success: "Menu successfuly created!" }
    }

    editMenu = async (
        id: string,
        name: string,
        price: number,
        ingredients: MenuIngredient[],
        category: MenuCategory,
        picture: string | null = null,
        desc: string
    ) => {
        const menu = await prisma.menu.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menuIngredient.deleteMany({
            where: {
                idMenu: menu.id,
            },
        })

        const data = await prisma.menu.update({
            where: { id: id },
            data: {
                name: name,
                price: price,
                idCategory: category.id,
                desc: desc,
            },
        })

        if (picture)
            await prisma.menu.update({
                where: { id: id },
                data: {
                    picture: picture,
                },
            })

        ingredients.forEach(async (item) => {
            await prisma.menuIngredient.create({
                data: {
                    idIngredient: item.idIngredient,
                    qty: item.qty,
                    idMenu: menu.id,
                },
            })
        })

        return { data: data, success: "Menu successfuly edited" }
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
