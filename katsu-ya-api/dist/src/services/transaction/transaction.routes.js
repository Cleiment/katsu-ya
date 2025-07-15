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
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const handler_1 = require("../../tools/handler");
const validate_1 = require("../../tools/validate");
const errors_1 = require("../../definitions/errors");
const env_config_1 = require("../../config/env.config");
const router = (0, express_1.Router)();
const transaction = new transaction_controller_1.default();
router.use((0, express_1.json)());
router.get("/", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield transaction.getTableOrder();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.get("/available-table", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rs = yield transaction.getAvailableTable();
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.post("/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["details"], req.body);
    const { details } = req.body;
    const idUser = res.locals.userInfo.id;
    if (Array.isArray(details)) {
        const validateError = new errors_1.ErrorResponse();
        if (details.length == 0)
            throw validateError;
        details.forEach((item) => {
            if (!transaction.validateTransactionDetail(item))
                throw validateError;
        });
    }
    const rs = yield transaction.createTransaction(details, idUser);
    return rs;
}), [env_config_1.Roles.cashier]));
router.post("/edit", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id", "details"], req.body);
    const { id, details } = req.body;
    const idUser = res.locals.userInfo.id;
    if (Array.isArray(details)) {
        const validateError = new errors_1.ErrorResponse();
        if (details.length == 0)
            throw validateError;
        details.forEach((item) => {
            if (!transaction.validateTransactionDetail(item))
                throw validateError;
        });
    }
    const rs = yield transaction.editTransaction(id, details, idUser);
    return rs;
}), [env_config_1.Roles.cashier]));
router.get("/get-cart/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const rs = yield transaction.getTransactionCartById(id);
    return rs;
}), [env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.post("/cart/new", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idTable, TransactionCart } = req.body;
    const idUser = res.locals.userInfo.id;
    const rs = yield transaction.createTransactionCart(TransactionCart.transactionCartDetail, idUser, idTable);
    return rs;
}), [env_config_1.Roles.cashier, env_config_1.Roles.guest]));
// router.post(
//     "/cart/remove_item",
//     requestHandler(
//         async (req, res) => {
//             const { idCartDetail } = req.body
//             const rs = await transaction.deleteFromCart(idCartDetail)
//             return rs
//         },
//         [Roles.cashier, Roles.guest]
//     )
// )
router.post("/cart/finish", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paid, transactionCart } = req.body;
    const rs = yield transaction.finishTransactionCart(paid, transactionCart);
    return rs;
}), [env_config_1.Roles.cashier]));
router.post("/order/pay", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCart, paymentType } = req.body;
    const rs = yield transaction.payCart(idCart, paymentType);
    return rs;
}), [env_config_1.Roles.guest]));
router.get("/orders", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction.getTransactionsCart();
}), [env_config_1.Roles.cashier, env_config_1.Roles.kitchen]));
router.post("/report", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["startDate", "endDate"], req.body);
    const { startDate, endDate } = req.body;
    const rs = yield transaction.getTransactions(startDate, endDate);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier]));
router.get("/order/table/:idTable", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["idTable"], req.params);
    const idTable = req.params.idTable;
    const rs = yield transaction.getOrderByTable(parseInt(idTable) || 0);
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.post("/pay/get-token", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["idCart", "firstName", "email", "phone"], req.body);
    const { idCart, firstName, email, phone } = req.body;
    const rs = yield transaction.getPaymentToken(idCart, firstName, email, phone);
    return rs;
}), [env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.get("/struk/:idOrder", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idOrder = req.params.idOrder;
    const rs = yield transaction.getTransactionByIdOrder(idOrder);
    return rs;
}), [env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.guest]));
router.get("/:id", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["id"], req.params);
    const id = req.params.id;
    const rs = yield transaction.getTransactionById(parseInt(id));
    return rs;
}), [env_config_1.Roles.admin, env_config_1.Roles.manager, env_config_1.Roles.cashier, env_config_1.Roles.guest]));
exports.default = router;
