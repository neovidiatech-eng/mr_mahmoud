-- AlterTable
ALTER TABLE "course_purchase_request" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "studentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "quiz" (
    "id" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL DEFAULT '',
    "title_en" TEXT DEFAULT '',
    "description_ar" TEXT NOT NULL DEFAULT '',
    "description_en" TEXT DEFAULT '',
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "pass_points" INTEGER NOT NULL DEFAULT 0,
    "duration_min" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "question_ar" TEXT NOT NULL DEFAULT '',
    "question_en" TEXT DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'MCQ',
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_text_ar" TEXT NOT NULL DEFAULT '',
    "option_text_en" TEXT DEFAULT '',
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quiz_title_ar_idx" ON "quiz"("title_ar");

-- CreateIndex
CREATE INDEX "quiz_title_en_idx" ON "quiz"("title_en");

-- CreateIndex
CREATE INDEX "question_quiz_id_idx" ON "question"("quiz_id");

-- CreateIndex
CREATE INDEX "options_question_id_idx" ON "options"("question_id");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
