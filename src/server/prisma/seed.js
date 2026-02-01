import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";

import { prisma } from "./prisma.js";

import usuarioService from "../services/usuario.service.js";
import filmeService from "../services/filme.service.js";
// import serieService from "../services/serie.service.js";

async function main() {
  console.log("Seeding database...");

  await prisma.conteudo.deleteMany();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const file = path.join(__dirname, "seeders.json");

  const seed = JSON.parse(readFileSync(file, "utf-8"));

  for (const usuario of seed.usuarios) {
    console.log(`Seeding usuario: ${usuario.nomeCompleto}`);
    await usuarioService.create(usuario);
  }

  for (const filme of seed.filmes) {
    console.log(`Seeding filme: ${filme.titulo}`);
    await filmeService.create(filme);
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
