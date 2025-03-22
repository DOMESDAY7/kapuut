import prisma from "../db/client";

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

export const getLobbyByCodeWithPlayers = async (lobbyCode: string) => {
    return await prisma.lobbys.findUnique({
        where: {
            lobbyCode,
        },
        include: {
            player: true,
        },
    });
}

export const updateLobby = async (
    lobbyId: string,
    currentQuestion?: number,
    isOver?: boolean
) => {
    const data: { currentQuestion?: number; isOver?: boolean } = {};

    if (currentQuestion !== undefined) {
        data.currentQuestion = currentQuestion;
    }

    if (isOver !== undefined) {
        data.isOver = isOver;
    }

    return await prisma.lobbys.update({
        where: {
            lobbyId,
        },
        data,
    });
};
