import { WebSocketServer } from "./websocket/ws";

const serve = WebSocketServer.getInstance();
serve.start(3000);
