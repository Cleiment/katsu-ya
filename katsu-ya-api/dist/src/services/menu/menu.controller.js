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
const prisma_1 = __importDefault(require("../../tools/prisma"));
const errors_1 = require("../../definitions/errors");
class Menu {
    constructor() {
        this.validateMenuIngredient = (data) => data &&
            data.idIngredient !== undefined &&
            data.qty !== undefined;
        this.getCounts = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 5) {
            const total = yield prisma_1.default.menu.count({ where: { status: 1 } });
            const totalPages = Math.ceil(total / limit);
            return {
                total: total,
                totalPages: totalPages,
            };
        });
        this.getByPage = (page, limit, showDeactivated) => __awaiter(this, void 0, void 0, function* () {
            const { total, totalPages } = yield this.getCounts(limit);
            const currentPage = Math.min(page, totalPages || 1);
            const offset = (currentPage - 1) * limit;
            const data = yield prisma_1.default.menu.findMany({
                skip: offset,
                take: limit,
                include: {
                    ingredients: {
                        select: {
                            qty: true,
                            ingredient: {
                                include: {
                                    IngredientHold: true,
                                    unit: true,
                                },
                            },
                        },
                    },
                    category: true,
                    _count: {
                        select: {
                            transactionDetail: true,
                        },
                    },
                },
                where: {
                    OR: [{ status: 1 }, { status: showDeactivated ? 0 : 1 }],
                },
            });
            data.map((item) => {
                item.ingredients.forEach((a) => {
                    a.ingredient.IngredientHold.forEach((v) => {
                        a.ingredient.qty -= v.qty;
                    });
                });
                return item;
            });
            return {
                total: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit,
                data: data,
            };
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.default.menu.findMany({
                include: {
                    ingredients: {
                        select: {
                            qty: true,
                            ingredient: {
                                include: {
                                    IngredientHold: true,
                                    unit: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            transactionDetail: true,
                        },
                    },
                },
                where: { status: 1 },
            });
            res.map((item) => {
                item.ingredients.forEach((a) => {
                    a.ingredient.IngredientHold.forEach((v) => {
                        a.ingredient.qty -= v.qty;
                    });
                });
                return item;
            });
            return res;
        });
        this.getMenuById = (id) => __awaiter(this, void 0, void 0, function* () {
            const menu = yield prisma_1.default.menu.findUniqueOrThrow({
                include: {
                    ingredients: {
                        select: {
                            qty: true,
                            ingredient: {
                                include: {
                                    unit: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            transactionDetail: true,
                        },
                    },
                },
                where: { id: id, status: 1 },
            });
            return menu;
        });
        this.getOrderMenu = () => __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma_1.default.menuCategory.findMany({
                include: {
                    menus: {
                        include: {
                            ingredients: {
                                select: {
                                    qty: true,
                                    ingredient: {
                                        include: {
                                            IngredientHold: true,
                                            unit: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            categories.map((category) => {
                category.menus.map((menu) => {
                    menu.ingredients.forEach((menuIngredient) => {
                        menuIngredient.ingredient.IngredientHold.forEach((onHold) => {
                            menuIngredient.ingredient.qty -= onHold.qty;
                        });
                        if (menuIngredient.qty > menuIngredient.ingredient.qty) {
                            menu.status = 0;
                        }
                    });
                });
                return category;
            });
            return categories;
        });
        this.createMenu = (name, price, ingredients, category, picture, desc) => __awaiter(this, void 0, void 0, function* () {
            const menuIngredients = ingredients.map((item) => ({
                ingredient: { connect: { id: item.idIngredient } },
                qty: item.qty,
            }));
            yield prisma_1.default.menu.create({
                data: {
                    name: name,
                    price: price,
                    ingredients: {
                        create: menuIngredients,
                    },
                    idCategory: category.id,
                    picture: picture,
                    desc: desc,
                },
            });
            return { success: "Menu successfuly created!" };
        });
        this.editMenu = (id_1, name_1, price_1, ingredients_1, category_1, ...args_1) => __awaiter(this, [id_1, name_1, price_1, ingredients_1, category_1, ...args_1], void 0, function* (id, name, price, ingredients, category, picture = null, desc) {
            const menu = yield prisma_1.default.menu.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.menuIngredient.deleteMany({
                where: {
                    idMenu: menu.id,
                },
            });
            const data = yield prisma_1.default.menu.update({
                where: { id: id },
                data: {
                    name: name,
                    price: price,
                    idCategory: category.id,
                    desc: desc,
                },
            });
            if (picture)
                yield prisma_1.default.menu.update({
                    where: { id: id },
                    data: {
                        picture: picture,
                    },
                });
            ingredients.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield prisma_1.default.menuIngredient.create({
                    data: {
                        idIngredient: item.idIngredient,
                        qty: item.qty,
                        idMenu: menu.id,
                    },
                });
            }));
            return { data: data, success: "Menu successfuly edited" };
        });
        this.deactivateMenu = (id) => __awaiter(this, void 0, void 0, function* () {
            const menu = yield prisma_1.default.menu.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.menu.update({
                where: { id: id },
                data: { status: 0 },
            });
            return { success: "Menu successfuly deactivated" };
        });
        this.activateMenu = (id) => __awaiter(this, void 0, void 0, function* () {
            const menu = yield prisma_1.default.menu.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.menu.update({
                where: { id: id },
                data: { status: 1 },
            });
            return { success: "Menu successfuly activated" };
        });
        this.deleteMenu = (id) => __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.getMenuById(id);
            if (menu._count.transactionDetail > 0)
                throw new errors_1.ErrorResponse("Can't delete, Menu has been used in a transaction.");
            yield prisma_1.default.menuIngredient.deleteMany({
                where: {
                    idMenu: menu.id,
                },
            });
            yield prisma_1.default.menu.delete({
                where: { id: menu.id },
            });
            return { success: "Menu successfuly deleted" };
        });
    }
}
exports.default = Menu;
