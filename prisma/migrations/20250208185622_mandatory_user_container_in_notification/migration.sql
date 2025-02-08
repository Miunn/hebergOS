/*
  Warnings:

  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `containerId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "containerId" SET NOT NULL;
