import { createQuizWithQuestionsAndAnswers } from "./prisma/fake-data";
import { WebSocketServer } from "./websocket/ws";

export const serve = WebSocketServer.getInstance();
serve.start(3000);

createQuizWithQuestionsAndAnswers();
