import prisma from "../db/client";

export const getAllQuestions = async (quizId: string) => {
    return await prisma.questions.findMany({
        where: {
            quizId,
        },
    });
};

export const getNQuestion = async (quizId: string, nQuestion: number) => {
    // Vérifier d'abord combien de questions sont disponibles
    const count = await prisma.questions.count({
        where: {
            quizId,
        },
    });

    // Si nQuestion est supérieur ou égal au nombre de questions, nous avons dépassé la limite
    if (nQuestion >= count) {
        return {
            question: null,
            questionCount: count,
        };
    }

    // Récupérer la question demandée
    const question = await prisma.questions.findMany({
        where: {
            quizId,
        },
        skip: nQuestion,
        take: 1,
    });

    // Vérifier si une question a été trouvée
    if (!question || question.length === 0) {
        return {
            question: null,
            questionCount: count,
        };
    }

    return {
        question: question[0],
        questionCount: count,
    };
};
