import { Server } from "socket.io";
export declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
