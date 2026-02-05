import {
  getFilmeByID,
  getSerieByID,
  updateFilme,
  updateSerie,
  deleteFilme,
  deleteSerie,
  listaTemporadas,
  createTemporada,
  updateTemporada,
  deleteTemporada,
  listaEpisodios,
  createEpisodio,
  updateEpisodio,
  deleteEpisodio,
} from "./api.js";
import { converterMinutos, showToast } from "./utils.js";

const queryParams = new URLSearchParams(window.location.search);
const main = document.querySelector("#main");
const editMediaBtn = document.querySelector("#editMediaBtn");
const mediaModal = document.querySelector("#mediaModal");
const mediaModalClose = document.querySelector("#mediaModalClose");
const mediaModalTitle = document.querySelector("#mediaModalTitle");
const mediaForm = document.querySelector("#mediaForm");
const deleteMediaBtn = document.querySelector("#deleteMediaBtn");
const duracaoField = document.querySelector("#duracaoField");
const seasonsSection = document.querySelector("#seasonsSection");
const seasonsList = document.querySelector("#seasonsList");
const addSeasonBtn = document.querySelector("#addSeasonBtn");
const seasonModal = document.querySelector("#seasonModal");
const seasonModalClose = document.querySelector("#seasonModalClose");
const seasonModalTitle = document.querySelector("#seasonModalTitle");
const seasonForm = document.querySelector("#seasonForm");
const deleteSeasonBtn = document.querySelector("#deleteSeasonBtn");
const episodeModal = document.querySelector("#episodeModal");
const episodeModalClose = document.querySelector("#episodeModalClose");
const episodeModalTitle = document.querySelector("#episodeModalTitle");
const episodeForm = document.querySelector("#episodeForm");
const deleteEpisodeBtn = document.querySelector("#deleteEpisodeBtn");

const id = queryParams.get("id");
const tipo = queryParams.get("tipo");

let mediaData;
let currentSeasonId = null;
let currentEpisodeId = null;
let currentEpisodeSeasonId = null;

const isFilme = tipo === "FILME";
const isSerie = tipo === "SERIE";

if (isFilme) {
  mediaData = await getFilmeByID(id);
} else {
  mediaData = await getSerieByID(id);
}

if (!isFilme && !isSerie) {
  editMediaBtn.style.display = "none";
} else {
  editMediaBtn.textContent = isSerie ? "Editar série" : "Editar filme";
  deleteMediaBtn.textContent = isSerie ? "Remover série" : "Remover filme";
  mediaModalTitle.textContent = isSerie ? "Editar série" : "Editar filme";
}

if (isSerie) {
  duracaoField.classList.add("is-hidden");
  const duracaoInput = duracaoField.querySelector("input");
  duracaoInput.required = false;
  duracaoInput.disabled = true;
  seasonsSection.classList.remove("is-hidden");
} else {
  seasonsSection.classList.add("is-hidden");
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
if (isSerie) {
  seasonsSection.classList.add("details__seasons");
  details.appendChild(seasonsSection);
}

function openModal() {
  if (!isFilme && !isSerie) return;

  mediaForm.titulo.value = mediaData.titulo || "";
  mediaForm.banner.value = mediaData.banner || "";
  mediaForm.poster.value = mediaData.poster || "";
  mediaForm.genero.value = (mediaData.genero || []).join(", ");
  if (isFilme) {
    mediaForm.duracao_total.value = mediaData.duracao_total || "";
  }
  mediaForm.sinopse.value = mediaData.sinopse || "";
  mediaForm.data_lancamento.value = mediaData.data_lancamento || "";
  mediaForm.classificacao.value = mediaData.classificacao || "";
  mediaForm.destaque.checked = Boolean(mediaData.destaque);

  mediaModal.classList.add("is-open");
  mediaModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  mediaModal.classList.remove("is-open");
  mediaModal.setAttribute("aria-hidden", "true");
}

function parseGenero(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function refreshDetails() {
  mediaData = isFilme ? await getFilmeByID(id) : await getSerieByID(id);
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

  if (isSerie) {
    await renderSeasons();
  }
}

function openSeasonModal(mode, temporada = null) {
  seasonForm.reset();
  currentSeasonId = temporada?.id ?? null;
  seasonModalTitle.textContent =
    mode === "edit" ? "Editar temporada" : "Adicionar temporada";
  deleteSeasonBtn.classList.toggle("is-hidden", mode !== "edit");

  if (temporada) {
    seasonForm.numero.value = temporada.numero ?? "";
    seasonForm.titulo.value = temporada.titulo ?? "";
    seasonForm.sinopse.value = temporada.sinopse ?? "";
  }

  seasonModal.classList.add("is-open");
  seasonModal.setAttribute("aria-hidden", "false");
}

function closeSeasonModal() {
  seasonModal.classList.remove("is-open");
  seasonModal.setAttribute("aria-hidden", "true");
  currentSeasonId = null;
}

function openEpisodeModal(mode, temporadaId, episodio = null) {
  episodeForm.reset();
  currentEpisodeId = episodio?.id ?? null;
  currentEpisodeSeasonId = temporadaId;
  episodeModalTitle.textContent =
    mode === "edit" ? "Editar episódio" : "Adicionar episódio";
  deleteEpisodeBtn.classList.toggle("is-hidden", mode !== "edit");

  if (episodio) {
    episodeForm.numero.value = episodio.numero ?? "";
    episodeForm.titulo.value = episodio.titulo ?? "";
    episodeForm.duracao.value = episodio.duracao ?? "";
    episodeForm.sinopse.value = episodio.sinopse ?? "";
  }

  episodeModal.classList.add("is-open");
  episodeModal.setAttribute("aria-hidden", "false");
}

function closeEpisodeModal() {
  episodeModal.classList.remove("is-open");
  episodeModal.setAttribute("aria-hidden", "true");
  currentEpisodeId = null;
  currentEpisodeSeasonId = null;
}

async function renderSeasons() {
  const temporadas = await listaTemporadas(id);
  const temporadasComEps = await Promise.all(
    temporadas.map(async (temporada) => {
      const episodios = await listaEpisodios(temporada.id);
      return { ...temporada, episodios };
    })
  );

  seasonsList.innerHTML = "";

  if (!temporadasComEps.length) {
    const empty = document.createElement("p");
    empty.textContent = "Nenhuma temporada cadastrada.";
    seasonsList.appendChild(empty);
    return;
  }

  temporadasComEps.forEach((temporada) => {
    const card = document.createElement("div");
    card.className = "season-card";
    card.classList.add("is-collapsed");
    card.innerHTML = `
      <div class="season-card__header">
        <div class="season-card__title">
          Temporada ${temporada.numero}${temporada.titulo ? ` — ${temporada.titulo}` : ""}
        </div>
        <div class="season-card__actions">
          <button class="btn btn-login" data-action="toggle-season" data-season-id="${temporada.id}">
            Mostrar episódios
          </button>
          <button class="btn btn-login" data-action="edit-season" data-season-id="${temporada.id}" data-season-numero="${temporada.numero}" data-season-titulo="${temporada.titulo ?? ""}" data-season-sinopse="${temporada.sinopse ?? ""}">
            Editar
          </button>
          <button class="btn btn-login" data-action="delete-season" data-season-id="${temporada.id}">
            Remover
          </button>
          <button class="btn action-btn" data-action="add-episode" data-season-id="${temporada.id}">
            Adicionar episódio
          </button>
        </div>
      </div>
      ${temporada.sinopse ? `<p>${temporada.sinopse}</p>` : ""}
      <div class="episode-list">
        ${
          temporada.episodios.length
            ? temporada.episodios
                .map(
                  (ep) => `
                    <div class="episode-item">
                      <div class="episode-item__meta">
                        <strong>Ep ${ep.numero} — ${ep.titulo}</strong>
                        <span>${ep.duracao ? `${ep.duracao} min` : ""}</span>
                        ${ep.sinopse ? `<small>${ep.sinopse}</small>` : ""}
                      </div>
                      <div class="episode-item__actions">
                        <button class="btn btn-login" data-action="edit-episode" data-season-id="${temporada.id}" data-episode-id="${ep.id}" data-episode-numero="${ep.numero}" data-episode-titulo="${ep.titulo ?? ""}" data-episode-duracao="${ep.duracao ?? ""}" data-episode-sinopse="${ep.sinopse ?? ""}">
                          Editar
                        </button>
                        <button class="btn btn-login" data-action="delete-episode" data-season-id="${temporada.id}" data-episode-id="${ep.id}">
                          Remover
                        </button>
                      </div>
                    </div>
                  `
                )
                .join("")
            : `<div class="episode-empty">Nenhum episódio cadastrado.</div>`
        }
      </div>
    `;
    seasonsList.appendChild(card);
  });
}

mediaForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(mediaForm);

  const payload = {
    titulo: formData.get("titulo"),
    banner: formData.get("banner") || undefined,
    poster: formData.get("poster") || undefined,
    genero: parseGenero(formData.get("genero") || ""),
    sinopse: formData.get("sinopse") || undefined,
    data_lancamento: formData.get("data_lancamento") || undefined,
    classificacao: formData.get("classificacao") || undefined,
    destaque: formData.get("destaque") === "on",
    tipo: isFilme ? "FILME" : "SERIE",
  };

  if (isFilme) {
    payload.duracao_total = Number(formData.get("duracao_total"));
  }

  try {
    if (isFilme) {
      await updateFilme(id, payload);
    } else {
      await updateSerie(id, payload);
    }
    closeModal();
    await refreshDetails();
    showToast("Conteúdo atualizado com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error);
    showToast("Não foi possível atualizar o conteúdo.", "error");
  }
});

deleteMediaBtn.addEventListener("click", async () => {
  const mensagem = isSerie
    ? "Tem certeza que deseja remover esta série?"
    : "Tem certeza que deseja remover este filme?";
  const confirmed = confirm(mensagem);
  if (!confirmed) return;

  try {
    if (isFilme) {
      await deleteFilme(id);
      window.location.href = "./filmes.html";
    } else {
      await deleteSerie(id);
      window.location.href = "./series.html";
    }
  } catch (error) {
    console.error("Erro ao remover conteúdo:", error);
    showToast("Não foi possível remover o conteúdo.", "error");
  }
});

editMediaBtn.addEventListener("click", openModal);
mediaModalClose.addEventListener("click", closeModal);
mediaModal.addEventListener("click", (event) => {
  if (event.target === mediaModal) {
    closeModal();
  }
});

addSeasonBtn?.addEventListener("click", () => openSeasonModal("add"));
seasonModalClose?.addEventListener("click", closeSeasonModal);
seasonModal.addEventListener("click", (event) => {
  if (event.target === seasonModal) {
    closeSeasonModal();
  }
});

episodeModalClose?.addEventListener("click", closeEpisodeModal);
episodeModal.addEventListener("click", (event) => {
  if (event.target === episodeModal) {
    closeEpisodeModal();
  }
});

seasonForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(seasonForm);
  const payload = {
    numero: Number(formData.get("numero")),
    titulo: formData.get("titulo") || undefined,
    sinopse: formData.get("sinopse") || undefined,
  };

  try {
    if (currentSeasonId) {
      await updateTemporada(id, currentSeasonId, payload);
    } else {
      await createTemporada(id, payload);
    }
    closeSeasonModal();
    await renderSeasons();
    showToast("Temporada salva com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao salvar temporada:", error);
    showToast("Não foi possível salvar a temporada.", "error");
  }
});

deleteSeasonBtn.addEventListener("click", async () => {
  if (!currentSeasonId) return;
  const confirmed = confirm("Tem certeza que deseja remover esta temporada?");
  if (!confirmed) return;

  try {
    await deleteTemporada(id, currentSeasonId);
    closeSeasonModal();
    await renderSeasons();
    showToast("Temporada removida com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao remover temporada:", error);
    showToast("Não foi possível remover a temporada.", "error");
  }
});

episodeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(episodeForm);
  const payload = {
    numero: Number(formData.get("numero")),
    titulo: formData.get("titulo"),
    duracao: Number(formData.get("duracao")),
    sinopse: formData.get("sinopse") || undefined,
  };

  try {
    if (currentEpisodeId) {
      await updateEpisodio(currentEpisodeSeasonId, currentEpisodeId, payload);
    } else {
      await createEpisodio(currentEpisodeSeasonId, payload);
    }
    closeEpisodeModal();
    await renderSeasons();
    showToast("Episódio salvo com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao salvar episódio:", error);
    showToast("Não foi possível salvar o episódio.", "error");
  }
});

deleteEpisodeBtn.addEventListener("click", async () => {
  if (!currentEpisodeId || !currentEpisodeSeasonId) return;
  const confirmed = confirm("Tem certeza que deseja remover este episódio?");
  if (!confirmed) return;

  try {
    await deleteEpisodio(currentEpisodeSeasonId, currentEpisodeId);
    closeEpisodeModal();
    await renderSeasons();
    showToast("Episódio removido com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao remover episódio:", error);
    showToast("Não foi possível remover o episódio.", "error");
  }
});

seasonsList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const seasonId = button.dataset.seasonId;
  const episodeId = button.dataset.episodeId;

  if (action === "add-episode") {
    openEpisodeModal("add", seasonId);
    return;
  }

  if (action === "edit-season") {
    const temporada = {
      id: seasonId,
      numero: Number(button.dataset.seasonNumero),
      titulo: button.dataset.seasonTitulo || "",
      sinopse: button.dataset.seasonSinopse || "",
    };
    openSeasonModal("edit", temporada);
    return;
  }

  if (action === "toggle-season") {
    const card = button.closest(".season-card");
    const allCards = seasonsList.querySelectorAll(".season-card");
    allCards.forEach((item) => {
      if (item !== card) {
        item.classList.add("is-collapsed");
        const toggleBtn = item.querySelector('[data-action="toggle-season"]');
        if (toggleBtn) toggleBtn.textContent = "Mostrar episódios";
      }
    });
    const isCollapsed = card.classList.toggle("is-collapsed");
    button.textContent = isCollapsed ? "Mostrar episódios" : "Ocultar episódios";
    return;
  }

  if (action === "delete-season") {
    currentSeasonId = seasonId;
    deleteSeasonBtn.click();
    return;
  }

  if (action === "edit-episode") {
    openEpisodeModal("edit", seasonId, {
      id: episodeId,
      numero: Number(button.dataset.episodeNumero),
      titulo: button.dataset.episodeTitulo || "",
      duracao: Number(button.dataset.episodeDuracao || ""),
      sinopse: button.dataset.episodeSinopse || "",
    });
    return;
  }

  if (action === "delete-episode") {
    currentEpisodeSeasonId = seasonId;
    currentEpisodeId = episodeId;
    deleteEpisodeBtn.click();
  }
});

if (isSerie) {
  await renderSeasons();
}
