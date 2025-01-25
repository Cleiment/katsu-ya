import { salt, secret } from "../../config/env.config"
import { ErrorResponse } from "../../definitions/errors"
import { Role } from "../../definitions/types"
import prisma from "../../tools/prisma"
import bcrypt from "bcrypt"

export default class User {
    public getRoles = async (): Promise<Role[]> => {
        return await prisma.userRole.findMany({ where: { status: 1 } })
    }

    public getRoleById = async (id: number): Promise<Role> => {
        return await prisma.userRole.findUniqueOrThrow({
            where: { id: id, status: 1 },
        })
    }

    public newRole = async (role: string) => {
        await prisma.userRole
            .create({
                data: { role: role },
            })
            .catch((err) => {
                throw err
            })

        return { success: "Role successfuly created!" }
    }

    public editRole = async (id: number, role: string, status: number) => {
        await prisma.userRole
            .update({
                where: { id: id },
                data: { role: role, status: status },
            })
            .catch((err) => {
                throw err
            })

        return { success: "Role successfuly edited!" }
    }

    public deactivateRole = async (id: number) => {
        await prisma.userRole.update({
            where: { id: id },
            data: { status: 0 },
        })

        return { success: "Role successfuly deactivated!" }
    }

    public getUsers = async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                userRole: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (users.length == 0) throw new ErrorResponse("No User Found", 404)

        return users
    }

    public getUserByUsername = async (username: string) => {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
                status: 1,
            },
            select: {
                id: true,
                username: true,
                password: true,
                idRole: true,
            },
        })

        if (user === null)
            throw new ErrorResponse("Wrong Username/Password", 400)

        return user
    }

    public getUserById = async (id: string) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
            select: {
                id: true,
                username: true,
                userRole: {
                    select: {
                        id: true,
                        role: true,
                    },
                },
                status: true,
            },
        })

        return user
    }

    public newUser = async (
        username: string,
        password: string,
        idRole: number
    ) => {
        const hashedPass = await bcrypt.hash(
            password,
            await bcrypt.genSalt(salt)
        )

        await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                password: hashedPass,
                idRole: idRole,
            },
        })

        return { success: "User successfuly created!" }
    }

    public editUser = async (id: string, username: string, idRole: number) => {
        await prisma.user.update({
            where: { id: id },
            data: { username: username.toLowerCase(), idRole: idRole },
        })

        return { success: "User successfuly edited!" }
    }

    public activateUser = async (id: string) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        })

        await prisma.user
            .update({
                where: { id: id },
                data: { status: 1 },
            })
            .catch((err) => {
                throw err
            })

        return {
            success: "User successfuly activated!",
        }
    }

    public deactivateUser = async (id: string) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        })

        await prisma.user
            .update({
                where: { id: id },
                data: { status: 0 },
            })
            .catch((err) => {
                throw err
            })

        return {
            success: "User successfuly deactivated!",
        }
    }

    public changePassword = async (
        id: string,
        oldPassword: string,
        password: string
    ) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: id },
        })

        const passValid = await bcrypt.compare(oldPassword, user.password)
        if (!passValid)
            throw new ErrorResponse(
                "Old Password is wrong, can't proceed with changing password.",
                400
            )

        const hashedPass = await bcrypt.hash(
            password,
            await bcrypt.genSalt(salt)
        )
        await prisma.user.update({
            where: { id: id },
            data: { password: hashedPass },
        })

        return { success: "User's password succesfuly changed!" }
    }
}
