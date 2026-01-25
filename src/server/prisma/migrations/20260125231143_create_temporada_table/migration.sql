/*
  Warnings:

  - You are about to drop the column `numeroTemporada` on the `episodios` table. All the data in the column will be lost.
  - You are about to drop the column `serieId` on the `episodios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[temporadaId,numeroEpisodio]` on the table `episodios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `temporadaId` to the `episodios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "episodios" DROP CONSTRAINT "episodios_serieId_fkey";

-- DropIndex
DROP INDEX "episodios_serieId_idx";

-- DropIndex
DROP INDEX "episodios_serieId_numeroTemporada_numeroEpisodio_key";

-- AlterTable
ALTER TABLE "episodios" DROP COLUMN "numeroTemporada",
DROP COLUMN "serieId",
ADD COLUMN     "sinopse" TEXT,
ADD COLUMN     "temporadaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "temporadas" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "titulo" TEXT,
    "sinopse" TEXT,
    "serieId" UUID NOT NULL,

    CONSTRAINT "temporadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temporadas_serieId_numero_key" ON "temporadas"("serieId", "numero");

-- CreateIndex
CREATE INDEX "episodios_temporadaId_idx" ON "episodios"("temporadaId");

-- CreateIndex
CREATE UNIQUE INDEX "episodios_temporadaId_numeroEpisodio_key" ON "episodios"("temporadaId", "numeroEpisodio");

-- AddForeignKey
ALTER TABLE "temporadas" ADD CONSTRAINT "temporadas_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "series"("conteudoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodios" ADD CONSTRAINT "episodios_temporadaId_fkey" FOREIGN KEY ("temporadaId") REFERENCES "temporadas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
