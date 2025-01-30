import prisma from "../prisma/client";

export const getAllQuestions = async (quizId: string) => {
    return await prisma.questions.findMany({
        where: {
            quizId,
        },
    });
};

export const getNQuestion = async (quizId: string, nQuestion: number) => {
    const question = await prisma.questions.findMany({
        where: {
            quizId,
        },
        skip: nQuestion - 1, // Ignorer les questions précédentes (n - 1)
        take: 1, // Récupérer seulement la nième question
    });

    const count = await prisma.questions.count({
        where: {
            quizId,
        },
    });

    return {
        question: question[0],
        questionCount: count,
    };
};
