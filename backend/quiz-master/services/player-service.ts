import prisma from "../prisma/client";

export const createPlayer = async (name: string, lobbyCode: string) => {
    const lobby = await prisma.lobby.findUnique({
        where: {
            lobbyCode: lobbyCode,
        },
    });

    if (!lobby) {
        throw new Error(`Lobby with code "${lobbyCode}" not found.`);
    }

    const player = await prisma.player.create({
        data: {
            name,
            score: 0,
            lobbyId: lobby.lobbyId,
        },
    });

    return {
        playerId: player.playerId,
        lobbyId: player.lobbyId,
    };
};

export const getPlayer = async (playerId: string) => {
    return await prisma.player.findUnique({
        where: {
            playerId,
        },
    });
};

export const updatePlayer = async (playerId: string, name?: string, score?: number) => {
    const data: { name?: string; score?: number } = {};

    if (name !== undefined) {
        data.name = name;
    }

    if (score !== undefined) {
        data.score = score;
    }

    return await prisma.player.update({
        where: {
            playerId,
        },
        data,
    });
};

export const deletePlayer = async (playerId: string) => {
    return await prisma.player.delete({
        where: {
            playerId,
        },
    });
};
