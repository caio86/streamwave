import { listaFilmes, listaSeries } from "./api.js";
import { capitalizeString } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

function createMovieList(headingName, movies) {
  // Create main wrapper
  const listWrapper = document.createElement("div");
  listWrapper.className = "list-horizontal-wrapper";

  // Create heading
  const heading = document.createElement("h2");
  heading.className = "list-name";
  heading.textContent = headingName;

  // Create horizontal list
  const listHorizontal = document.createElement("div");
  listHorizontal.className = "list-horizontal";

  // Create cards for each movie
  movies.forEach(({ nome, data_lancamento, banner }) => {
    const card = document.createElement("div");
    card.className = "card";

    const cardLink = document.createElement("a");
    cardLink.href = "./details.html";
    cardLink.className = "card-link";

    const cardImgWrapper = document.createElement("div");
    cardImgWrapper.className = "card-img-wrapper";

    const cardImg = document.createElement("img");
    cardImg.className = "card-img";
    cardImg.src = banner;
    cardImg.alt = "banner filme";

    const cardOverlay = document.createElement("div");
    cardOverlay.className = "card-overlay";
    cardOverlay.textContent = "P";

    const cardNameElement = document.createElement("p");
    cardNameElement.className = "card-name";
    cardNameElement.textContent = nome;

    const cardYearElement = document.createElement("p");
    cardYearElement.className = "card-year";
    cardYearElement.textContent = data_lancamento.split("-")[0];

    // Assemble card
    cardImgWrapper.appendChild(cardImg);
    cardImgWrapper.appendChild(cardOverlay);

    cardLink.appendChild(cardImgWrapper);
    cardLink.appendChild(cardNameElement);
    cardLink.appendChild(cardYearElement);

    card.appendChild(cardLink);
    listHorizontal.appendChild(card);
  });

  // Assemble final structure
  listWrapper.appendChild(heading);
  listWrapper.appendChild(listHorizontal);

  return listWrapper;
}

const conteudo = {
  series: await listaSeries(),
  filmes: await listaFilmes(),
};

Object.keys(conteudo).forEach((key) => {
  if (conteudo[key].length <= 0) {
    return;
  }

  const list = createMovieList(capitalizeString(key), conteudo[key]);

  container.appendChild(list);

  noContent.style.display = "none";
});
