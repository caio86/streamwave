import { listaSeries, createSerie } from "./api.js";
import { createMediaList, agruparGenero, showToast } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");
const addSerieBtn = document.querySelector("#addSerieBtn");
const serieModal = document.querySelector("#serieModal");
const serieModalClose = document.querySelector("#serieModalClose");
const serieModalTitle = document.querySelector("#serieModalTitle");
const serieForm = document.querySelector("#serieForm");

async function renderSeries() {
  const series = await listaSeries();

  if (series && series.length > 0) {
    noContent.style.display = "none";
    container.querySelectorAll(".list-horizontal-wrapper").forEach((node) => {
      node.remove();
    });

    const seriesGenero = agruparGenero(series);
    const generosOrdenados = Object.keys(seriesGenero).sort();

    generosOrdenados.forEach((genero) => {
      const lista = createMediaList(genero, seriesGenero[genero], true);
      container.appendChild(lista);
    });
  } else {
    noContent.querySelector("h2").textContent = "Sem Conteúdo";
    noContent.querySelector("p").textContent =
      "Não encontramos séries no momento.";
  }
}

function openModal() {
  serieModalTitle.textContent = "Adicionar série";
  serieForm.reset();
  serieModal.classList.add("is-open");
  serieModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  serieModal.classList.remove("is-open");
  serieModal.setAttribute("aria-hidden", "true");
}

function parseGenero(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

serieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(serieForm);

  const payload = {
    titulo: formData.get("titulo"),
    banner: formData.get("banner") || undefined,
    poster: formData.get("poster") || undefined,
    genero: parseGenero(formData.get("genero") || ""),
    sinopse: formData.get("sinopse") || undefined,
    data_lancamento: formData.get("data_lancamento") || undefined,
    classificacao: formData.get("classificacao") || undefined,
    destaque: formData.get("destaque") === "on",
    tipo: "SERIE",
  };

  try {
    await createSerie(payload);
    closeModal();
    await renderSeries();
    showToast("Série adicionada com sucesso.", "success");
  } catch (error) {
    console.error("Erro ao criar série:", error);
    showToast("Não foi possível adicionar a série.", "error");
  }
});

addSerieBtn.addEventListener("click", openModal);
serieModalClose.addEventListener("click", closeModal);
serieModal.addEventListener("click", (event) => {
  if (event.target === serieModal) {
    closeModal();
  }
});

await renderSeries();
