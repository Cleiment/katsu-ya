"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../definitions/errors");
const publicPath = __dirname + "/../../public/";
const storageDestinations = {
    menu: publicPath + "images/menu-image/",
};
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed!"));
    }
};
const uploadImage = (storage, isImage = false) => {
    let path = "";
    if (storage == "menu")
        path = storageDestinations.menu;
    else
        throw new errors_1.ErrorResponse("Storage doesn't exist", 400);
    let multerStorage;
    if (isImage) {
        multerStorage = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path);
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + "_" + file.originalname);
                },
            }),
            fileFilter: imageFileFilter,
        });
    }
    else {
        multerStorage = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path);
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + "_" + file.originalname);
                },
            }),
        });
    }
    const response = {
        path: path,
        storage: multerStorage,
    };
    return response;
};
exports.uploadImage = uploadImage;
