import { Router, json } from "express"
import Menu from "./menu.controller"
import { requestHandler } from "../../tools/handler"
import { booleanFromString, validate } from "../../tools/validate"
import { ErrorResponse, ValidationError } from "../../definitions/errors"
import { Roles } from "../../config/env.config"
import { uploadImage } from "../../tools/multer"
import path from "node:path"
import fs from "node:fs"
import prisma from "../../tools/prisma"

const router = Router()
const menu = new Menu()

const multer = uploadImage("menu")

router.post(
    "/new",
    multer.storage.single("file"),
    requestHandler(
        async (req, res) => {
            const file = req.file
            const body = JSON.parse(JSON.stringify(req.body))
            validate(
                [
                    "name",
                    { field: "price", requirements: ["number"] },
                    "ingredients",
                    "category",
                    "desc",
                ],
                body
            )

            if (!file)
                throw new ValidationError({ file: ["Menu needs picture"] })

            let { name, price, ingredients, category, desc } = body
            name = JSON.parse(name)
            price = JSON.parse(price)
            ingredients = JSON.parse(ingredients)
            category = JSON.parse(category)
            desc = JSON.parse(desc)

            if (Array.isArray(ingredients)) {
                const validateError = new ErrorResponse()

                if (ingredients.length == 0) throw validateError
                ingredients.forEach((item) => {
                    if (!menu.validateMenuIngredient(item)) throw validateError
                })
            }

            const extension: string = path.extname(file.originalname)
            const safeMenuName: string = name.replace(/\s+/g, "_").toLowerCase()
            const newFilename = `${safeMenuName}_${Date.now()}${extension}`
            const newPath = path.join(multer.path, newFilename)

            try {
                const rs = await menu.createMenu(
                    name,
                    parseInt(price),
                    ingredients,
                    category,
                    newFilename,
                    desc
                )
                fs.renameSync(file.path, newPath)
                return rs
            } catch (err) {
                fs.unlink(file.path, () => {})
                throw err
            }
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/edit",
    multer.storage.single("file"),
    requestHandler(
        async (req, res) => {
            const file = req.file
            const body = JSON.parse(JSON.stringify(req.body))

            validate(
                [
                    "name",
                    { field: "price", requirements: ["number"] },
                    "ingredients",
                    "desc",
                ],
                body
            )

            let { id, name, price, ingredients, category, desc } = body
            id = JSON.parse(id)
            name = JSON.parse(name)
            price = JSON.parse(price)
            ingredients = JSON.parse(ingredients)
            category = JSON.parse(category)
            desc = JSON.parse(desc)

            const existingMenu = await prisma.menu.findUniqueOrThrow({
                where: { id: id },
            })

            if (Array.isArray(ingredients)) {
                const validateError = new ErrorResponse()

                if (ingredients.length == 0) throw validateError
                ingredients.forEach((item) => {
                    if (!menu.validateMenuIngredient(item)) throw validateError
                })
            }

            const filename = file ? file.originalname : existingMenu.picture
            const extension: string = path.extname(filename)
            const safeMenuName: string = name.replace(/\s+/g, "_").toLowerCase()
            const newFilename = `${safeMenuName}_${Date.now()}${extension}`
            const newPath = path.join(multer.path, newFilename)

            try {
                const rs = await menu.editMenu(
                    id,
                    name,
                    parseInt(price),
                    ingredients,
                    category,
                    newFilename,
                    desc
                )

                fs.renameSync(
                    file
                        ? file.path
                        : path.join(multer.path, existingMenu.picture),
                    newPath
                )
                fs.unlink(path.join(multer.path, rs.data.picture), () => {})

                return { success: rs.success }
            } catch (err) {
                if (file) fs.unlink(file.path, () => {})
                throw err
            }
        },
        [Roles.admin, Roles.manager]
    )
)

router.use(json())

router.get(
    "/",
    requestHandler(
        async (req, res) => {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const showDeactivated =
                booleanFromString(req.query.show_deactivated as string) || false

            const rs = await menu.getByPage(page, limit, showDeactivated)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.get(
    "/order-menu",
    requestHandler(
        async (req, res) => {
            const rs = await menu.getOrderMenu()
            return rs
        },
        [Roles.admin, Roles.cashier, Roles.guest]
    )
)

router.get(
    "/all",
    requestHandler(
        async (req, res) => {
            const rs = await menu.getAll()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen, Roles.guest]
    )
)

router.post(
    "/deactivate",
    requestHandler(
        async (req, res) => {
            validate(["id"], req.body)

            const { id } = req.body
            const rs = await menu.deactivateMenu(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/activate",
    requestHandler(
        async (req, res) => {
            validate(["id"], req.body)

            const { id } = req.body
            const rs = await menu.activateMenu(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/delete",
    requestHandler(
        async (req, res) => {
            validate(["id"], req.body)

            const { id } = req.body
            const rs = await menu.deleteMenu(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.get(
    "/:id",
    requestHandler(
        async (req, res) => {
            validate(["id"], req.params)
            const id = req.params.id
            const rs = await menu.getMenuById(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

export default router
