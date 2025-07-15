"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const validate_1 = require("../../tools/validate");
const handler_1 = require("../../tools/handler");
const env_config_1 = require("../../config/env.config");
const router = (0, express_1.Router)();
const auth = new auth_controller_1.default();
router.use(express_1.default.json());
router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = {
        id: "cmckrnv8c0001x1aj2zt2eqw2",
        userRole: {
            role: env_config_1.Roles.guest,
        },
    };
    res.locals.userInfo = userInfo;
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        const userInfo = yield auth.checkToken(token).catch((err) => next(err));
        res.locals.userInfo = userInfo;
    }
    return next();
}));
router.post("/login", (0, handler_1.requestHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, validate_1.validate)(["username", "password"], req.body);
    const { username, password } = req.body;
    const rs = yield auth.login(username, password);
    return rs;
}), [env_config_1.Roles.guest]));
exports.default = router;
