"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHandler = exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../definitions/errors");
const env_config_1 = require("../config/env.config");
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (err, req, res, next) => {
    var _a, _b;
    let error = "Error Occured. Try again later.";
    let statusCode = 500;
    let errorType;
    if (env_config_1.appMode == "dev") {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            // error = err.message
            errorType = client_1.Prisma.PrismaClientKnownRequestError;
            switch (err.code) {
                case "P2002":
                    error = `Unique constraint on ${(_a = err.meta) === null || _a === void 0 ? void 0 : _a.target}`;
                    // error = err
                    break;
                case "P2003":
                    error = `Foreign Key constraint on the field ${(_b = err.meta) === null || _b === void 0 ? void 0 : _b.field_name}`;
                    // error = err
                    break;
                case "P2025":
                    statusCode = 404;
                    break;
                default:
                    error = err;
                    break;
            }
        }
        else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
            console.error(err.message);
            error =
                "Constraint data not found. Try inputing after related data is inputed.";
        }
        else if (err instanceof jsonwebtoken_1.TokenExpiredError ||
            err instanceof jsonwebtoken_1.JsonWebTokenError ||
            err instanceof jsonwebtoken_1.NotBeforeError) {
            error = "Not Authorized";
            statusCode = 401;
            errorType = jsonwebtoken_1.JsonWebTokenError;
        }
        else if (err instanceof errors_1.ValidationError) {
            error = { validation: err.errors };
            statusCode = err.statusCode;
            errorType = errors_1.ValidationError;
        }
        else if (err instanceof errors_1.ErrorResponse) {
            error = err.message;
            statusCode = err.statusCode;
        }
        else {
            error = err.message;
            statusCode = err.statusCode ? err.statusCode : statusCode;
        }
    }
    let errorResponse;
    if (typeof error === "string")
        errorResponse = { message: error };
    else {
        errorResponse = error;
    }
    res.status(statusCode).json({
        errorType: errorType,
        error: errorResponse,
        statusCode: statusCode,
    });
};
exports.errorHandler = errorHandler;
const requestHandler = (controller, roles = [env_config_1.Roles.admin]) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.userInfo &&
            roles.some((item) => item == res.locals.userInfo.userRole.role)) {
            const response = yield controller(req, res, next);
            res.status(200).json(response);
        }
        else {
            throw new errors_1.ErrorResponse();
        }
    }
    catch (err) {
        (0, exports.errorHandler)(err, req, res, next);
    }
});
exports.requestHandler = requestHandler;
