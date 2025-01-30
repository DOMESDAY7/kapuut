import prisma from "../prisma/client";

export const getQuiz = async (quizId: string) => {
    return await prisma.quizzes.findUnique({
        where: {
            quizId,
        },
    });
};
