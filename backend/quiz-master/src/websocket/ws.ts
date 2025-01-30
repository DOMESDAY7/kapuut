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
    private clients: ClientWs[] = [];

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
                    ws.send("< message received >");
                    handlerMessage(ws, message);
                },
                open: (ws) => {
                    ws.send("< socket opened >");
                    handlerOpen(ws);
                },
                close: (ws, code, message) => {
                    this.deleteClientByWs(ws);
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

    public addClient(
        ws: ServerWebSocket<unknown>,
        playerId: string,
        lobbyId: string
    ): void {
        const data: ClientWs = {
            ws: ws,
            playerId: playerId,
            lobbyId: lobbyId,
        };
        this.clients.push(data);
    }

    public deleteClientById(playerId: string): void {
        this.clients = this.clients.filter(
            (client) => client.playerId !== playerId
        );
    }

    private deleteClientByWs(ws: ServerWebSocket<unknown>): void {
        this.clients = this.clients.filter((client) => client.ws !== ws);
    }

    public deleteLobby(lobbyId: string): void {
        const clients = this.clients.filter(
            (client) => client.lobbyId === lobbyId
        );
        clients.forEach((client) => {
            client.ws.send(`< end game: ${lobbyId} >`);
            this.deleteClientById(client.playerId);
        });
    }

    public sendMessageToAClient(playerId: string, message: string): void {
        const client = this.clients.find(
            (client) => client.playerId === playerId
        );
        client?.ws.send(message);
    }

    public sendMessageToALobby(lobbyId: string, message: string): void {
        const clients = this.clients.filter(
            (client) => client.lobbyId === lobbyId
        );
        clients.forEach((client) => client.ws.send(message));
    }
}

interface ClientWs {
    ws: ServerWebSocket<unknown>;
    playerId: string;
    lobbyId: string;
}
