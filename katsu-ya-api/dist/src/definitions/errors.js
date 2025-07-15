"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.ValidationError = void 0;
class ValidationError {
    constructor(err) {
        this.errors = err;
        this.statusCode = 400;
    }
}
exports.ValidationError = ValidationError;
class ErrorResponse extends Error {
    constructor(message = "Not Authorized", statusCode = 401) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ErrorResponse = ErrorResponse;
