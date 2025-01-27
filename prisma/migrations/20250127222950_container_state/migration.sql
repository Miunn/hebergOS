-- CreateEnum
CREATE TYPE "ContainerState" AS ENUM ('RUNNING', 'STOPPED', 'EXITED', 'CREATED');

-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "state" "ContainerState" NOT NULL DEFAULT 'CREATED';
