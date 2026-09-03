/*
  Replace homework.teacherId (teacher.id)
  with homework.userId (user.id)
*/

-- Drop old foreign key
ALTER TABLE "homework"
DROP CONSTRAINT "homework_teacherId_fkey";

-- Drop old index
DROP INDEX "homework_teacherId_idx";

-- Add userId as nullable first
ALTER TABLE "homework"
ADD COLUMN "userId" TEXT;

-- Migrate existing data:
-- homework.teacherId -> teacher.id -> teacher.user_id -> user.id
UPDATE "homework" h
SET "userId" = t."user_id"
FROM "teacher" t
WHERE h."teacherId" = t."id";

-- Verify that every homework got a userId
-- This should result in 0
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "homework"
        WHERE "userId" IS NULL
    ) THEN
        RAISE EXCEPTION 'Some homework records could not be mapped to a teacher user';
    END IF;
END $$;

-- Now make userId required
ALTER TABLE "homework"
ALTER COLUMN "userId" SET NOT NULL;

-- Remove old teacherId
ALTER TABLE "homework"
DROP COLUMN "teacherId";

-- Create new index
CREATE INDEX "homework_userId_idx"
ON "homework"("userId");

-- Add new foreign key
ALTER TABLE "homework"
ADD CONSTRAINT "homework_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "user"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;