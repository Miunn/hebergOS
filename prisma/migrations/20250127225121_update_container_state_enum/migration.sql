/*
  Warnings:

  - The values [EXITED] on the enum `ContainerState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContainerState_new" AS ENUM ('RUNNING', 'STOPPED', 'RESTARTING', 'CREATED', 'PAUSED');
ALTER TABLE "Container" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Container" ALTER COLUMN "state" TYPE "ContainerState_new" USING ("state"::text::"ContainerState_new");
ALTER TYPE "ContainerState" RENAME TO "ContainerState_old";
ALTER TYPE "ContainerState_new" RENAME TO "ContainerState";
DROP TYPE "ContainerState_old";
ALTER TABLE "Container" ALTER COLUMN "state" SET DEFAULT 'CREATED';
COMMIT;
