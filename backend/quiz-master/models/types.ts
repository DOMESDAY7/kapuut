export enum WsMessageType {
    create = "create",
    connect = "connect",
    start = "start",
    question = "question",
    answer = "answer",
    close = "close",
}

export interface createWsMessage {
    type: WsMessageType;
    date: Date;
}

export interface ConnectWsMessage {
    type: WsMessageType;
    playerName: string;
    lobbyCode: string;
}

export interface StartWsMessage {
    type: WsMessageType;
    lobbyCode: string;
}

export interface QuestionWsMessage {
    type: WsMessageType;
    question: string;
    answers: string[];
    correctAnswer: string;
    time: number;
}

export interface answerWsMessage {
    type: WsMessageType;
    playerId: string;
    answer: string;
}

export interface CloseWsMessage {
    type: WsMessageType;
    lobbyCode: string;
}
