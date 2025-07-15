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
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const validate_1 = require("../../tools/validate");
const handler_1 = require("../../tools/handler");
const router = (0, express_1.Router)();
const user = new user_controller_1.default();
router.use((0, express_1.json)());
router.get("/", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield user.getUsers();
    return rs;
})));
router.get("/role", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield user.getRoles();
    return rs;
})));
router.post("/role/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["role"], req.body);
    const { role } = req.body;
    const rs = yield user.newRole(role);
    return rs;
})));
router.post("/role/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }, "role"], req.body);
    const { id, role, status } = req.body;
    const rs = yield user.editRole(id, role, status);
    return rs;
})));
router.post("/role/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield user.deactivateRole(id);
    return rs;
})));
router.get("/role/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.params);
    const id = parseInt(req.params.id);
    const rs = yield user.getRoleById(id);
    return rs;
})));
router.post("/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([
        { field: "username", requirements: ["no_symbol"] },
        { field: "password", requirements: ["valid_password"] },
        { field: "idRole", requirements: ["number"] },
    ], req.body);
    const { username, password, idRole } = req.body;
    const rs = yield user.newUser(username, password, parseInt(idRole));
    return rs;
})));
router.post("/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([
        "id",
        { field: "username", requirements: ["no_symbol"] },
        { field: "idRole", requirements: ["number"] },
    ], req.body);
    const { id, username, id_role } = req.body;
    const rs = yield user.editUser(id, username, id_role);
    return rs;
})));
router.post("/change-password", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id", "old_password", "password"], req.body);
    const { id, old_password, password } = req.body;
    const rs = yield user.changePassword(id, old_password, password);
    return rs;
})));
router.post("/activate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.body);
    const { id } = req.body;
    const rs = yield user.activateUser(id);
    return rs;
})));
router.post("/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.body);
    const { id } = req.body;
    const rs = yield user.deactivateUser(id);
    return rs;
})));
router.get("/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield user.getUserById(req.params.id);
    return rs;
})));
exports.default = router;
