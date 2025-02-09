-- CreateEnum
CREATE TYPE "NotificationState" AS ENUM ('CREATED', 'READ', 'PROCESSED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "state" "NotificationState" NOT NULL DEFAULT 'CREATED';
