import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";

import { prisma } from "./prisma.js";

async function main() {
  console.log("Seeding database...");

  await prisma.conteudo.deleteMany();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const file = path.join(__dirname, "seeders.json");

  const seed = JSON.parse(readFileSync(file, "utf-8"));

  for (const filmes of seed.filmes) {
    console.log(`Seeding filme: ${filmes.titulo}`);
    await prisma.filme.create({
      data: {
        duracaoTotal: filmes.duracao_total,
        conteudo: {
          create: {
            titulo: filmes.titulo,
            banner: filmes.banner,
            poster: filmes.poster,
            genero: filmes.genero,
            sinopse: filmes.sinopse,
            dataLancamento: new Date(filmes.data_lancamento),
            classificacao: filmes.classificacao,
            destaque: filmes.destaque || false,
            tipo: filmes.tipo.toUpperCase(),
          },
        },
      },
    });
  }

  // for (const series of seed.series) {
  // }

  console.log("Database seeded successfully.");
}

main()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
