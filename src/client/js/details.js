import { getFilmeByID, getSerieByID, updateFilme, deleteFilme } from "./api.js";
import { converterMinutos } from "./utils.js";

const queryParams = new URLSearchParams(window.location.search);
const main = document.querySelector("#main");
const editMovieBtn = document.querySelector("#editMovieBtn");
const movieModal = document.querySelector("#movieModal");
const movieModalClose = document.querySelector("#movieModalClose");
const movieModalTitle = document.querySelector("#movieModalTitle");
const movieForm = document.querySelector("#movieForm");
const deleteMovieBtn = document.querySelector("#deleteMovieBtn");

const id = queryParams.get("id");
const tipo = queryParams.get("tipo");

let mediaData;

if (tipo === "FILME") {
  mediaData = await getFilmeByID(id);
} else mediaData = await getSerieByID(id);

if (tipo !== "FILME") {
  editMovieBtn.style.display = "none";
}

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
      onerror="this.src = '/fallback-image.png'"
    />
  </div>
  <div class="details__primary">
    <div class="details__primary__name"><h1>${mediaData.titulo}</h1></div>
    <div class="details__primary__info">
      ${mediaData.data_lancamento ? `<div>${mediaData.data_lancamento.split("-")[0]}</div>` : ""}
      ${mediaData.tipo === "FILME" ? `<div>${converterMinutos(mediaData.duracao_total)}</div>` : ""}
      ${mediaData.classificacao ? `<div class="infoRating">${mediaData.classificacao}</div>` : ""}
      ${mediaData.avaliacao ? `<div class="starRating">⭐${mediaData.avaliacao}</div>` : ""}
    </div>
  </div>
  <div class="details__secondary">
    ${mediaData.sinopse ? `<div class="details__secondary__sinopse">${mediaData.sinopse}</div>` : ""}
  </div>
`;

main.appendChild(details);

function openModal() {
  if (tipo !== "FILME") return;

  movieModalTitle.textContent = "Editar filme";
  movieForm.titulo.value = mediaData.titulo || "";
  movieForm.banner.value = mediaData.banner || "";
  movieForm.poster.value = mediaData.poster || "";
  movieForm.genero.value = (mediaData.genero || []).join(", ");
  movieForm.duracao_total.value = mediaData.duracao_total || "";
  movieForm.sinopse.value = mediaData.sinopse || "";
  movieForm.data_lancamento.value = mediaData.data_lancamento || "";
  movieForm.classificacao.value = mediaData.classificacao || "";
  movieForm.destaque.checked = Boolean(mediaData.destaque);

  movieModal.classList.add("is-open");
  movieModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  movieModal.classList.remove("is-open");
  movieModal.setAttribute("aria-hidden", "true");
}

function parseGenero(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function refreshDetails() {
  mediaData = await getFilmeByID(id);
  const posterImg = document.querySelector(".details__poster__img");
  const titleEl = document.querySelector(".details__primary__name h1");
  const infoEl = document.querySelector(".details__primary__info");
  const sinopseEl = document.querySelector(".details__secondary__sinopse");

  if (posterImg) posterImg.src = mediaData.poster || posterImg.src;
  if (titleEl) titleEl.textContent = mediaData.titulo;

  if (infoEl) {
    infoEl.innerHTML = `
      ${mediaData.data_lancamento ? `<div>${mediaData.data_lancamento.split("-")[0]}</div>` : ""}
      ${mediaData.tipo === "FILME" ? `<div>${converterMinutos(mediaData.duracao_total)}</div>` : ""}
      ${mediaData.classificacao ? `<div class="infoRating">${mediaData.classificacao}</div>` : ""}
      ${mediaData.avaliacao ? `<div class="starRating">⭐${mediaData.avaliacao}</div>` : ""}
    `;
  }

  if (sinopseEl) {
    sinopseEl.textContent = mediaData.sinopse || "";
  }
}

movieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(movieForm);

  const payload = {
    titulo: formData.get("titulo"),
    banner: formData.get("banner") || undefined,
    poster: formData.get("poster") || undefined,
    genero: parseGenero(formData.get("genero") || ""),
    duracao_total: Number(formData.get("duracao_total")),
    sinopse: formData.get("sinopse") || undefined,
    data_lancamento: formData.get("data_lancamento") || undefined,
    classificacao: formData.get("classificacao") || undefined,
    destaque: formData.get("destaque") === "on",
    tipo: "FILME",
  };

  try {
    await updateFilme(id, payload);
    closeModal();
    await refreshDetails();
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    alert("Nao foi possivel atualizar o filme.");
  }
});

deleteMovieBtn.addEventListener("click", async () => {
  const confirmed = confirm("Tem certeza que deseja remover este filme?");
  if (!confirmed) return;

  try {
    await deleteFilme(id);
    window.location.href = "./filmes.html";
  } catch (error) {
    console.error("Erro ao remover filme:", error);
    alert("Nao foi possivel remover o filme.");
  }
});

editMovieBtn.addEventListener("click", openModal);
movieModalClose.addEventListener("click", closeModal);
movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    closeModal();
  }
});
