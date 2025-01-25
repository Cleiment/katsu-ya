import { TValidationFieldError } from "./types"

export class ValidationError {
    errors: TValidationFieldError
    statusCode: number
    constructor(err: TValidationFieldError) {
        this.errors = err
        this.statusCode = 400
    }
}

export class ErrorResponse extends Error {
    message: string
    statusCode: number

    constructor(message: string = "Not Authorized", statusCode: number = 401) {
        super(message)

        this.message = message
        this.statusCode = statusCode
    }
}
