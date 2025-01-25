import app from "./routes"
import { Server } from "socket.io"
import { createServer } from "node:http"

export const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socket.on("newOrder", (msg) => {
        io.emit("newOrder", msg)
    })
})
