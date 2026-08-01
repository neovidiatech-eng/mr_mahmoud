-- ==============================================================================
-- Repair SQL Script for Migration: 20260801105354_fixes
-- Idempotent & Safe to execute from current database state
-- ==============================================================================

-- 1. Safe Drop Indexes
DROP INDEX IF EXISTS "category_name_key";
DROP INDEX IF EXISTS "courses_title_key";
DROP INDEX IF EXISTS "ranks_name_idx";
DROP INDEX IF EXISTS "ranks_name_key";
DROP INDEX IF EXISTS "schedule_status_idx";
DROP INDEX IF EXISTS "subject_name_key";

-- 2. CoursePurchase
ALTER TABLE "CoursePurchase" DROP COLUMN IF EXISTS "createdAt";
ALTER TABLE "CoursePurchase" ADD COLUMN IF NOT EXISTS "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3. TeacherSubject
ALTER TABLE "TeacherSubject" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 4. category
ALTER TABLE "category" DROP COLUMN IF EXISTS "name";
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "color" TEXT NOT NULL DEFAULT '#6366f1';
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "name_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "name_en" TEXT;

-- 5. course_purchase_request
ALTER TABLE "course_purchase_request" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- 6. courses
ALTER TABLE "courses" DROP COLUMN IF EXISTS "description";
ALTER TABLE "courses" DROP COLUMN IF EXISTS "title";
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "description_ar" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "description_en" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "title_en" TEXT;
ALTER TABLE "courses" DROP COLUMN IF EXISTS "price";
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;

-- 7. exam
ALTER TABLE "exam" DROP COLUMN IF EXISTS "title";
ALTER TABLE "exam" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "exam" ADD COLUMN IF NOT EXISTS "title_en" TEXT;

-- 8. exam_answer
ALTER TABLE "exam_answer" ADD COLUMN IF NOT EXISTS "isCorrect" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "exam_answer" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 9. exam_option
ALTER TABLE "exam_option" DROP COLUMN IF EXISTS "createdAt";
ALTER TABLE "exam_option" DROP COLUMN IF EXISTS "text";
ALTER TABLE "exam_option" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "exam_option" ADD COLUMN IF NOT EXISTS "text_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "exam_option" ADD COLUMN IF NOT EXISTS "text_en" TEXT;

-- 10. exam_question
ALTER TABLE "exam_question" DROP COLUMN IF EXISTS "text";
ALTER TABLE "exam_question" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "exam_question" ADD COLUMN IF NOT EXISTS "points" DOUBLE PRECISION NOT NULL DEFAULT 1;
ALTER TABLE "exam_question" ADD COLUMN IF NOT EXISTS "text_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "exam_question" ADD COLUMN IF NOT EXISTS "text_en" TEXT;
ALTER TABLE "exam_question" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'mcq';

-- 11. homework
ALTER TABLE "homework" DROP COLUMN IF EXISTS "description";
ALTER TABLE "homework" DROP COLUMN IF EXISTS "title";
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "description_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "description_en" TEXT;
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "title_en" TEXT;
ALTER TABLE "homework" DROP COLUMN IF EXISTS "grade";
ALTER TABLE "homework" ADD COLUMN IF NOT EXISTS "grade" DOUBLE PRECISION;

-- 12. lectures
ALTER TABLE "lectures" DROP COLUMN IF EXISTS "content";
ALTER TABLE "lectures" DROP COLUMN IF EXISTS "title";
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "content_ar" TEXT;
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "content_en" TEXT;
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "lectures" ADD COLUMN IF NOT EXISTS "title_en" TEXT;

-- 13. policy
ALTER TABLE "policy" DROP COLUMN IF EXISTS "description";
ALTER TABLE "policy" DROP COLUMN IF EXISTS "title";
ALTER TABLE "policy" ADD COLUMN IF NOT EXISTS "description_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "policy" ADD COLUMN IF NOT EXISTS "description_en" TEXT;
ALTER TABLE "policy" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "policy" ADD COLUMN IF NOT EXISTS "title_en" TEXT;

-- 14. policy_notice
ALTER TABLE "policy_notice" DROP COLUMN IF EXISTS "content";
ALTER TABLE "policy_notice" DROP COLUMN IF EXISTS "title";
ALTER TABLE "policy_notice" ADD COLUMN IF NOT EXISTS "content_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "policy_notice" ADD COLUMN IF NOT EXISTS "content_en" TEXT;
ALTER TABLE "policy_notice" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT 'تنبيه هام';
ALTER TABLE "policy_notice" ADD COLUMN IF NOT EXISTS "title_en" TEXT DEFAULT 'Important Notice';

-- 15. ranks
ALTER TABLE "ranks" DROP COLUMN IF EXISTS "name";
ALTER TABLE "ranks" DROP COLUMN IF EXISTS "stageName";
ALTER TABLE "ranks" ADD COLUMN IF NOT EXISTS "name_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "ranks" ADD COLUMN IF NOT EXISTS "name_en" TEXT;
ALTER TABLE "ranks" ADD COLUMN IF NOT EXISTS "stageName_ar" TEXT;
ALTER TABLE "ranks" ADD COLUMN IF NOT EXISTS "stageName_en" TEXT;

-- 16. subject
ALTER TABLE "subject" DROP COLUMN IF EXISTS "name";
ALTER TABLE "subject" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "subject" ADD COLUMN IF NOT EXISTS "color" TEXT NOT NULL DEFAULT '#10b981';
ALTER TABLE "subject" ADD COLUMN IF NOT EXISTS "name_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "subject" ADD COLUMN IF NOT EXISTS "name_en" TEXT;

-- 17. support
ALTER TABLE "support" DROP COLUMN IF EXISTS "description";
ALTER TABLE "support" DROP COLUMN IF EXISTS "title";
ALTER TABLE "support" ADD COLUMN IF NOT EXISTS "description_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "support" ADD COLUMN IF NOT EXISTS "description_en" TEXT;
ALTER TABLE "support" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "support" ADD COLUMN IF NOT EXISTS "title_en" TEXT;

-- 18. support_category
ALTER TABLE "support_category" DROP COLUMN IF EXISTS "title";
ALTER TABLE "support_category" ADD COLUMN IF NOT EXISTS "title_ar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "support_category" ADD COLUMN IF NOT EXISTS "title_en" TEXT;

-- 19. user_lectures
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_lectures' AND column_name='lastPosition') THEN
    ALTER TABLE "user_lectures" ALTER COLUMN "lastPosition" SET NOT NULL;
    ALTER TABLE "user_lectures" ALTER COLUMN "lastPosition" SET DEFAULT 0;
    ALTER TABLE "user_lectures" ALTER COLUMN "lastPosition" SET DATA TYPE DOUBLE PRECISION;
  END IF;
END $$;

-- 20. post table
CREATE TABLE IF NOT EXISTS "post" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "title_en" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt_ar" TEXT,
    "excerpt_en" TEXT,
    "content_ar" TEXT NOT NULL,
    "content_en" TEXT,
    "coverImage" TEXT,
    "authorId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "readingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- 21. Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "post_slug_key" ON "post"("slug");
CREATE INDEX IF NOT EXISTS "post_type_idx" ON "post"("type");
CREATE INDEX IF NOT EXISTS "post_published_idx" ON "post"("published");
CREATE INDEX IF NOT EXISTS "post_slug_idx" ON "post"("slug");

CREATE UNIQUE INDEX IF NOT EXISTS "courses_title_ar_key" ON "courses"("title_ar");
CREATE INDEX IF NOT EXISTS "courses_title_ar_idx" ON "courses"("title_ar");

CREATE UNIQUE INDEX IF NOT EXISTS "ranks_name_ar_key" ON "ranks"("name_ar");
CREATE INDEX IF NOT EXISTS "ranks_name_ar_idx" ON "ranks"("name_ar");

-- 22. Foreign Keys
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'post_authorId_fkey') THEN
    ALTER TABLE "post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 23. Mark Migration 20260801105354_fixes as APPLIED in _prisma_migrations
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260801105354_fixes') THEN
    UPDATE "_prisma_migrations" 
    SET "finished_at" = NOW(), 
        "rolled_back_at" = NULL, 
        "applied_steps_count" = 1, 
        "logs" = NULL 
    WHERE "migration_name" = '20260801105354_fixes';
  ELSE
    INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count")
    VALUES (md5(random()::text), 'fixed_by_repair_script', NOW(), '20260801105354_fixes', NULL, NULL, NOW(), 1);
  END IF;
END $$;
