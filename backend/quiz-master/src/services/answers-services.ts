import prisma from "../db/client";

export const getAnswers = async (questionId: string) => {
    return await prisma.answers.findMany({
        where: {
            questionId,
        },
    });
};

export const getAnwserById = async (answerId: string) => {
    return await prisma.answers.findUnique({
        where: {
            answerId,
        },
    });
};
