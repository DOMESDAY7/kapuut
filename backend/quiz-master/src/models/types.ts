import type { Answers, Questions } from "@prisma/client";

export enum WsMessageType {
    create = "create",
    connect = "connect",
    start = "start",
    question = "question",
    answer = "answer",
    close = "close",
}

export interface CreateWsMessage {
    type: WsMessageType;
    date: Date;
    quizId: string;
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

interface QuizQuestionsState {
    current: number;
    end: number;
}

export interface QuestionWsMessage {
    type: WsMessageType;
    question: Questions;
    answers: Answers[];
    time: Date;
    state: QuizQuestionsState;
}

export interface AnswerWsMessage {
    type: WsMessageType;
    playerId: string;
    answerId: string | null;
}

export interface CloseWsMessage {
    type: WsMessageType;
    lobbyCode: string;
}
