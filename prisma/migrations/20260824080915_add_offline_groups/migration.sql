-- AlterTable
ALTER TABLE "student" ADD COLUMN     "offlineGroupId" TEXT;

-- CreateTable
CREATE TABLE "offlineGroup" (
    "id" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "qrActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offlineGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offlineGroupCourses" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offlineGroupCourses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "offlineGroup_rankId_key" ON "offlineGroup"("rankId");

-- CreateIndex
CREATE UNIQUE INDEX "offlineGroup_qrToken_key" ON "offlineGroup"("qrToken");

-- CreateIndex
CREATE INDEX "offlineGroupCourses_groupId_idx" ON "offlineGroupCourses"("groupId");

-- CreateIndex
CREATE INDEX "offlineGroupCourses_courseId_idx" ON "offlineGroupCourses"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "offlineGroupCourses_groupId_courseId_key" ON "offlineGroupCourses"("groupId", "courseId");

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_offlineGroupId_fkey" FOREIGN KEY ("offlineGroupId") REFERENCES "offlineGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offlineGroup" ADD CONSTRAINT "offlineGroup_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "ranks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offlineGroupCourses" ADD CONSTRAINT "offlineGroupCourses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "offlineGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offlineGroupCourses" ADD CONSTRAINT "offlineGroupCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
