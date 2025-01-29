import prisma from "../prisma/client";

export const createLobby = async () => {
    const lobby = await prisma.lobbys.create({
        data: {},
    });
    return lobby.lobbyCode;
};

export const getLobbyByCode = async (lobbyCode: string) => {
    return await prisma.lobbys.findUnique({
        where: {
            lobbyCode,
        },
    });
};
