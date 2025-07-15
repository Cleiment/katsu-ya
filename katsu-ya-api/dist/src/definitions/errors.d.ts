import { TValidationFieldError } from "./types";
export declare class ValidationError {
    errors: TValidationFieldError;
    statusCode: number;
    constructor(err: TValidationFieldError);
}
export declare class ErrorResponse extends Error {
    message: string;
    statusCode: number;
    constructor(message?: string, statusCode?: number);
}
