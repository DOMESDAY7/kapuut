enum WsMessageType {
    Create,
    Connect,
    Start,
    Answer,
    Close
}

interface AnswerData {
    playerId: string;
    answer: string;
}

export interface WsMessage {
    type: WsMessageType;
    data: null | AnswerData;
    date: Date;
    lobbyId: string;
}