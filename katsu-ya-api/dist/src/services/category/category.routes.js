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
const category_controller_1 = __importDefault(require("./category.controller"));
const handler_1 = require("../../tools/handler");
const validate_1 = require("../../tools/validate");
const env_config_1 = require("../../config/env.config");
const router = (0, express_1.Router)();
const category = new category_controller_1.default();
router.use((0, express_1.json)());
router.get("/", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rs = yield category.getByPage(page, limit);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/all", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield category.getAll();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.post("/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["name"], req.body);
    const { name } = req.body;
    const rs = yield category.createCategory(name);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }, "name"], req.body);
    const { id, name } = req.body;
    const rs = yield category.editCategory(id, name);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield category.deactivateCategory(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/activate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield category.activateCategory(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/delete", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield category.deleteCategory(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.get("/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.params);
    const id = req.params.id;
    const rs = yield category.getCategoryById(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
exports.default = router;
