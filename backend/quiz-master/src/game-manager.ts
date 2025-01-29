import type { ServerWebSocket } from "bun";
import {
    WsMessageType,
    type ConnectWsMessage,
    type StartWsMessage,
} from "./models/types";
import { createLobby, getLobbyByCode } from "./services/lobby-service";
import { createPlayer } from "./services/player-service";
import { serve } from "./main";

export async function gameManager(
    ws: ServerWebSocket<unknown>,
    messageType: WsMessageType,
    message: string | Buffer
): Promise<void> {
    // Create a new lobby
    if (messageType === WsMessageType.create) {
        createLobby().then((lobbyCode) => {
            console.log(`Created lobby with code: ${lobbyCode}`);
        });
    }

    // Connect to a lobby
    else if (messageType === WsMessageType.connect) {
        const obj: ConnectWsMessage = JSON.parse(message.toString());
        createPlayer(obj.playerName, obj.lobbyCode).then((player) => {
            serve.addClient(ws, player.playerId, player.lobbyId);
        });
    }

    // Start the game
    else if (messageType === WsMessageType.start) {
        const obj: StartWsMessage = JSON.parse(message.toString());
        getLobbyByCode(obj.lobbyCode).then((lobby) => {
            if (lobby)
                serve.sendMessageToALobby(
                    lobby.lobbyId,
                    `< start game: ${lobby.lobbyCode}>`
                );
        });
    }
}
