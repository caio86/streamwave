import { listaFilmes, createFilme } from "./api.js";
import { createMediaList, agruparGenero } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");
const addMovieBtn = document.querySelector("#addMovieBtn");
const movieModal = document.querySelector("#movieModal");
const movieModalClose = document.querySelector("#movieModalClose");
const movieModalTitle = document.querySelector("#movieModalTitle");
const movieForm = document.querySelector("#movieForm");

async function renderFilmes() {
  const filmes = await listaFilmes();

  if (filmes && filmes.length > 0) {
    noContent.style.display = "none";
    container.querySelectorAll(".list-horizontal-wrapper").forEach((node) => {
      node.remove();
    });

    const filmesGenero = agruparGenero(filmes);
    const generosOrdenados = Object.keys(filmesGenero).sort();

    generosOrdenados.forEach((genero) => {
      const lista = createMediaList(
        genero,
        filmesGenero[genero],
        false,
      );
      container.appendChild(lista);
    });
  } else {
    noContent.querySelector("h2").textContent = "Sem Conteúdo";
    noContent.querySelector("p").textContent =
      "Não encontramos filmes no momento.";
  }
}

function openModal() {
  movieModalTitle.textContent = "Adicionar filme";
  movieForm.reset();
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
    await createFilme(payload);
    closeModal();
    await renderFilmes();
  } catch (error) {
    console.error("Erro ao criar filme:", error);
    alert("Nao foi possivel adicionar o filme.");
  }
});

addMovieBtn.addEventListener("click", openModal);
movieModalClose.addEventListener("click", closeModal);
movieModal.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    closeModal();
  }
});

await renderFilmes();
