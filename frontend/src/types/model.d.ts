export type Questions = {
    questionId: string
    question: string
    answer: Answers[]
    // quizId: string
}

export type Quizzes = {
    quizId: string
    title: string
    questions: Questions[]
}

export type Answers = {
    answerId: string
    answer: string
    isCorrect: boolean
    questionId: string
}