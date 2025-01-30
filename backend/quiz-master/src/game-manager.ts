import type { ServerWebSocket } from "bun";
import { serve } from "./main";
import {
    WsMessageType,
    type AnswerWsMessage,
    type CloseWsMessage,
    type ConnectWsMessage,
    type CreateWsMessage,
    type QuestionWsMessage,
    type StartWsMessage,
} from "./models/types";
import { getAnswers } from "./services/answers-services";
import { createLobby, getLobbyByCode } from "./services/lobbys-service";
import { createPlayer } from "./services/players-service";
import { getNQuestion } from "./services/questions-services";

export async function gameManager(
    ws: ServerWebSocket<unknown>,
    messageType: WsMessageType,
    message: string | Buffer
): Promise<void> {
    // Create a new lobby
    if (messageType === WsMessageType.create) {
        const obj: CreateWsMessage = JSON.parse(message.toString());
        createLobby(obj.quizId).then((lobby) => {
            console.log(`Created lobby with code: ${lobby.lobbyCode}`);
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
            if (lobby) {
                serve.sendMessageToALobby(
                    lobby.lobbyId,
                    `< start game: ${lobby.lobbyCode} >`
                );
                sendQuestion(lobby.quizId, lobby.currentQuestion);
            }
        });
    }

    // Answer from player
    else if (messageType === WsMessageType.answer) {
        const obj: AnswerWsMessage = JSON.parse(message.toString());
        // TO DO
    }

    // Close the lobby
    else if (messageType === WsMessageType.close) {
        const obj: CloseWsMessage = JSON.parse(message.toString());
        getLobbyByCode(obj.lobbyCode).then((lobby) => {
            if (lobby) {
                serve.deleteLobby(lobby.lobbyId);
            }
        });
    }
}

function sendQuestion(quizId: string, currentQuestion: number): void {
    getNQuestion(quizId, currentQuestion).then((question) => {
        getAnswers(question.question.questionId).then((answers) => {
            const data: QuestionWsMessage = {
                type: WsMessageType.question,
                question: question.question,
                answers: answers,
                time: new Date(),
                state: {
                    current: currentQuestion,
                    end: question.questionCount,
                },
            };
            serve.sendMessageToALobby(quizId, JSON.stringify(data));
        });
    });
}
