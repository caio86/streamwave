/*
  Warnings:

  - You are about to drop the column `username` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "usuarios_username_key";

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "username";

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");
