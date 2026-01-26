import { listaSeries } from "./api.js";
import { createMediaList, agruparGenero } from "./utils.js";

import prisma from '../src/database/prisma.js';

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

// 1. Busca as séries na api tambem
export async function listarSeries() {
  const series = await prisma.serie.findMany();
  return series;
}

// 2. Verifica se tem conteúdo para exibir tambem
if (series && series.length > 0) {
  noContent.style.display = "none";

  // 3. Agrupa por gênero tambem
  const seriesGenero = agruparGenero(series);

  // 4. Cria lista tudo igual  no de fimle
  const generosOrdenados = Object.keys(seriesGenero).sort();

  generosOrdenados.forEach((genero) => {
    const lista = createMediaList(
      genero, 
      seriesGenero[genero], 
      true
    );
    container.appendChild(lista);
  });

} else {
  noContent.querySelector("h2").textContent = "Sem Conteúdo";
  noContent.querySelector("p").textContent = "Não encontramos séries no momento.";
}