import type { ServerWebSocket } from "bun";
import { gameManager } from "../game-manager";

export function handlerMessage(
    ws: ServerWebSocket<unknown>,
    message: string | Buffer
) {
    const obj = JSON.parse(message.toString());
    gameManager(ws, obj.type, message);
}

export function handlerOpen(ws: ServerWebSocket<unknown>) {}

export function handlerClose(
    ws: ServerWebSocket<unknown>,
    code: number,
    message: string | Buffer
) {}

export function handlerDrain(ws: ServerWebSocket<unknown>) {}
