/*
  Warnings:

  - The `genero` column on the `conteudos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "conteudos" DROP COLUMN "genero",
ADD COLUMN     "genero" TEXT[];

-- DropEnum
DROP TYPE "Genero";
