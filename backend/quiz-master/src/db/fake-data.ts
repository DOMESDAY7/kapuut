import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createQuizWithQuestionsAndAnswers() {
    try {
        // Supprimer les données dans l'ordre correct
        await prisma.players.deleteMany({});
        await prisma.lobbys.deleteMany({});
        await prisma.answers.deleteMany({});
        await prisma.questions.deleteMany({});
        await prisma.quizzes.deleteMany({});

        // Créer un quiz
        const quiz = await prisma.quizzes.create({
            data: {
                quiz: "General Knowledge Quiz", // Nom du quiz
                question: {
                    create: [
                        {
                            question: "What is the capital of France?",
                            answer: {
                                create: [
                                    { answer: "Paris", isCorrect: true },
                                    { answer: "Berlin", isCorrect: false },
                                    { answer: "Madrid", isCorrect: false },
                                ],
                            },
                        },
                        {
                            question: "Which planet is known as the Red Planet?",
                            answer: {
                                create: [
                                    { answer: "Earth", isCorrect: false },
                                    { answer: "Mars", isCorrect: true },
                                    { answer: "Jupiter", isCorrect: false },
                                ],
                            },
                        },
                        {
                            question: 'Who wrote "To Kill a Mockingbird"?',
                            answer: {
                                create: [
                                    { answer: "Harper Lee", isCorrect: true },
                                    { answer: "J.K. Rowling", isCorrect: false },
                                    { answer: "Ernest Hemingway", isCorrect: false },
                                ],
                            },
                        },
                    ],
                },
            },
        });

        console.log("Quiz créé avec succès:", quiz);
    } catch (error) {
        console.error("Erreur lors de la création du quiz:", error);
    } finally {
        await prisma.$disconnect();
    }
}
