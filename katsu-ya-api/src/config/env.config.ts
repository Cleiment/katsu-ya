import dotenv from "dotenv"
dotenv.config()

if (
    !process.env.HOSTNAME ||
    !process.env.PORT ||
    !process.env.SECRET_KEY ||
    !process.env.SALT_NUMBER ||
    !process.env.APP_MODE ||
    !process.env.TOKEN_EXPIRED_TIME
) {
    throw new Error("Invalid env vars")
}

const hostname: string = process.env.HOSTNAME
const port: number = parseInt(process.env.PORT)
const secret: string = process.env.SECRET_KEY
const salt: number = parseInt(process.env.SALT_NUMBER)
const appMode: string = process.env.APP_MODE
const tokenExpiredTime: number = parseInt(process.env.TOKEN_EXPIRED_TIME)

export { hostname, port, secret, salt, appMode, tokenExpiredTime }

export const Roles = {
    admin: "ADMIN",
    manager: "MANAGER",
    cashier: "CASHIER",
    kitchen: "KITCHEN",
    guest: "GUEST",
}
