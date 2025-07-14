import { Router, json } from "express"
import Category from "./category.controller"
import { requestHandler } from "../../tools/handler"
import { validate } from "../../tools/validate"
import { ErrorResponse, ValidationError } from "../../definitions/errors"
import { Roles } from "../../config/env.config"
import { uploadImage } from "../../tools/multer"
import path from "node:path"
import fs from "node:fs"
import prisma from "../../tools/prisma"

const router = Router()
const category = new Category()

router.use(json())

router.get(
    "/",
    requestHandler(
        async (req, res) => {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const rs = await category.getByPage(page, limit)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.get(
    "/all",
    requestHandler(
        async (req, res) => {
            const rs = await category.getAll()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.post(
    "/new",
    requestHandler(
        async (req, res) => {
            validate(["name"], req.body)

            const { name } = req.body
            const rs = await category.createCategory(name)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/edit",
    requestHandler(
        async (req, res) => {
            validate(
                [{ field: "id", requirements: ["number"] }, "name"],
                req.body
            )

            const { id, name } = req.body
            const rs = await category.editCategory(id, name)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/deactivate",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await category.deactivateCategory(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/activate",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await category.activateCategory(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/delete",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await category.deleteCategory(id)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.get(
    "/:id",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.params)
            const id = req.params.id
            const rs = await category.getCategoryById(parseInt(id))
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

export default router
