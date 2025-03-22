import type { ServerWebSocket } from "bun";
import { serve } from "./main";
import {
    WsMessageType,
    type AnswerWsMessage,
    type CloseWsMessage,
    type ConnectWsMessage,
    type CreateWsMessage,
    type LobbyWsMessage,
    type QuestionWsMessage,
    type StartWsMessage,
} from "./models/types";
import { getAnswers, getAnwserById } from "./services/answers-services";
import {
    createLobby,
    getLobbyByCode,
    getLobbyByCodeWithPlayers,
    updateLobby,
} from "./services/lobbys-service";
import {
    createPlayer,
    getAllPlayerByLobby,
    getPlayer,
    updatePlayer,
} from "./services/players-service";
import { getNQuestion } from "./services/questions-services";

export async function gameManager(
    ws: ServerWebSocket<unknown>,
    messageType: WsMessageType,
    message: string | Buffer
): Promise<void> {
    // Create a new lobby
    if (messageType === WsMessageType.create) {
        try {
            const obj: CreateWsMessage = JSON.parse(message.toString());
            const lobby = await createLobby(obj.quizId);
            ws.send(JSON.stringify({ lobbyCode: lobby.lobbyCode }));
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: `invalid JSON format : ${message}` }));
        }
    }

    // Connect to a lobby
    else if (messageType === WsMessageType.connect) {
        try {
            const obj: ConnectWsMessage = JSON.parse(message.toString());
            const player = await createPlayer(obj.playerName, obj.lobbyCode);
            const lobby = await getLobbyByCode(obj.lobbyCode);
            
            serve.addClient(ws, player.playerId, player.lobbyId);
            
            ws.send(JSON.stringify({
                type: WsMessageType.connect,
                newPlayer: {
                    playerId: player.playerId,
                    playerName: obj.playerName,
                    lobbyCode: obj.lobbyCode,
                }
            }));
            
            const allPlayers = await getAllPlayerByLobby(player.lobbyId);
            const playerNames = allPlayers.map(p => p.name);
            
            serve.sendMessageToALobby(player.lobbyId, JSON.stringify({
                type: WsMessageType.lobby,
                players: playerNames,
                lobbyCode: obj.lobbyCode
            }));
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: `invalid JSON format : ${message}` }));
        }
    }

    // Start the game
    else if (messageType === WsMessageType.start) {
        try {
            const obj: StartWsMessage = JSON.parse(message.toString());
            const lobby = await getLobbyByCode(obj.lobbyCode);
            if (!lobby) {
                console.error("Lobby not found");
                return;
            }

            ws.send(`< Game started! lobbyCode : ${lobby.lobbyCode} >`);
            serve.sendMessageToALobby(
                lobby.lobbyId,
                `< Game started! lobbyCode : ${lobby.lobbyCode} >`
            );
            await sendQuestion(
                lobby.quizId,
                lobby.currentQuestion,
                lobby.lobbyId
            );
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: `invalid JSON format : ${message}` }));
        }
    }

    // Answer from player
    else if (messageType === WsMessageType.answer) {
        try {
            const obj: AnswerWsMessage = JSON.parse(message.toString());
            ws.send(`< Answer received! answerId : ${obj.answerId} >`);
            await checkAnswer(obj.playerId, obj.answerId);
            if (await everyoneAnswered(obj.lobbyCode))
                await nextQuestion(obj.lobbyCode);
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: `invalid JSON format : ${message}` }));
        }
    }

    // Close the lobby
    else if (messageType === WsMessageType.close) {
        try {
            const obj: CloseWsMessage = JSON.parse(message.toString());
            const lobby = await getLobbyByCode(obj.lobbyCode);
            if (!lobby) {
                console.error("Lobby not found");
                return;
            }

            await updateLobby(lobby.lobbyId, undefined, true);
            serve.deleteLobby(lobby.lobbyId);
        } catch (error) {
            console.error("Error parsing message:", error);
            ws.send(JSON.stringify({ error: `invalid JSON format : ${message}` }));
        }
    }
}

async function nextQuestion(lobbyCode: string) {
    const lobby = await getLobbyByCode(lobbyCode);

    if (!lobby) {
        console.error("Lobby not found");
        return false;
    }
    if (!lobby.isOver) {
        await updateLobby(lobby.lobbyId, lobby.currentQuestion + 1, undefined);
        await sendQuestion(
            lobby.quizId,
            lobby.currentQuestion + 1,
            lobby.lobbyId
        );
    }
}

async function everyoneAnswered(lobbyCode: string): Promise<boolean> {
    const lobby = await getLobbyByCode(lobbyCode);
    if (!lobby) {
        console.error("Lobby not found");
        return false;
    }

    const players = await getAllPlayerByLobby(lobby.lobbyId);

    const allPlayersReady = players.every(
        (player) => player.currentQuestion > lobby.currentQuestion
    );

    return allPlayersReady;
}

async function checkAnswer(playerId: string, answerId: string | null) {
    const player = await getPlayer(playerId);
    if (!player) {
        console.error("Player not found");
        return;
    }

    if (answerId != null) {
        const answer = await getAnwserById(answerId);
        if (answer?.isCorrect) {
            await updatePlayer(
                playerId,
                undefined,
                player.score + 1,
                player.currentQuestion + 1
            );
        }
    }

    await updatePlayer(
        playerId,
        undefined,
        undefined,
        player.currentQuestion + 1
    );
}

async function sendQuestion(
    quizId: string,
    currentQuestion: number,
    lobbyId: string
): Promise<void> {
    const question = await getNQuestion(quizId, currentQuestion);
    const answers = await getAnswers(question.question.questionId);

    const data: QuestionWsMessage = {
        type: WsMessageType.question,
        question: question.question,
        answers: answers,
        time: new Date(),
        state: {
            current: currentQuestion + 1,
            end: question.questionCount,
        },
    };

    if (data.state.current > data.state.end) {
        await updateLobby(lobbyId, undefined, true);
    } else {
        serve.sendMessageToALobby(lobbyId, JSON.stringify(data));
    }
}
