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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_controller_1 = __importDefault(require("../user/user.controller"));
const env_config_1 = require("../../config/env.config");
const errors_1 = require("../../definitions/errors");
const user = new user_controller_1.default();
class Auth {
    constructor() {
        this.createToken = (id, username, idRole) => __awaiter(this, void 0, void 0, function* () {
            const payload = {
                id: id,
                username: username,
                idRole: idRole,
            };
            return ("Bearer " +
                jsonwebtoken_1.default.sign(payload, env_config_1.secret, {
                    expiresIn: "3h",
                }));
        });
        this.checkToken = (token) => __awaiter(this, void 0, void 0, function* () {
            const isValid = token.startsWith("Bearer ", 0);
            if (isValid) {
                const cleanToken = token.replace("Bearer", "").trim();
                jsonwebtoken_1.default.verify(cleanToken, env_config_1.secret, (err) => {
                    if (err)
                        throw err;
                });
                const payload = jsonwebtoken_1.default.decode(cleanToken);
                if (payload && typeof payload !== "string") {
                    if (payload.id) {
                        const userInfo = yield user.getUserById(payload.id);
                        if (userInfo.status == 1)
                            return userInfo;
                    }
                }
            }
            throw new errors_1.ErrorResponse("Not Authorized", 401);
        });
        this.login = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const cred = yield user.getUserByUsername(username);
            const validatePassword = yield bcrypt_1.default.compare(password, cred.password);
            if (!validatePassword)
                throw new errors_1.ErrorResponse("Wrong Username/Password", 400);
            const response = {
                token: yield this.createToken(cred.id, cred.username, cred.idRole),
            };
            return response;
        });
    }
}
exports.default = Auth;
