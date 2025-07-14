import prisma from "../../tools/prisma"
import { ErrorResponse } from "../../definitions/errors"

export default class Category {
    getCounts = async (limit: number = 5) => {
        const total = await prisma.menuCategory.count({ where: { status: 1 } })
        const totalPages = Math.ceil(total / limit)

        return {
            total: total,
            totalPages: totalPages,
        }
    }

    getByPage = async (page: number, limit: number) => {
        const { total, totalPages } = await this.getCounts(limit)

        const currentPage = Math.min(page, totalPages || 1)
        const offset = (currentPage - 1) * limit

        const data = await prisma.menuCategory.findMany({
            skip: offset,
            take: limit,
            where: { status: 1 },
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
        const res = await prisma.menuCategory.findMany({
            where: { status: 1 },
        })

        return res
    }

    getCategoryById = async (id: number) => {
        const category = await prisma.menuCategory.findUniqueOrThrow({
            where: { id: id, status: 1 },
            include: {
                _count: {
                    select: {
                        menus: {
                            where: {
                                status: 1,
                            },
                        },
                    },
                },
            },
        })
        return category
    }

    createCategory = async (name: string) => {
        await prisma.menuCategory.create({
            data: {
                name: name,
            },
        })

        return { success: "Category successfuly created!" }
    }

    editCategory = async (id: number, name: string) => {
        const category = await prisma.menuCategory.findUniqueOrThrow({
            where: { id: id },
        })

        const data = await prisma.menuCategory.update({
            where: { id: id },
            data: {
                name: name,
            },
        })

        return { data: data, success: "Category successfuly edited" }
    }

    deactivateCategory = async (id: number) => {
        const category = await prisma.menuCategory.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menuCategory.update({
            where: { id: id },
            data: { status: 0 },
        })

        return { success: "Category successfuly deactivated" }
    }

    activateCategory = async (id: number) => {
        const category = await prisma.menuCategory.findUniqueOrThrow({
            where: { id: id },
        })

        await prisma.menuCategory.update({
            where: { id: id },
            data: { status: 1 },
        })

        return { success: "Category successfuly activated" }
    }

    deleteCategory = async (id: number) => {
        const category = await this.getCategoryById(id)

        await prisma.menu.updateMany({
            data: {
                idCategory: null,
            },
            where: {
                idCategory: category.id,
            },
        })

        // if (category._count.menus > 0)
        //     throw new ErrorResponse(
        //         "Can't delete, Category has been used in a menu."
        //     )

        await prisma.menuCategory.delete({
            where: { id: category.id },
        })

        return { success: "Category successfuly deleted" }
    }
}
