import prisma from "../prisma/client";

export const createLobby = async (lobbyCode: string) => {
    return await prisma.lobby.create({
        data: {
            lobbyCode,
            Player: {
                create: [
                    { name: "Player1", score: 0 },
                ],
            },
        },
    });
};

export const getLobby = async (lobbyCode: string) => {
    return await prisma.lobby.findUnique({
        where: { lobbyCode },
        include: { Player: true },
    });
};

export const updateLobby = async (
    lobbyCode: string,
    currentQuestion: number
) => {
    return await prisma.lobby.update({
        where: { lobbyCode },
        data: {
            current_question: currentQuestion,
        },
    });
};

export const deleteLobby = async (lobbyCode: string) => {
    return await prisma.lobby.delete({
        where: { lobbyCode },
    });
};
