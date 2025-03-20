-- CreateTable
CREATE TABLE "Quizzes" (
    "quizId" TEXT NOT NULL,
    "quiz" TEXT NOT NULL,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("quizId")
);

-- CreateTable
CREATE TABLE "Questions" (
    "questionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "Answers" (
    "answerId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("answerId")
);

-- CreateTable
CREATE TABLE "Lobbys" (
    "lobbyId" TEXT NOT NULL,
    "lobbyCode" TEXT NOT NULL,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "isOver" BOOLEAN NOT NULL DEFAULT false,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "Lobbys_pkey" PRIMARY KEY ("lobbyId")
);

-- CreateTable
CREATE TABLE "Players" (
    "playerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "lobbyId" TEXT NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("playerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobbys_lobbyCode_key" ON "Lobbys"("lobbyCode");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("questionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobbys" ADD CONSTRAINT "Lobbys_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobbys"("lobbyId") ON DELETE RESTRICT ON UPDATE CASCADE;