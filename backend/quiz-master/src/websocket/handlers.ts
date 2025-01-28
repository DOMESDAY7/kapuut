import type { ServerWebSocket } from "bun";
import type { WsMessage } from "../../models/types";
import { gameManager } from "../game-manager";

export function handlerMessage(ws: ServerWebSocket<unknown>, message: string | Buffer) {
    const obj: WsMessage = JSON.parse(message.toString());
    ws.send("A message is received from the client.");
    gameManager(ws, obj);
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
