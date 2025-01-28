import type { ServerWebSocket } from "bun";
import { gameManager } from "../game-manager";
import { WebSocketServer } from "./ws";

const server = WebSocketServer.getInstance();

export function handlerMessage(ws: ServerWebSocket<unknown>, message: string | Buffer) {
    const obj = JSON.parse(message.toString());
    ws.send("A message is received from the client.");
    gameManager(obj.type, message);
}

export function handlerOpen(ws: ServerWebSocket<unknown>) {
    ws.send("A socket is opened.");
}

export function handlerClose(ws: ServerWebSocket<unknown>, code: number, message: string | Buffer) {
    console.log(`A socket is closed with code ${code} and message ${message}.`);
}

export function handlerDrain(ws: ServerWebSocket<unknown>) {
    console.log("The socket is ready to receive more data.");
}
