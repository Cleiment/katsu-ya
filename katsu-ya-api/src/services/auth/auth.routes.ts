import express, { NextFunction, Request, Response, Router } from "express"
import Auth from "./auth.controller"
import { validate } from "../../tools/validate"
import { requestHandler } from "../../tools/handler"
import { ErrorResponse } from "../../definitions/errors"
import { Roles } from "../../config/env.config"

const router = Router()
const auth = new Auth()

router.use(express.json())

router.use(async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = {
        id: "cmckrnv8c0001x1aj2zt2eqw2",
        userRole: {
            role: Roles.guest,
        },
    }
    res.locals.userInfo = userInfo

    if (req.headers.authorization) {
        const token = req.headers.authorization
        const userInfo = await auth.checkToken(token).catch((err) => next(err))
        res.locals.userInfo = userInfo
    }

    return next()
})

router.post(
    "/login",
    requestHandler(
        async (req: Request, res: Response) => {
            validate(["username", "password"], req.body)

            const { username, password } = req.body
            const rs = await auth.login(username, password)

            return rs
        },
        [Roles.guest]
    )
)

export default router
