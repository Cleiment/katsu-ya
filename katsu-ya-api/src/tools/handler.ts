import { Prisma } from "@prisma/client"
import { NextFunction, Request, Response } from "express"
import { ValidationError, ErrorResponse } from "../definitions/errors"
import { Role, TValidationFieldError } from "../definitions/types"
import { appMode, Roles } from "../config/env.config"
import {
    JsonWebTokenError,
    NotBeforeError,
    TokenExpiredError,
} from "jsonwebtoken"

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error:
        | string
        | { validation: TValidationFieldError }
        | Prisma.PrismaClientValidationError
        | Prisma.PrismaClientKnownRequestError =
        "Error Occured. Try again later."
    let statusCode: number = 500
    let errorType

    if (appMode == "dev") {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // error = err.message
            errorType = Prisma.PrismaClientKnownRequestError
            switch (err.code) {
                case "P2002":
                    error = `Unique constraint on ${err.meta?.target}`
                    // error = err
                    break
                case "P2003":
                    error = `Foreign Key constraint on the field ${err.meta?.field_name}`
                    // error = err
                    break
                case "P2025":
                    statusCode = 404
                    break
                default:
                    error = err
                    break
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            console.error(err.message)
            error =
                "Constraint data not found. Try inputing after related data is inputed."
        } else if (
            err instanceof TokenExpiredError ||
            err instanceof JsonWebTokenError ||
            err instanceof NotBeforeError
        ) {
            error = "Not Authorized"
            statusCode = 401
            errorType = JsonWebTokenError
        } else if (err instanceof ValidationError) {
            error = { validation: err.errors }
            statusCode = err.statusCode
            errorType = ValidationError
        } else if (err instanceof ErrorResponse) {
            error = err.message
            statusCode = err.statusCode
        } else {
            error = err.message
            statusCode = err.statusCode ? err.statusCode : statusCode
        }
    }

    let errorResponse
    if (typeof error === "string") errorResponse = { message: error }
    else {
        errorResponse = error
    }

    res.status(statusCode).json({
        errorType: errorType,
        error: errorResponse,
        statusCode: statusCode,
    })
}

type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

export const requestHandler =
    (controller: ControllerType, roles: Role["role"][] = [Roles.admin]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (
                res.locals.userInfo &&
                roles.some((item) => item == res.locals.userInfo.userRole.role)
            ) {
                const response = await controller(req, res, next)
                res.status(200).json(response)
            } else {
                throw new ErrorResponse()
            }
        } catch (err: any) {
            errorHandler(err, req, res, next)
        }
    }
