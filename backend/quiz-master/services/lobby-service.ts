import prisma from "../prisma/client";

export const createLobby = async () => {
    const lobby = await prisma.lobby.create({
        data: {},
    });
    return lobby.lobbyCode;
};


