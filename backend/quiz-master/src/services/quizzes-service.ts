import prisma from "../db/client";

export const getQuiz = async (quizId: string) => {
    return await prisma.quizzes.findUnique({
        where: {
            quizId,
        },
    });
};
