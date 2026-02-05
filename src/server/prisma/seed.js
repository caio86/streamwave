import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";

import { prisma } from "./prisma.js";

import usuarioService from "../services/usuario.service.js";
import filmeService from "../services/filme.service.js";
import serieService from "../services/serie.service.js";
import temporadasService from "../services/temporadas.service.js";
import episodiosService from "../services/episodios.service.js";

async function main() {
  console.log("Seeding database...");

  // limpa conteúdos antes do seed
  await prisma.conteudo.deleteMany();
  await prisma.usuario.deleteMany();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const file = path.join(__dirname, "seeders.json");

  const seed = JSON.parse(readFileSync(file, "utf-8"));

  // Usuarios
  if (Array.isArray(seed.usuarios)) {
    for (const usuario of seed.usuarios) {
      console.log(
        `Seeding usuario: ${usuario.nomeCompleto || usuario.username}`
      );
      await usuarioService.create({
        ...usuario,
        // mapeie nomes de campo se necessário pelo service (ex.: dataNascimento)
      });
    }
  }

  // Filmes
  if (Array.isArray(seed.filmes)) {
    for (const filme of seed.filmes) {
      console.log(`Seeding filme: ${filme.titulo}`);
      await filmeService.create(filme);
    }
  }

  // Series (com temporadas e episódios embutidos)
  if (Array.isArray(seed.series)) {
    for (const serie of seed.series) {
      console.log(`Seeding serie: ${serie.titulo}`);
      const { id: idSerie } = await serieService.create(serie);
      console.log(idSerie);
      for (let temporada of serie.temporadas) {
        const { id: idTemporada } = await temporadasService.create(
          idSerie,
          temporada
        );
        for (let episodio of temporada.episodios) {
          await episodiosService.create(idTemporada, episodio);
        }
      }
    }
  }

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
