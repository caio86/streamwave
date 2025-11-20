import { listaConteudo } from "./api.js";
import { capitalizeString } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

function createMediaCard({ nome, data_lancamento, banner, id }) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <a href="./details.html?id=${id}" class="card__link">
      <div class="card__img-wrapper">
        <img
          src="${banner}"
          alt="${nome}"
          class="card__img"
          loading="lazy"
          onerror="this.src = '/public/fallback-image.png'"
        >
        <div class="card__overlay">P</div>
      </div>
      <p class="card__name">${nome}</p>
      <p class="card__year">${data_lancamento.split("-")[0]}</p>
    </a>
  `;

  return card;
}

function createMediaList(headingName, media) {
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
  const fragment = document.createDocumentFragment();
  media.forEach((media) => {
    fragment.appendChild(createMediaCard(media));
  });

  // Assemble final structure
  listHorizontal.appendChild(fragment);
  listWrapper.append(heading, listHorizontal);

  return listWrapper;
}

const conteudo = await listaConteudo();
let hasContent = false;

for (let key in conteudo) {
  if (conteudo[key].length <= 0) {
    continue;
  }

  const list = createMediaList(capitalizeString(key), conteudo[key]);
  if (list) {
    container.appendChild(list);
    hasContent = true;
  }
}

noContent.style.display = hasContent ? "none" : "flex";
