"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ingredient_routes_1 = __importDefault(require("../services/ingredient/ingredient.routes"));
const category_routes_1 = __importDefault(require("../services/category/category.routes"));
const menu_routes_1 = __importDefault(require("../services/menu/menu.routes"));
const user_routes_1 = __importDefault(require("../services/user/user.routes"));
const auth_routes_1 = __importDefault(require("../services/auth/auth.routes"));
const transaction_routes_1 = __importDefault(require("../services/transaction/transaction.routes"));
const handler_1 = require("../tools/handler");
const errors_1 = require("../definitions/errors");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const corsOption = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOption));
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../../public/images/")));
app.use(auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/ingredient", ingredient_routes_1.default);
app.use("/category", category_routes_1.default);
app.use("/menu", menu_routes_1.default);
app.use("/transaction", transaction_routes_1.default);
app.use((0, handler_1.requestHandler)((req, res, next) => {
    throw new errors_1.ErrorResponse();
}));
app.use(handler_1.errorHandler);
exports.default = app;
