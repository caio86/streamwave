import { listaFilmes } from "./api.js";
import { createMediaList } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

function agruparGenero(lista) {
  const grupos = {};

  lista.forEach((item) => {
    if (!item.genero) return;

    const generosDoItem = item.genero.split(",").map((g) => g.trim());

    generosDoItem.forEach((genero) => {
      if (!grupos[genero]) {
        grupos[genero] = [];
      }
      grupos[genero].push(item);
    });
  });

  return grupos;
}

// 1. Busca os filmes
const filmes = await listaFilmes();

// 2. Verifica se tem conteúdo
if (filmes && filmes.length > 0) {
  noContent.style.display = "none";

  // 3. Agrupa os filmes por gênero
  const filmesGenero = agruparGenero(filmes);

  // 4. Cria uma lista para cada gênero (ordenados alfabeticamente)
  const generosOrdenados = Object.keys(filmesGenero).sort();

  generosOrdenados.forEach((genero) => {
    const lista = createMediaList(
      genero, 
      filmesGenero[genero], 
      true // false = layout horizontal (banner) para filmes
    );
    container.appendChild(lista);
  });

} else {
  noContent.querySelector("h2").textContent = "Sem Conteúdo";
  noContent.querySelector("p").textContent = "Não encontramos filmes no momento.";
}