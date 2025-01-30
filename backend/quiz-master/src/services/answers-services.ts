import prisma from "../prisma/client";

export const getAnswers = async (questionId: string) => {
    return await prisma.answers.findMany({
        where: {
            questionId,
        },
    });
};
