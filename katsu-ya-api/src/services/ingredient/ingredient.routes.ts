import { Router, json } from "express"
import { booleanFromString, validate } from "../../tools/validate"
import { requestHandler } from "../../tools/handler"
import Ingredient from "./ingredient.controller"
import { User } from "@prisma/client"
import { Roles } from "../../config/env.config"

const router = Router()
const ingredient = new Ingredient()

router.use(json())

router.get(
    "/",
    requestHandler(
        async (req, res) => {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const showDeactivated =
                booleanFromString(req.query.show_deactivated as string) || false

            const rs = await ingredient.getIngredientByPage(
                page,
                limit,
                showDeactivated
            )
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)
router.get(
    "/all",
    requestHandler(
        async (req, res) => {
            const rs = await ingredient.getAllIngredient()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.get(
    "/unit",
    requestHandler(
        async (req, res) => {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const rs = await ingredient.getIngredientUnitByPage(page, limit)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.get(
    "/unit/all",
    requestHandler(
        async (req, res) => {
            const rs = await ingredient.getAllIngredientUnit()
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier, Roles.kitchen]
    )
)

router.post(
    "/unit/new",
    requestHandler(
        async (req, res) => {
            validate(["name"], req.body)

            const { name } = req.body
            const rs = await ingredient.createIngredientUnit(name)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/unit/edit",
    requestHandler(
        async (req, res) => {
            validate(
                [{ field: "id", requirements: ["number"] }, "name"],
                req.body
            )

            const { id, name } = req.body
            const rs = await ingredient.editIngredientUnit(id, name)
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/unit/activate",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await ingredient.activateIngredientUnit(parseInt(id))
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.post(
    "/unit/deactivate",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await ingredient.deactivateIngredientUnit(parseInt(id))
            return rs
        },
        [Roles.admin, Roles.manager]
    )
)

router.get(
    "/transaction",
    requestHandler(
        async (req, res) => {
            const rs = await ingredient.getIngredientTransactions()
            return rs
        },
        [Roles.manager]
    )
)

router.post(
    "/transaction/new",
    requestHandler(
        async (req, res) => {
            validate(
                [
                    { field: "qty", requirements: ["number"] },
                    { field: "idIngredient", requirements: ["number"] },
                    { field: "isUsage", requirements: ["number"] },
                ],
                req.body
            )

            let { qty, idIngredient, isUsage, idDetailTransaction } = req.body
            if (!idDetailTransaction) idDetailTransaction = null

            const userInfo: User = res.locals.userInfo
            const rs = await ingredient.createIngredientTransaction(
                parseInt(idIngredient),
                parseInt(qty),
                userInfo.id,
                parseInt(isUsage),
                idDetailTransaction
            )
            return rs
        },
        [Roles.manager]
    )
)

router.post(
    "/transaction/edit",
    requestHandler(
        async (req, res) => {
            validate(
                [
                    { field: "id", requirements: ["number"] },
                    { field: "qty", requirements: ["number"] },
                    { field: "idIngredient", requirements: ["number"] },
                    { field: "isUsage", requirements: ["number"] },
                ],
                req.body
            )

            let { id, qty, idIngredient, isUsage, idDetailTransaction } =
                req.body
            if (!idDetailTransaction) idDetailTransaction = null

            const userInfo: User = res.locals.userInfo
            const rs = await ingredient.editIngredientTransaction(
                id,
                parseInt(idIngredient),
                parseInt(qty),
                userInfo.id,
                parseInt(isUsage),
                idDetailTransaction
            )
            return rs
        },
        [Roles.manager]
    )
)

router.post(
    "/transaction/delete",
    requestHandler(
        async (req, res) => {
            validate([{ field: "id", requirements: ["number"] }], req.body)

            const { id } = req.body
            const rs = await ingredient.deleteIngredientTransaction(
                parseInt(id)
            )
            return rs
        },
        [Roles.manager]
    )
)

router.post(
    "/new",
    requestHandler(
        async (req, res) => {
            validate(
                ["name", { field: "qty", requirements: ["number"] }],
                req.body
            )

            const { name, idUnit } = req.body
            const rs = await ingredient.createIngredient(name, parseInt(idUnit))
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
                    { field: "id", requirements: ["number"] },
                    "name",
                    { field: "idUnit", requirements: ["number"] },
                ],
                req.body
            )

            const { id, name, idUnit } = req.body
            const rs = await ingredient.editIngredient(
                id,
                name,
                parseInt(idUnit)
            )
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
            const rs = await ingredient.activateIngredient(parseInt(id))
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
            const rs = await ingredient.deactivateIngredient(parseInt(id))
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
            const id = parseInt(req.params.id)
            const rs = await ingredient.getIngredientById(id)
            return rs
        },
        [Roles.admin, Roles.manager, Roles.cashier]
    )
)

export default router
