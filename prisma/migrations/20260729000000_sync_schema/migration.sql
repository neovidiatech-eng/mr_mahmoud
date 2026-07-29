-- ============================================================
-- Migration: sync_schema
-- Adds all tables and columns that exist in schema.prisma
-- but are missing from the migration history
-- ============================================================

-- ─── New columns on plan ──────────────────────────────────
ALTER TABLE "plan" ADD COLUMN IF NOT EXISTS "isGroup" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "plan" ADD COLUMN IF NOT EXISTS "maxStudents" TEXT NOT NULL DEFAULT '1';
ALTER TABLE "plan" ADD COLUMN IF NOT EXISTS "planType" TEXT NOT NULL DEFAULT 'individual';

-- ─── New column on ranks ──────────────────────────────────
ALTER TABLE "ranks" ADD COLUMN IF NOT EXISTS "stageName" TEXT;

-- ─── New columns on schedule ─────────────────────────────
ALTER TABLE "schedule" ADD COLUMN IF NOT EXISTS "isGroup" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "schedule" ADD COLUMN IF NOT EXISTS "maxStudents" TEXT NOT NULL DEFAULT '1';
ALTER TABLE "schedule" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;
ALTER TABLE "schedule" ALTER COLUMN "studentId" DROP NOT NULL;

-- ─── New column on teacher ───────────────────────────────
ALTER TABLE "teacher" ADD COLUMN IF NOT EXISTS "group_hour_price" DOUBLE PRECISION DEFAULT 0;

-- ─── New columns on homework ─────────────────────────────
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "feedback" TEXT;
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "grade" TEXT;
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "subjectId" TEXT;

-- ─── New columns on exam ─────────────────────────────────
ALTER TABLE "exam" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3);
ALTER TABLE "exam" ADD COLUMN IF NOT EXISTS "subject" TEXT;
ALTER TABLE "exam" ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP(3);

-- ─── New columns on courses ──────────────────────────────
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price" TEXT;

-- ─── New column on user_lectures ─────────────────────────
ALTER TABLE "user_lectures" ADD COLUMN IF NOT EXISTS "lastPosition" INTEGER DEFAULT 0;

-- ─── New table: subject ──────────────────────────────────
CREATE TABLE IF NOT EXISTS "subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "subject_name_key" ON "subject"("name");

-- ─── New table: category ─────────────────────────────────
CREATE TABLE IF NOT EXISTS "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "category_name_key" ON "category"("name");

-- ─── New table: TeacherSubject ───────────────────────────
CREATE TABLE IF NOT EXISTS "TeacherSubject" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "TeacherSubject_teacherId_subjectId_key" ON "TeacherSubject"("teacherId", "subjectId");
CREATE INDEX IF NOT EXISTS "TeacherSubject_teacherId_idx" ON "TeacherSubject"("teacherId");
CREATE INDEX IF NOT EXISTS "TeacherSubject_subjectId_idx" ON "TeacherSubject"("subjectId");

-- ─── New table: GroupScheduleStudent ─────────────────────
CREATE TABLE IF NOT EXISTS "GroupScheduleStudent" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GroupScheduleStudent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "GroupScheduleStudent_scheduleId_studentId_key" ON "GroupScheduleStudent"("scheduleId", "studentId");
CREATE INDEX IF NOT EXISTS "GroupScheduleStudent_scheduleId_idx" ON "GroupScheduleStudent"("scheduleId");
CREATE INDEX IF NOT EXISTS "GroupScheduleStudent_studentId_idx" ON "GroupScheduleStudent"("studentId");

-- ─── New table: exam_question ────────────────────────────
CREATE TABLE IF NOT EXISTS "exam_question" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exam_question_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "exam_question_examId_idx" ON "exam_question"("examId");

-- ─── New table: exam_option ──────────────────────────────
CREATE TABLE IF NOT EXISTS "exam_option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exam_option_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "exam_option_questionId_idx" ON "exam_option"("questionId");

-- ─── New table: exam_answer ──────────────────────────────
CREATE TABLE IF NOT EXISTS "exam_answer" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exam_answer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "exam_answer_examId_questionId_key" ON "exam_answer"("examId", "questionId");
CREATE INDEX IF NOT EXISTS "exam_answer_examId_idx" ON "exam_answer"("examId");
CREATE INDEX IF NOT EXISTS "exam_answer_questionId_idx" ON "exam_answer"("questionId");

-- ─── New table: course_purchase_request ──────────────────
CREATE TABLE IF NOT EXISTS "course_purchase_request" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "course_purchase_request_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "course_purchase_request_studentId_idx" ON "course_purchase_request"("studentId");
CREATE INDEX IF NOT EXISTS "course_purchase_request_courseId_idx" ON "course_purchase_request"("courseId");

-- ─── New table: CoursePurchase ───────────────────────────
CREATE TABLE IF NOT EXISTS "CoursePurchase" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoursePurchase_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CoursePurchase_studentId_courseId_key" ON "CoursePurchase"("studentId", "courseId");
CREATE INDEX IF NOT EXISTS "CoursePurchase_studentId_idx" ON "CoursePurchase"("studentId");
CREATE INDEX IF NOT EXISTS "CoursePurchase_courseId_idx" ON "CoursePurchase"("courseId");

-- ─── Foreign Keys ─────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schedule_subjectId_fkey') THEN
    ALTER TABLE "schedule" ADD CONSTRAINT "schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'homework_subjectId_fkey') THEN
    ALTER TABLE "homework" ADD CONSTRAINT "homework_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_categoryId_fkey') THEN
    ALTER TABLE "courses" ADD CONSTRAINT "courses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherSubject_teacherId_fkey') THEN
    ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherSubject_subjectId_fkey') THEN
    ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GroupScheduleStudent_scheduleId_fkey') THEN
    ALTER TABLE "GroupScheduleStudent" ADD CONSTRAINT "GroupScheduleStudent_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'GroupScheduleStudent_studentId_fkey') THEN
    ALTER TABLE "GroupScheduleStudent" ADD CONSTRAINT "GroupScheduleStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_question_examId_fkey') THEN
    ALTER TABLE "exam_question" ADD CONSTRAINT "exam_question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_option_questionId_fkey') THEN
    ALTER TABLE "exam_option" ADD CONSTRAINT "exam_option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "exam_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_answer_examId_fkey') THEN
    ALTER TABLE "exam_answer" ADD CONSTRAINT "exam_answer_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_answer_questionId_fkey') THEN
    ALTER TABLE "exam_answer" ADD CONSTRAINT "exam_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "exam_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_answer_selectedOptionId_fkey') THEN
    ALTER TABLE "exam_answer" ADD CONSTRAINT "exam_answer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "exam_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_purchase_request_studentId_fkey') THEN
    ALTER TABLE "course_purchase_request" ADD CONSTRAINT "course_purchase_request_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_purchase_request_courseId_fkey') THEN
    ALTER TABLE "course_purchase_request" ADD CONSTRAINT "course_purchase_request_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CoursePurchase_studentId_fkey') THEN
    ALTER TABLE "CoursePurchase" ADD CONSTRAINT "CoursePurchase_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CoursePurchase_courseId_fkey') THEN
    ALTER TABLE "CoursePurchase" ADD CONSTRAINT "CoursePurchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "schedule_subjectId_idx" ON "schedule"("subjectId");
CREATE INDEX IF NOT EXISTS "homework_subjectId_idx" ON "homework"("subjectId");
CREATE INDEX IF NOT EXISTS "courses_categoryId_idx" ON "courses"("categoryId");
