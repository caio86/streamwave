import { listaFilmes } from "./api.js";
import { createMediaList } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

function agruparGenero(lista) {
  const grupos = {};

  lista.forEach((item) => {
    if (!item.genero) return;

    const generosItem = item.genero.split(",").map((g) => g.trim());

    generosItem.forEach((genero) => {
      if (!grupos[genero]) {
        grupos[genero] = [];
      }
      grupos[genero].push(item);
    });
  });

  return grupos;
}

// 1. Busca os filmes na api
const filmes = await listaFilmes();

// 2. Verifica se tem conteudo para exibir
if (filmes && filmes.length > 0) {
  noContent.style.display = "none";

  // 3. Agrupa os filmes por genero
  const filmesGenero = agruparGenero(filmes);

  // 4. Cria uma lista para cada genero e adiciona no container
  const generosOrdenados = Object.keys(filmesGenero).sort();

  generosOrdenados.forEach((genero) => {
    const lista = createMediaList(
      genero, 
      filmesGenero[genero], 
      false // BOTAR TRUE NO DE SERIES
    );
    container.appendChild(lista);
  });

} else {
  noContent.querySelector("h2").textContent = "Sem Conteúdo";
  noContent.querySelector("p").textContent = "Não encontramos filmes no momento.";
}