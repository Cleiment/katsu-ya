import { Router } from "express"
import Menu from "./menu.controller"
import { requestHandler } from "../../tools/handler"
import { validate } from "../../tools/validate"
import { ErrorResponse, ValidationError } from "../../definitions/errors"
import { Roles } from "../../config/env.config"

const router = Router()
const menu = new Menu()

router.get(
    "/",
    requestHandler(
        async (req, res) => {
            const rs = await menu.getMenus()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.post(
    "/new",
    requestHandler(
        async (req, res) => {
            validate(
                [
                    "name",
                    { field: "price", requirements: ["number"] },
                    "ingredients",
                ],
                req.body
            )

            const { name, price, ingredients } = req.body
            if (Array.isArray(ingredients)) {
                const validateError = new ErrorResponse()

                if (ingredients.length == 0) throw validateError
                ingredients.forEach((item) => {
                    if (!menu.validateMenuIngredient(item)) throw validateError
                })
            }
            const rs = await menu.createMenu(name, parseInt(price), ingredients)
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
                [
                    "id",
                    "name",
                    { field: "price", requirements: ["number"] },
                    "ingredients",
                ],
                req.body
            )
            const { id, name, price, ingredients } = req.body
            if (Array.isArray(ingredients)) {
                const validateError = new ErrorResponse()

                if (ingredients.length == 0) throw validateError
                ingredients.forEach((item) => {
                    if (!menu.validateMenuIngredient(item)) throw validateError
                })
            }
            const rs = await menu.editMenu(
                id,
                name,
                parseInt(price),
                ingredients
            )
            return rs
        },
        [Roles.admin, Roles.manager]
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
