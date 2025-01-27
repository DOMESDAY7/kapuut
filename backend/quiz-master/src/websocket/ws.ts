import type { Server, ServerWebSocket } from "bun";
import {
    handlerClose,
    handlerDrain,
    handlerMessage,
    handlerOpen,
} from "./handlers";

export class WebSocketServer {
    static instance: WebSocketServer;
    private server?: Server;

    private constructor() {}

    public static getInstance(): WebSocketServer {
        if (!WebSocketServer.instance) {
            WebSocketServer.instance = new WebSocketServer();
        }

        return WebSocketServer.instance;
    }

    public start(port: number): Server {
        this.server = Bun.serve({
            port: port,
            fetch(req, server) {
                if (server.upgrade(req)) {
                    return;
                }
                return new Response("Upgrade failed", { status: 500 });
            },
            websocket: {
                message: (ws, message) => {
                    handlerMessage(ws, message);
                },
                open: (ws) => {
                    handlerOpen(ws);
                },
                close: (ws, code, message) => {
                    handlerClose(ws, code, message);
                },
                drain: (ws) => {
                    handlerDrain(ws);
                },
            },
        });

        console.log(`Listening on ws://localhost:${port}...`);

        return this.server;
    }

    public stop(): void {
        this.server?.stop(true);
    }
}
