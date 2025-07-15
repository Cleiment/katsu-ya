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
const env_config_1 = require("../../config/env.config");
const errors_1 = require("../../definitions/errors");
const prisma_1 = __importDefault(require("../../tools/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class User {
    constructor() {
        this.getRoles = () => __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.userRole.findMany({ where: { status: 1 } });
        });
        this.getRoleById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.userRole.findUniqueOrThrow({
                where: { id: id, status: 1 },
            });
        });
        this.newRole = (role) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.userRole
                .create({
                data: { role: role },
            })
                .catch((err) => {
                throw err;
            });
            return { success: "Role successfuly created!" };
        });
        this.editRole = (id, role, status) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.userRole
                .update({
                where: { id: id },
                data: { role: role, status: status },
            })
                .catch((err) => {
                throw err;
            });
            return { success: "Role successfuly edited!" };
        });
        this.deactivateRole = (id) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.userRole.update({
                where: { id: id },
                data: { status: 0 },
            });
            return { success: "Role successfuly deactivated!" };
        });
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_1.default.user.findMany({
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
            });
            if (users.length == 0)
                throw new errors_1.ErrorResponse("No User Found", 404);
            return users;
        });
        this.getUserByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
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
            });
            if (user === null)
                throw new errors_1.ErrorResponse("Wrong Username/Password", 400);
            return user;
        });
        this.getUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUniqueOrThrow({
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
            });
            return user;
        });
        this.newUser = (username, password, idRole) => __awaiter(this, void 0, void 0, function* () {
            const hashedPass = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt(env_config_1.salt));
            yield prisma_1.default.user.create({
                data: {
                    username: username.toLowerCase(),
                    password: hashedPass,
                    idRole: idRole,
                },
            });
            return { success: "User successfuly created!" };
        });
        this.editUser = (id, username, idRole) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.user.update({
                where: { id: id },
                data: { username: username.toLowerCase(), idRole: idRole },
            });
            return { success: "User successfuly edited!" };
        });
        this.activateUser = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
            yield prisma_1.default.user
                .update({
                where: { id: id },
                data: { status: 1 },
            })
                .catch((err) => {
                throw err;
            });
            return {
                success: "User successfuly activated!",
            };
        });
        this.deactivateUser = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUniqueOrThrow({
                where: {
                    id: id,
                },
            });
            yield prisma_1.default.user
                .update({
                where: { id: id },
                data: { status: 0 },
            })
                .catch((err) => {
                throw err;
            });
            return {
                success: "User successfuly deactivated!",
            };
        });
        this.changePassword = (id, oldPassword, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUniqueOrThrow({
                where: { id: id },
            });
            const passValid = yield bcrypt_1.default.compare(oldPassword, user.password);
            if (!passValid)
                throw new errors_1.ErrorResponse("Old Password is wrong, can't proceed with changing password.", 400);
            const hashedPass = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt(env_config_1.salt));
            yield prisma_1.default.user.update({
                where: { id: id },
                data: { password: hashedPass },
            });
            return { success: "User's password succesfuly changed!" };
        });
    }
}
exports.default = User;
