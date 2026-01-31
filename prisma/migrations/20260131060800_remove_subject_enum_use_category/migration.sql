/*
  Warnings:

  - You are about to drop the column `subject` on the `TutorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "subject";

-- DropEnum
DROP TYPE "TutorSubjects";
