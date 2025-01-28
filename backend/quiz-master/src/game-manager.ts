import { WsMessageType, type ConnectWsMessage } from "../models/types";
import { createLobby } from "../services/lobby-service";
import { createPlayer } from "../services/player-service";

export async function gameManager(messageType: WsMessageType, message: string | Buffer): Promise<void> {
    // Create a new lobby
    if(messageType === WsMessageType.create) {
        createLobby().then((lobbyCode) => {
            console.log(`Created lobby with code: ${lobbyCode}`);
        });
    }

    // Connect to a lobby
    else if (messageType === WsMessageType.connect) {
        const obj: ConnectWsMessage = JSON.parse(message.toString());
        createPlayer(obj.playerName, obj.lobbyCode).then((player) => {
            console.log(`Player ${player.playerId} connected to lobby ${player.lobbyId}`);
        });
    }

    // Start the game
    else if (messageType === WsMessageType.start) {
    }
}