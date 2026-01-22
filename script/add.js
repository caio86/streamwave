import { createFilme, createSerie } from "./api.js";

const tipoConteudo = document.querySelector("#tipoConteudo");

const videoFile = document.querySelector("#videoFile");
const videoPreview = document.querySelector("#videoPreview");
const fileNameEl = document.querySelector("#fileName");
const fileDurationEl = document.querySelector("#fileDuration");
const statusBox = document.querySelector("#statusBox");

const form = document.querySelector("#addForm");

const formFilme = document.querySelector("#formFilme");
const formSerie = document.querySelector("#formSerie");

// filme
const filmeNome = document.querySelector("#filmeNome");
const filmeDuracao = document.querySelector("#filmeDuracao");
const filmeData = document.querySelector("#filmeData");
const filmeClassificacao = document.querySelector("#filmeClassificacao");
const filmeGenero = document.querySelector("#filmeGenero");
const filmeDiretor = document.querySelector("#filmeDiretor");
const filmeElenco = document.querySelector("#filmeElenco");
const filmeSinopse = document.querySelector("#filmeSinopse");
const filmeBanner = document.querySelector("#filmeBanner");
const filmePoster = document.querySelector("#filmePoster");
const filmeDestaque = document.querySelector("#filmeDestaque");

// série
const serieNome = document.querySelector("#serieNome");
const serieProgramacao = document.querySelector("#serieProgramacao");
const serieData = document.querySelector("#serieData");
const serieClassificacao = document.querySelector("#serieClassificacao");
const serieGenero = document.querySelector("#serieGenero");
const serieSinopse = document.querySelector("#serieSinopse");
const serieBanner = document.querySelector("#serieBanner");
const seriePoster = document.querySelector("#seriePoster");
const serieDestaque = document.querySelector("#serieDestaque");

// episódios
const epTitulo = document.querySelector("#epTitulo");
const epDuracao = document.querySelector("#epDuracao");
const epTemp = document.querySelector("#epTemp");
const epNum = document.querySelector("#epNum");
const btnAddEp = document.querySelector("#btnAddEp");
const epList = document.querySelector("#epList");

let episodios = [];
let currentObjectUrl = null;

function setStatus(type, msg) {
  statusBox.classList.remove("status--ok", "status--err");
  statusBox.textContent = msg || "";
  if (!msg) {
    statusBox.style.display = "none";
    return;
  }
  statusBox.style.display = "block";
  statusBox.classList.add(type === "ok" ? "status--ok" : "status--err");
}

function randomPicsum() {
  const n = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/300/169?random=${n}`;
}

function getSelectedValues(selectEl) {
  return Array.from(selectEl.selectedOptions).map(o => o.value.trim());
}

function joinGenero(values) {
  return values.join(", ");
}

function safeSplitCommaList(str) {
  if (!str) return [];
  return str.split(",").map(x => x.trim()).filter(Boolean);
}

function makeId(prefix) {
  return `${prefix}${Date.now().toString(36)}`;
}

function basenameNoExt(name="") {
  return name.replace(/\.[^/.]+$/, "");
}

function minutesFromSeconds(sec) {
  return Math.max(1, Math.round(sec / 60));
}

function lockInput(input, state) {
  input.readOnly = state;
  input.disabled = state;
}

function clearPreview() {
  if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  videoPreview.removeAttribute("src");
  videoPreview.load();
  fileNameEl.textContent = "—";
  fileDurationEl.textContent = "—";
}

function toggleForm(formEl, enabled) {
  const fields = formEl.querySelectorAll("input, select, textarea");

  fields.forEach(f => {
    if (enabled) {
      f.disabled = false;
      if (f.dataset.required === "true") {
        f.setAttribute("required", "required");
      }
    } else {
      f.disabled = true;
      if (f.hasAttribute("required")) {
        f.dataset.required = "true";
        f.removeAttribute("required");
      }
    }
  });
}

function updateTypeUI() {
  if (tipoConteudo.value === "filme") {
    formFilme.classList.remove("hidden");
    formSerie.classList.add("hidden");

    toggleForm(formFilme, true);
    toggleForm(formSerie, false);
  } else {
    formSerie.classList.remove("hidden");
    formFilme.classList.add("hidden");

    toggleForm(formSerie, true);
    toggleForm(formFilme, false);
  }
}

tipoConteudo.addEventListener("change", updateTypeUI);
updateTypeUI();

videoFile.addEventListener("change", () => {
  clearPreview();
  const file = videoFile.files?.[0];
  if (!file) return;

  fileNameEl.textContent = file.name;
  currentObjectUrl = URL.createObjectURL(file);
  videoPreview.src = currentObjectUrl;

  const base = basenameNoExt(file.name);
  if (!filmeNome.value && tipoConteudo.value === "filme") filmeNome.value = base;
  if (!epTitulo.value && tipoConteudo.value === "serie") epTitulo.value = base;

  videoPreview.onloadedmetadata = () => {
    const mins = minutesFromSeconds(videoPreview.duration);
    fileDurationEl.textContent = `${mins} min`;

    if (tipoConteudo.value === "filme") {
      filmeDuracao.value = mins;
      lockInput(filmeDuracao, true);
    } else {
      epDuracao.value = mins;
      lockInput(epDuracao, true);
    }
  };
});

btnAddEp.addEventListener("click", () => {
  const titulo = epTitulo.value.trim();
  const duracao = Number(epDuracao.value);
  const temporada = Number(epTemp.value);
  const numero = Number(epNum.value);

  if (!titulo || !duracao || !temporada || !numero) {
    setStatus("err", "Preencha todos os campos do episódio.");
    return;
  }

  episodios.push({ titulo, duracao, numero_temporada: temporada, numero_episodio: numero });

  epTitulo.value = "";
  epDuracao.value = "";
  epTemp.value = "";
  epNum.value = "";

  renderEpisodeList();
});

function renderEpisodeList() {
  epList.innerHTML = "";
  episodios.forEach((ep, i) => {
    const li = document.createElement("li");
    li.textContent = `T${ep.numero_temporada}E${ep.numero_episodio} - ${ep.titulo} (${ep.duracao}min)`;
    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.onclick = () => {
      episodios.splice(i,1);
      renderEpisodeList();
    };
    li.appendChild(btn);
    epList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "");

  console.log("SUBMIT DISPAROU ✅"); // <- debug

  // validação manual “amigável”
  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus("err", "Faltou preencher algum campo obrigatório (ou algum campo está inválido).");
    return;
  }


  try {
    if (tipoConteudo.value === "filme") {
      const generos = getSelectedValues(filmeGenero);

      const payload = {
        id: makeId("f"),
        nome: filmeNome.value.trim(),
        banner: filmeBanner.value.trim() || randomPicsum(),
        poster: filmePoster.value.trim() || randomPicsum(),
        genero: joinGenero(generos),
        duracao_total: Number(filmeDuracao.value),
        sinopse: filmeSinopse.value.trim() || "",
        data_lancamento: filmeData.value,
        classificacao: filmeClassificacao.value,
        destaque: filmeDestaque.checked,
        tipo: "filme",
        diretor: filmeDiretor.value.trim() || "",
        elenco: safeSplitCommaList(filmeElenco.value)
      };

      if (!payload.nome || !payload.classificacao || !generos.length)
        throw new Error("Preencha os campos obrigatórios.");

      await createFilme(payload);
      setStatus("ok", "Filme adicionado com sucesso! ✅");
    } else {
      const generos = getSelectedValues(serieGenero);

      const payload = {
        id: makeId("s"),
        nome: serieNome.value.trim(),
        banner: serieBanner.value.trim() || randomPicsum(),
        poster: seriePoster.value.trim() || randomPicsum(),
        genero: joinGenero(generos),
        programacao: serieProgramacao.value || "Todos os episódios disponíveis",
        sinopse: serieSinopse.value.trim() || "",
        data_lancamento: serieData.value,
        classificacao: serieClassificacao.value,
        episodios,
        destaque: serieDestaque.checked,
        tipo: "serie"
      };

      if (!payload.nome || !payload.classificacao || !generos.length)
        throw new Error("Preencha os campos obrigatórios.");

      await createSerie(payload);
      setStatus("ok", "Série adicionada com sucesso! ✅");
    }

    form.reset();
    episodios = [];
    renderEpisodeList();
    clearPreview();
    lockInput(filmeDuracao, false);
    lockInput(epDuracao, false);

  } catch (err) {
    console.error("ERRO AO SALVAR:", err);
    setStatus("err", err.message || "Erro ao salvar.");
}
});

updateTypeUI();
