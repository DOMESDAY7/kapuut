import type { ServerWebSocket } from "bun";
import type { WsMessage } from "../models/types";

export function gameManager(ws: ServerWebSocket<unknown>, message: WsMessage): void {
    if(message.type === 1) {
        
    } else
    if(message.type === 2) {
        const playerId = ws.remoteAddress;
    }
}