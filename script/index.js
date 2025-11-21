import { listaConteudo } from "./api.js";
import { capitalizeString, createMediaList } from "./utils.js";

const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

const conteudo = await listaConteudo();
let hasContent = false;

for (let key in conteudo) {
  if (conteudo[key].length <= 0) {
    continue;
  }

  const list = createMediaList(
    capitalizeString(key),
    conteudo[key],
    key === "series",
  );
  if (list) {
    container.appendChild(list);
    hasContent = true;
  }
}

noContent.style.display = hasContent ? "none" : "flex";
