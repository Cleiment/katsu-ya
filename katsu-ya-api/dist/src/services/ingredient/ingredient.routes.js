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
const validate_1 = require("../../tools/validate");
const handler_1 = require("../../tools/handler");
const ingredient_controller_1 = __importDefault(require("./ingredient.controller"));
const env_config_1 = require("../../config/env.config");
const router = (0, express_1.Router)();
const ingredient = new ingredient_controller_1.default();
router.use((0, express_1.json)());
router.get("/", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const showDeactivated = (0, validate_1.booleanFromString)(req.query.show_deactivated) || false;
    const rs = yield ingredient.getIngredientByPage(page, limit, showDeactivated);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/all", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield ingredient.getAllIngredient();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/unit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const rs = yield ingredient.getIngredientUnitByPage(page, limit);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/unit/all", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield ingredient.getAllIngredientUnit();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.post("/unit/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["name"], req.body);
    const { name } = req.body;
    const rs = yield ingredient.createIngredientUnit(name);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/unit/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }, "name"], req.body);
    const { id, name } = req.body;
    const rs = yield ingredient.editIngredientUnit(id, name);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/unit/activate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield ingredient.activateIngredientUnit(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/unit/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield ingredient.deactivateIngredientUnit(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.get("/transaction", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield ingredient.getIngredientTransactions();
    return rs;
}), [env_config_1.Roles.manager]));
router.post("/transaction/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([
        { field: "qty", requirements: ["number"] },
        { field: "idIngredient", requirements: ["number"] },
        { field: "isUsage", requirements: ["number"] },
    ], req.body);
    let { qty, idIngredient, isUsage, idDetailTransaction } = req.body;
    if (!idDetailTransaction)
        idDetailTransaction = null;
    const userInfo = res.locals.userInfo;
    const rs = yield ingredient.createIngredientTransaction(parseInt(idIngredient), parseInt(qty), userInfo.id, parseInt(isUsage), idDetailTransaction);
    return rs;
}), [env_config_1.Roles.manager]));
router.post("/transaction/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([
        { field: "id", requirements: ["number"] },
        { field: "qty", requirements: ["number"] },
        { field: "idIngredient", requirements: ["number"] },
        { field: "isUsage", requirements: ["number"] },
    ], req.body);
    let { id, qty, idIngredient, isUsage, idDetailTransaction } = req.body;
    if (!idDetailTransaction)
        idDetailTransaction = null;
    const userInfo = res.locals.userInfo;
    const rs = yield ingredient.editIngredientTransaction(id, parseInt(idIngredient), parseInt(qty), userInfo.id, parseInt(isUsage), idDetailTransaction);
    return rs;
}), [env_config_1.Roles.manager]));
router.post("/transaction/delete", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield ingredient.deleteIngredientTransaction(parseInt(id));
    return rs;
}), [env_config_1.Roles.manager]));
router.post("/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["name", { field: "qty", requirements: ["number"] }], req.body);
    const { name, idUnit } = req.body;
    const rs = yield ingredient.createIngredient(name, parseInt(idUnit));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([
        { field: "id", requirements: ["number"] },
        "name",
        { field: "idUnit", requirements: ["number"] },
    ], req.body);
    const { id, name, idUnit } = req.body;
    const rs = yield ingredient.editIngredient(id, name, parseInt(idUnit));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/activate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield ingredient.activateIngredient(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.body);
    const { id } = req.body;
    const rs = yield ingredient.deactivateIngredient(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.get("/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)([{ field: "id", requirements: ["number"] }], req.params);
    const id = parseInt(req.params.id);
    const rs = yield ingredient.getIngredientById(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier]));
exports.default = router;
