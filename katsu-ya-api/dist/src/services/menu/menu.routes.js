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
const menu_controller_1 = __importDefault(require("./menu.controller"));
const handler_1 = require("../../tools/handler");
const validate_1 = require("../../tools/validate");
const errors_1 = require("../../definitions/errors");
const env_config_1 = require("../../config/env.config");
const multer_1 = require("../../tools/multer");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const prisma_1 = __importDefault(require("../../tools/prisma"));
const router = (0, express_1.Router)();
const menu = new menu_controller_1.default();
const multer = (0, multer_1.uploadImage)("menu");
router.post("/new", multer.storage.single("file"), (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = JSON.parse(JSON.stringify(req.body));
    (0, validate_1.validate)([
        "name",
        { field: "price", requirements: ["number"] },
        "ingredients",
        "category",
        "desc",
    ], body);
    if (!file)
        throw new errors_1.ValidationError({ file: ["Menu needs picture"] });
    let { name, price, ingredients, category, desc } = body;
    name = JSON.parse(name);
    price = JSON.parse(price);
    ingredients = JSON.parse(ingredients);
    category = JSON.parse(category);
    desc = JSON.parse(desc);
    if (Array.isArray(ingredients)) {
        const validateError = new errors_1.ErrorResponse();
        if (ingredients.length == 0)
            throw validateError;
        ingredients.forEach((item) => {
            if (!menu.validateMenuIngredient(item))
                throw validateError;
        });
    }
    const extension = node_path_1.default.extname(file.originalname);
    const safeMenuName = name.replace(/\s+/g, "_").toLowerCase();
    const newFilename = `${safeMenuName}_${Date.now()}${extension}`;
    const newPath = node_path_1.default.join(multer.path, newFilename);
    try {
        const rs = yield menu.createMenu(name, parseInt(price), ingredients, category, newFilename, desc);
        node_fs_1.default.renameSync(file.path, newPath);
        return rs;
    }
    catch (err) {
        node_fs_1.default.unlink(file.path, () => { });
        throw err;
    }
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/edit", multer.storage.single("file"), (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = JSON.parse(JSON.stringify(req.body));
    (0, validate_1.validate)([
        "name",
        { field: "price", requirements: ["number"] },
        "ingredients",
        "desc",
    ], body);
    let { id, name, price, ingredients, category, desc } = body;
    id = JSON.parse(id);
    name = JSON.parse(name);
    price = JSON.parse(price);
    ingredients = JSON.parse(ingredients);
    category = JSON.parse(category);
    desc = JSON.parse(desc);
    const existingMenu = yield prisma_1.default.menu.findUniqueOrThrow({
        where: { id: id },
    });
    if (Array.isArray(ingredients)) {
        const validateError = new errors_1.ErrorResponse();
        if (ingredients.length == 0)
            throw validateError;
        ingredients.forEach((item) => {
            if (!menu.validateMenuIngredient(item))
                throw validateError;
        });
    }
    const filename = file ? file.originalname : existingMenu.picture;
    const extension = node_path_1.default.extname(filename);
    const safeMenuName = name.replace(/\s+/g, "_").toLowerCase();
    const newFilename = `${safeMenuName}_${Date.now()}${extension}`;
    const newPath = node_path_1.default.join(multer.path, newFilename);
    try {
        const rs = yield menu.editMenu(id, name, parseInt(price), ingredients, category, newFilename, desc);
        node_fs_1.default.renameSync(file
            ? file.path
            : node_path_1.default.join(multer.path, existingMenu.picture), newPath);
        node_fs_1.default.unlink(node_path_1.default.join(multer.path, rs.data.picture), () => { });
        return { success: rs.success };
    }
    catch (err) {
        if (file)
            node_fs_1.default.unlink(file.path, () => { });
        throw err;
    }
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.use((0, express_1.json)());
router.get("/", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const showDeactivated = (0, validate_1.booleanFromString)(req.query.show_deactivated) || false;
    const rs = yield menu.getByPage(page, limit, showDeactivated);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/order-menu", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield menu.getOrderMenu();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.get("/all", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield menu.getAll();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen, env_config_1.Roles.guest]));
router.post("/deactivate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.body);
    const { id } = req.body;
    const rs = yield menu.deactivateMenu(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/activate", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.body);
    const { id } = req.body;
    const rs = yield menu.activateMenu(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.post("/delete", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.body);
    const { id } = req.body;
    const rs = yield menu.deleteMenu(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
router.get("/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.params);
    const id = req.params.id;
    const rs = yield menu.getMenuById(id);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager]));
exports.default = router;
