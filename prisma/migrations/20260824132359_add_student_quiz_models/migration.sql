-- CreateTable
CREATE TABLE "studentQuiz" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "pass_points" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentQuizAnswer" (
    "id" TEXT NOT NULL,
    "student_quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_id" TEXT,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentQuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "studentQuiz_student_id_idx" ON "studentQuiz"("student_id");

-- CreateIndex
CREATE INDEX "studentQuiz_quiz_id_idx" ON "studentQuiz"("quiz_id");

-- CreateIndex
CREATE INDEX "studentQuiz_student_id_quiz_id_idx" ON "studentQuiz"("student_id", "quiz_id");

-- CreateIndex
CREATE INDEX "studentQuizAnswer_student_quiz_id_idx" ON "studentQuizAnswer"("student_quiz_id");

-- CreateIndex
CREATE INDEX "studentQuizAnswer_question_id_idx" ON "studentQuizAnswer"("question_id");

-- CreateIndex
CREATE INDEX "studentQuizAnswer_option_id_idx" ON "studentQuizAnswer"("option_id");

-- CreateIndex
CREATE UNIQUE INDEX "studentQuizAnswer_student_quiz_id_question_id_key" ON "studentQuizAnswer"("student_quiz_id", "question_id");

-- AddForeignKey
ALTER TABLE "studentQuiz" ADD CONSTRAINT "studentQuiz_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuiz" ADD CONSTRAINT "studentQuiz_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuizAnswer" ADD CONSTRAINT "studentQuizAnswer_student_quiz_id_fkey" FOREIGN KEY ("student_quiz_id") REFERENCES "studentQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuizAnswer" ADD CONSTRAINT "studentQuizAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuizAnswer" ADD CONSTRAINT "studentQuizAnswer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "options"("id") ON DELETE SET NULL ON UPDATE CASCADE;
