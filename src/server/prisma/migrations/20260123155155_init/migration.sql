-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoConteudo" AS ENUM ('SERIE', 'FILME');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('ACAO', 'AVENTURA', 'COMEDIA', 'DRAMA', 'FICCAO_CIENTIFICA', 'TERROR', 'ROMANCE', 'ANIMACAO', 'DOCUMENTARIO', 'SUSPENSE', 'FANTASIA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "fotoPerfil" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoLogin" TIMESTAMP(3),
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudos" (
    "id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "banner" TEXT,
    "poster" TEXT,
    "genero" "Genero"[],
    "sinopse" TEXT,
    "dataLancamento" TIMESTAMP(3),
    "classificacao" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "tipo" "TipoConteudo" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conteudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "conteudoId" UUID NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("conteudoId")
);

-- CreateTable
CREATE TABLE "filmes" (
    "conteudoId" UUID NOT NULL,
    "duracaoTotal" INTEGER NOT NULL,

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("conteudoId")
);

-- CreateTable
CREATE TABLE "episodios" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "numeroTemporada" INTEGER NOT NULL,
    "numeroEpisodio" INTEGER NOT NULL,
    "duracao" INTEGER NOT NULL,
    "serieId" UUID NOT NULL,

    CONSTRAINT "episodios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "usuarioId" UUID NOT NULL,
    "conteudoId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("usuarioId","conteudoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "conteudos_titulo_idx" ON "conteudos"("titulo");

-- CreateIndex
CREATE INDEX "episodios_serieId_idx" ON "episodios"("serieId");

-- CreateIndex
CREATE UNIQUE INDEX "episodios_serieId_numeroTemporada_numeroEpisodio_key" ON "episodios"("serieId", "numeroTemporada", "numeroEpisodio");

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filmes" ADD CONSTRAINT "filmes_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodios" ADD CONSTRAINT "episodios_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "series"("conteudoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
