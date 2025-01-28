import type { ServerWebSocket } from "bun";
import type { WsMessage } from "../models/types";
import { WebSocketServer } from "./websocket/ws";

const server = WebSocketServer.getInstance();

export async function gameManager(ws: ServerWebSocket<unknown>, message: WsMessage): Promise<void> {
    // Create a new lobby
    if(message.type === 0) {
        
    }
}