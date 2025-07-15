"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
const routes_1 = __importDefault(require("./routes"));
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
exports.server = (0, node_http_1.createServer)(routes_1.default);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
exports.io.on("connection", (socket) => {
    socket.on("newOrder", (msg) => {
        exports.io.emit("refreshOrder", msg);
    });
    socket.on("finishOrder", (msg) => {
        exports.io.emit("refreshOrder", msg);
    });
});
