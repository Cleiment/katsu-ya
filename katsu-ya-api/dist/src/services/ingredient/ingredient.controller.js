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
class Ingredient {
    constructor() {
        this.getIngredientUnitCounts = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 5) {
            const total = yield prisma_1.default.ingredientUnit.count({
                where: { status: 1 },
            });
            const totalPages = Math.ceil(total / limit);
            return {
                total: total,
                totalPages: totalPages,
            };
        });
        this.getIngredientCounts = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 5) {
            const total = yield prisma_1.default.ingredient.count({ where: { status: 1 } });
            const totalPages = Math.ceil(total / limit);
            return {
                total: total,
                totalPages: totalPages,
            };
        });
        this.getIngredientUnitByPage = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const { total, totalPages } = yield this.getIngredientUnitCounts(limit);
            const currentPage = Math.min(page, totalPages || 1);
            const offset = (currentPage - 1) * limit;
            const data = yield prisma_1.default.ingredientUnit.findMany({
                skip: offset,
                take: limit,
                where: { status: 1 },
            });
            return {
                total: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit: limit,
                data: data,
            };
        });
        this.getAllIngredientUnit = () => __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_1.default.ingredientUnit.findMany({
                where: { status: 1 },
            });
            return unit;
        });
        this.createIngredientUnit = (name) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.ingredientUnit.create({
                data: {
                    name: name,
                },
            });
            return { success: "Ingredient Unit successfuly created!" };
        });
        this.editIngredientUnit = (id, name) => __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_1.default.ingredientUnit.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredientUnit.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                },
            });
            return { success: "Ingredient Unit successfuly edited!" };
        });
        this.activateIngredientUnit = (id) => __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_1.default.ingredientUnit.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredientUnit.update({
                where: { id: id },
                data: { status: 1 },
            });
            return { success: "Ingredient Unit successfuly activated!" };
        });
        this.deactivateIngredientUnit = (id) => __awaiter(this, void 0, void 0, function* () {
            const unit = yield prisma_1.default.ingredientUnit.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredientUnit.update({
                where: { id: id },
                data: { status: 0 },
            });
            return { success: "Ingredient Unit successfuly deactivated!" };
        });
        this.getIngredientByPage = (page, limit, showDeactivated) => __awaiter(this, void 0, void 0, function* () {
            const { total, totalPages } = yield this.getIngredientCounts(limit);
            const currentPage = Math.min(page, totalPages || 1);
            const offset = (currentPage - 1) * limit;
            const data = yield prisma_1.default.ingredient.findMany({
                skip: offset,
                take: limit,
                include: {
                    unit: true,
                    IngredientHold: true,
                },
                where: {
                    OR: [{ status: 1 }, { status: showDeactivated ? 0 : 1 }],
                },
            });
            data.map((item) => {
                item.IngredientHold.forEach((v) => {
                    item.qty -= v.qty;
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
        this.getAllIngredient = () => __awaiter(this, void 0, void 0, function* () {
            const ingredients = yield prisma_1.default.ingredient.findMany({
                include: {
                    unit: true,
                    IngredientHold: true,
                },
                where: { status: 1 },
            });
            ingredients.map((item) => {
                item.IngredientHold.forEach((v) => {
                    item.qty -= v.qty;
                });
                return item;
            });
            return ingredients;
        });
        this.getIngredientById = (id) => __awaiter(this, void 0, void 0, function* () {
            const ingredient = yield prisma_1.default.ingredient.findUniqueOrThrow({
                where: { id: id },
                include: {
                    unit: true,
                    // IngredientHold: true,
                },
            });
            // ingredient.IngredientHold.forEach((v) => {
            //     ingredient.qty -= v.qty
            // })
            return ingredient;
        });
        this.createIngredient = (name, idUnit) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.ingredient.create({
                data: {
                    name: name,
                    idUnit: idUnit,
                    qty: 0,
                },
            });
            return { success: "Ingredient successfuly created!" };
        });
        this.editIngredient = (id, name, idUnit) => __awaiter(this, void 0, void 0, function* () {
            const ingredient = yield prisma_1.default.ingredient.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredient.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                    idUnit: idUnit,
                },
            });
            return { success: "Ingredient successfuly edited!" };
        });
        this.activateIngredient = (id) => __awaiter(this, void 0, void 0, function* () {
            const ingredient = yield prisma_1.default.ingredient.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredient.update({
                where: { id: id },
                data: { status: 1 },
            });
            return { success: "Ingredient successfuly activated!" };
        });
        this.deactivateIngredient = (id) => __awaiter(this, void 0, void 0, function* () {
            const ingredient = yield prisma_1.default.ingredient.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.ingredient.update({
                where: { id: id },
                data: { status: 0 },
            });
            return { success: "Ingredient successfuly deactivated!" };
        });
        this.setIngredientsQty = () => __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setMinutes(date.getMinutes() - 1);
            const transactionsQty = yield prisma_1.default.ingredientTransaction.groupBy({
                by: ["idIngredient", "isUsage"],
                _sum: {
                    qty: true,
                },
                where: {
                    updatedAt: {
                        gte: date,
                    },
                },
            });
            const qtyFinals = [];
            transactionsQty.forEach((item) => {
                const qty = item.isUsage == 0 ? item._sum.qty || 0 : -(item._sum.qty || 0);
                if (!qtyFinals.some((v) => v.idIngredient == item.idIngredient)) {
                    qtyFinals.push({ idIngredient: item.idIngredient, qty: qty });
                }
                else {
                    qtyFinals.forEach((v) => {
                        if (v.idIngredient == item.idIngredient) {
                            v.qty += qty;
                            return;
                        }
                    });
                }
            });
            qtyFinals.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield prisma_1.default.ingredient.update({
                    data: {
                        qty: item.qty,
                    },
                    where: {
                        id: item.idIngredient,
                    },
                });
            }));
        });
        this.setIngredientQtyById = (id, qty) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.ingredient.update({
                data: {
                    qty: {
                        increment: qty,
                    },
                },
                where: {
                    id: id,
                },
            });
        });
        this.getIngredientTransactions = () => __awaiter(this, void 0, void 0, function* () {
            const transactions = yield prisma_1.default.ingredientTransaction.findMany({
                select: {
                    id: true,
                    stockUsage: {
                        select: {
                            idTransaction: true,
                        },
                    },
                    ingredient: {
                        select: {
                            id: true,
                            name: true,
                            unit: true,
                        },
                    },
                    isUsage: true,
                    qty: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return transactions;
        });
        this.getIngredientTransactionsByIdIngredient = (idIngredient) => __awaiter(this, void 0, void 0, function* () {
            const transactions = yield prisma_1.default.ingredientTransaction.findUniqueOrThrow({
                select: {
                    id: true,
                    ingredient: {
                        select: {
                            name: true,
                            unit: true,
                        },
                    },
                    isUsage: true,
                    qty: true,
                    user: {
                        select: {
                            username: true,
                        },
                    },
                },
                where: {
                    id: idIngredient,
                },
            });
            return transactions;
        });
        this.createIngredientTransaction = (idIngredient_1, qty_1, idUser_1, isUsage_1, ...args_1) => __awaiter(this, [idIngredient_1, qty_1, idUser_1, isUsage_1, ...args_1], void 0, function* (idIngredient, qty, idUser, isUsage, idTransactionDetail = null) {
            yield prisma_1.default.ingredientTransaction.create({
                data: {
                    idTransactionDetail: idTransactionDetail,
                    idIngredient: idIngredient,
                    qty: qty,
                    isUsage: isUsage,
                    idUser: idUser,
                },
            });
            yield this.setIngredientsQty();
            return { success: "Ingredient Transaction successfuly created!" };
        });
        this.editIngredientTransaction = (id_1, idIngredient_1, qty_1, idUser_1, isUsage_1, ...args_1) => __awaiter(this, [id_1, idIngredient_1, qty_1, idUser_1, isUsage_1, ...args_1], void 0, function* (id, idIngredient, qty, idUser, isUsage, idDetailTransaction = null) {
            const transaction = yield prisma_1.default.ingredientTransaction.findUniqueOrThrow({
                where: { id: id },
            });
            if (transaction.idTransactionDetail) {
                throw new errors_1.ErrorResponse("Transaction's usage can't be edited.");
            }
            transaction.idTransactionDetail = idDetailTransaction;
            transaction.idIngredient = idIngredient;
            transaction.idUser = idUser;
            transaction.qty = qty;
            transaction.isUsage = isUsage;
            yield prisma_1.default.ingredientTransaction.update({
                where: {
                    id: id,
                },
                data: transaction,
            });
            yield this.setIngredientsQty();
            return { success: "Ingredient Transaction successfuly edited!" };
        });
        this.deleteIngredientTransaction = (id) => __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.default.ingredientTransaction.findUniqueOrThrow({
                where: { id: id },
            });
            if (transaction.idTransactionDetail) {
                throw new errors_1.ErrorResponse("Transaction's usage can't be deleted.");
            }
            yield this.setIngredientQtyById(transaction.idIngredient, -transaction.qty);
            yield prisma_1.default.ingredientTransaction.delete({
                where: { id: id },
            });
            return { success: "Ingredient Transaction successfuly deleted!" };
        });
    }
}
exports.default = Ingredient;
