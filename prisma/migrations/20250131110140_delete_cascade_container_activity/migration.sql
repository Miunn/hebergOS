-- DropForeignKey
ALTER TABLE "ContainerActivity" DROP CONSTRAINT "ContainerActivity_containerId_fkey";

-- AddForeignKey
ALTER TABLE "ContainerActivity" ADD CONSTRAINT "ContainerActivity_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE CASCADE ON UPDATE CASCADE;
