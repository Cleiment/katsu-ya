import app from "./routes"
import { Server } from "socket.io"
import { createServer } from "node:http"
import { clientUrl } from "./config/env.config"

export const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: clientUrl || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socket.on("newOrder", (msg) => {
        io.emit("refreshOrder", msg)
    })
    socket.on("finishOrder", (msg) => {
        io.emit("refreshOrder", msg)
    })
})
