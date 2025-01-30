import prisma from "../prisma/client";

export const createLobby = async (quizzId: string) => {
    return await prisma.lobbys.create({
        data: {
            quizId: quizzId,
        },
    });
};

export const getLobbyByCode = async (lobbyCode: string) => {
    return await prisma.lobbys.findUnique({
        where: {
            lobbyCode,
        },
    });
};
