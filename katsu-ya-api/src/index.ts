import { hostname, port } from "./config/env.config"
import { io, server } from "./server"

server.listen(port, hostname, () => {
    console.log(`Serving at http://${hostname}:${port}`)
})
