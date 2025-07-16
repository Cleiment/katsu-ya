import { hostname, port } from "./config/env.config"
import { io, server } from "./server"

server.listen(port, () => {
    console.log(`Serving at http://${hostname}:${port}`)
})
