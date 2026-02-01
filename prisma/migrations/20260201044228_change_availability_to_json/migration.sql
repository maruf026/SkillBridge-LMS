/*
  Warnings:

  - Changed the type of `availability` on the `TutorProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `categoryId` on table `TutorProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TutorProfile" DROP CONSTRAINT "TutorProfile_categoryId_fkey";

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "availability",
ADD COLUMN     "availability" JSONB NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- DropEnum
DROP TYPE "AvailableDay";

-- AddForeignKey
ALTER TABLE "TutorProfile" ADD CONSTRAINT "TutorProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
