import prisma from "../db/client";

export const getAllQuestions = async (quizId: string) => {
    return await prisma.questions.findMany({
        where: {
            quizId,
        },
    });
};

export const getNQuestion = async (quizId: string, nQuestion: number) => {
    // First check how many questions are available
    const count = await prisma.questions.count({
        where: {
            quizId,
        },
    });

    // If nQuestion is greater than or equal to the number of questions, we have exceeded the limit.
    if (nQuestion >= count) {
        return {
            question: null,
            questionCount: count,
        };
    }

    // Retrieve the question
    const question = await prisma.questions.findMany({
        where: {
            quizId,
        },
        skip: nQuestion,
        take: 1,
    });

    // Check if a question has been found
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
