import { response, Router } from "express"
import User from "./user.controller"
import { validate } from "../../tools/validate"
import { requestHandler } from "../../tools/handler"
import { Roles } from "../../config/env.config"

const router = Router()
const user = new User()

router.get(
    "/",
    requestHandler(async (req, res) => {
        const rs = await user.getUsers()
        return rs
    })
)

router.get(
    "/role",
    requestHandler(async (req, res) => {
        const rs = await user.getRoles()
        return rs
    })
)

router.post(
    "/role/new",
    requestHandler(async (req, res) => {
        validate(["role"], req.body)

        const { role } = req.body
        const rs = await user.newRole(role)
        return rs
    })
)

router.post(
    "/role/edit",
    requestHandler(async (req, res) => {
        validate([{ field: "id", requirements: ["number"] }, "role"], req.body)

        const { id, role, status } = req.body
        const rs = await user.editRole(id, role, status)
        return rs
    })
)

router.post(
    "/role/deactivate",
    requestHandler(async (req, res) => {
        validate([{ field: "id", requirements: ["number"] }], req.body)

        const { id } = req.body
        const rs = await user.deactivateRole(id)
        return rs
    })
)

router.get(
    "/role/:id",
    requestHandler(async (req, res) => {
        validate([{ field: "id", requirements: ["number"] }], req.params)
        const id = parseInt(req.params.id)

        const rs = await user.getRoleById(id)
        return rs
    })
)

router.post(
    "/new",
    requestHandler(async (req, res) => {
        validate(
            [
                { field: "username", requirements: ["no_symbol"] },
                { field: "password", requirements: ["valid_password"] },
                { field: "idRole", requirements: ["number"] },
            ],
            req.body
        )

        const { username, password, idRole } = req.body
        const rs = await user.newUser(username, password, parseInt(idRole))
        return rs
    })
)

router.post(
    "/edit",
    requestHandler(async (req, res) => {
        validate(
            [
                "id",
                { field: "username", requirements: ["no_symbol"] },
                { field: "idRole", requirements: ["number"] },
            ],
            req.body
        )

        const { id, username, id_role } = req.body
        const rs = await user.editUser(id, username, id_role)
        return rs
    })
)

router.post(
    "/change-password",
    requestHandler(async (req, res) => {
        validate(["id", "old_password", "password"], req.body)

        const { id, old_password, password } = req.body
        const rs = await user.changePassword(id, old_password, password)
        return rs
    })
)

router.post(
    "/activate",
    requestHandler(async (req, res) => {
        validate(["id"], req.body)

        const { id } = req.body
        const rs = await user.activateUser(id)
        return rs
    })
)

router.post(
    "/deactivate",
    requestHandler(async (req, res) => {
        validate(["id"], req.body)

        const { id } = req.body
        const rs = await user.deactivateUser(id)
        return rs
    })
)

router.get(
    "/:id",
    requestHandler(async (req, res) => {
        const rs = await user.getUserById(req.params.id)
        return rs
    })
)

export default router
