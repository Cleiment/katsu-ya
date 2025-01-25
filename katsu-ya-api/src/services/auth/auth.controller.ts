import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import User from "../user/user.controller"
import { secret, tokenExpiredTime } from "../../config/env.config"
import { ErrorResponse } from "../../definitions/errors"
import { io } from "../../server"

const user = new User()

export default class Auth {
    createToken = async (id: string, username: string, idRole: number) => {
        const payload = {
            id: id,
            username: username,
            idRole: idRole,
        }

        return (
            "Bearer " +
            jwt.sign(payload, secret, {
                expiresIn: "3h",
            })
        )
    }

    checkToken = async (token: string) => {
        const isValid = token.startsWith("Bearer ", 0)

        if (isValid) {
            const cleanToken = token.replace("Bearer", "").trim()
            jwt.verify(cleanToken, secret, (err) => {
                if (err) throw err
            })

            const payload = jwt.decode(cleanToken)

            if (payload && typeof payload !== "string") {
                if (payload.id) {
                    const userInfo = await user.getUserById(payload.id)
                    if (userInfo.status == 1) return userInfo
                }
            }
        }

        throw new ErrorResponse("Not Authorized", 401)
    }

    login = async (username: string, password: string) => {
        const cred = await user.getUserByUsername(username)

        const validatePassword = await bcrypt.compare(password, cred.password)
        if (!validatePassword)
            throw new ErrorResponse("Wrong Username/Password", 400)

        const response = {
            token: await this.createToken(cred.id, cred.username, cred.idRole),
        }
        return response
    }
}
