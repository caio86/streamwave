-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoConteudo" AS ENUM ('SERIE', 'FILME');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "fotoPerfil" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoLogin" TIMESTAMP(3),
    "status" "StatusUsuario" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "classificacao" TEXT NOT NULL,
    "destaque" BOOLEAN NOT NULL,
    "tipo" "TipoConteudo" NOT NULL,

    CONSTRAINT "conteudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "conteudoId" TEXT NOT NULL,
    "programacao" TEXT,

    CONSTRAINT "series_pkey" PRIMARY KEY ("conteudoId")
);

-- CreateTable
CREATE TABLE "filmes" (
    "conteudoId" TEXT NOT NULL,
    "duracaoTotal" INTEGER NOT NULL,
    "diretor" TEXT NOT NULL,
    "elenco" TEXT[],

    CONSTRAINT "filmes_pkey" PRIMARY KEY ("conteudoId")
);

-- CreateTable
CREATE TABLE "episodios" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "numeroTemporada" INTEGER NOT NULL,
    "numeroEpisodio" INTEGER NOT NULL,
    "duracao" INTEGER NOT NULL,
    "serieId" TEXT NOT NULL,

    CONSTRAINT "episodios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_usuarioId_conteudoId_key" ON "favoritos"("usuarioId", "conteudoId");

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filmes" ADD CONSTRAINT "filmes_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodios" ADD CONSTRAINT "episodios_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "series"("conteudoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "conteudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
