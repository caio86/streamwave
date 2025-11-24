import { getFilmeByID, getSerieByID } from "./api.js";
import { converterMinutos } from "./utils.js";

const queryParams = new URLSearchParams(window.location.search);
const main = document.querySelector("#main");

const id = queryParams.get("id");

let mediaData;

if (id.startsWith("f")) {
  mediaData = await getFilmeByID(id);
} else mediaData = await getSerieByID(id);

// Backdrop Start

let backdropDiv = document.createElement("div");
backdropDiv.className = "backdrop";

let backdropImg = document.createElement("img");
backdropImg.className = "backdrop__img";
backdropImg.src = mediaData.banner;
backdropImg.alt = "Banner";

backdropDiv.appendChild(backdropImg);
main.appendChild(backdropDiv);

// Backdrop End

// Details

let details = document.createElement("div");
details.className = "details";

details.innerHTML = `
  <div class="details__poster">
    <img
      class="details__poster__img"
      src="${mediaData.poster}"
      alt="Poster"
    />
  </div>
  <div class="details__primary">
    <div class="details__primary__name"><h1>${mediaData.nome}</h1></div>
    <div class="details__primary__info">
      ${mediaData.data_lancamento !== "" ? `<div>${mediaData.data_lancamento.split("-")[0]}</div>` : ""}
      ${mediaData.tipo === "filme" ? `<div>${converterMinutos(mediaData.duracao_total)}</div>` : ""}
      <div class="infoRating">${mediaData.classificacao}</div>
      ${mediaData.avaliacao ? `<div class="starRating">⭐${mediaData.avaliacao}</div>` : ""}
    </div>
  </div>
  <div class="details__secondary">
    <div class="details__secondary__sinopse">${mediaData.sinopse}</div>
  </div>
`;

main.appendChild(details);
