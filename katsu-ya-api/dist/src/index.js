"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = require("./config/env.config");
const server_1 = require("./server");
server_1.server.listen(env_config_1.port, env_config_1.hostname, () => {
    console.log(`Serving at http://${env_config_1.hostname}:${env_config_1.port}`);
});
