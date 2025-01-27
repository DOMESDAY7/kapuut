enum WsMessageType {
    Connect,
    Answer,
    Close
}

interface AnswerData {
    playerId: string;
    answer: string;
}

interface WsMessage {
    type: WsMessageType;
    data: null | AnswerData;
    date: Date;
    lobbyId: string;
}