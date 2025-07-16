"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.clientUrl = exports.midtransServerKey = exports.tokenExpiredTime = exports.appMode = exports.salt = exports.secret = exports.port = exports.hostname = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.HOSTNAME ||
    !process.env.PORT ||
    !process.env.SECRET_KEY ||
    !process.env.SALT_NUMBER ||
    !process.env.APP_MODE ||
    !process.env.TOKEN_EXPIRED_TIME ||
    !process.env.MIDTRANS_SERVER_KEY ||
    !process.env.CLIENT_URL) {
    throw new Error("Invalid env vars");
}
const hostname = process.env.HOSTNAME;
exports.hostname = hostname;
const port = parseInt(process.env.PORT);
exports.port = port;
const secret = process.env.SECRET_KEY;
exports.secret = secret;
const salt = parseInt(process.env.SALT_NUMBER);
exports.salt = salt;
const appMode = process.env.APP_MODE;
exports.appMode = appMode;
const tokenExpiredTime = parseInt(process.env.TOKEN_EXPIRED_TIME);
exports.tokenExpiredTime = tokenExpiredTime;
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
exports.midtransServerKey = midtransServerKey;
const clientUrl = process.env.CLIENT_URL;
exports.clientUrl = clientUrl;
exports.Roles = {
    admin: "ADMIN",
    manager: "MANAGER",
    cashier: "CASHIER",
    kitchen: "KITCHEN",
    guest: "GUEST",
};
