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
class Category {
    constructor() {
        this.getCounts = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 5) {
            const total = yield prisma_1.default.menuCategory.count({ where: { status: 1 } });
            const totalPages = Math.ceil(total / limit);
            return {
                total: total,
                totalPages: totalPages,
            };
        });
        this.getByPage = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const { total, totalPages } = yield this.getCounts(limit);
            const currentPage = Math.min(page, totalPages || 1);
            const offset = (currentPage - 1) * limit;
            const data = yield prisma_1.default.menuCategory.findMany({
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
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.default.menuCategory.findMany({
                where: { status: 1 },
            });
            return res;
        });
        this.getCategoryById = (id) => __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.menuCategory.findUniqueOrThrow({
                where: { id: id, status: 1 },
                include: {
                    _count: {
                        select: {
                            menus: {
                                where: {
                                    status: 1,
                                },
                            },
                        },
                    },
                },
            });
            return category;
        });
        this.createCategory = (name) => __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.menuCategory.create({
                data: {
                    name: name,
                },
            });
            return { success: "Category successfuly created!" };
        });
        this.editCategory = (id, name) => __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.menuCategory.findUniqueOrThrow({
                where: { id: id },
            });
            const data = yield prisma_1.default.menuCategory.update({
                where: { id: id },
                data: {
                    name: name,
                },
            });
            return { data: data, success: "Category successfuly edited" };
        });
        this.deactivateCategory = (id) => __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.menuCategory.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.menuCategory.update({
                where: { id: id },
                data: { status: 0 },
            });
            return { success: "Category successfuly deactivated" };
        });
        this.activateCategory = (id) => __awaiter(this, void 0, void 0, function* () {
            const category = yield prisma_1.default.menuCategory.findUniqueOrThrow({
                where: { id: id },
            });
            yield prisma_1.default.menuCategory.update({
                where: { id: id },
                data: { status: 1 },
            });
            return { success: "Category successfuly activated" };
        });
        this.deleteCategory = (id) => __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            yield prisma_1.default.menu.updateMany({
                data: {
                    idCategory: null,
                },
                where: {
                    idCategory: category.id,
                },
            });
            // if (category._count.menus > 0)
            //     throw new ErrorResponse(
            //         "Can't delete, Category has been used in a menu."
            //     )
            yield prisma_1.default.menuCategory.delete({
                where: { id: category.id },
            });
            return { success: "Category successfuly deleted" };
        });
    }
}
exports.default = Category;
