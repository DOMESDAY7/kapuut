import { PrismaClient } from "@prisma/client";
import { WebSocketServer } from "./websocket/ws";

const prisma = new PrismaClient();

const serve = WebSocketServer.getInstance();
serve.start(3000);
