export function capitalizeString(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function converterMinutos(minutos) {
  const horas = Math.floor(minutos / 60);
  const minRestantes = minutos % 60;

  const partes = [];

  if (horas > 0) {
    partes.push(`${horas}h`);
  }

  if (minRestantes > 0) {
    partes.push(`${minRestantes}m`);
  }

  return partes.length > 0 ? partes.join(" ") : "0m";
}

export function createMediaCard({
  titulo,
  data_lancamento,
  banner,
  poster,
  id,
  tipo,
  vertical = false,
}) {
  const card = document.createElement("div");
  card.className = `card card--${vertical ? "vertical" : "horizontal"}`;

  card.innerHTML = `
    <a href="./details.html?id=${id}&tipo=${tipo}" class="card__link">
      <div class="card__img-wrapper">
        <img
          src="${vertical ? poster : banner}"
          alt="${titulo}"
          class="card__img"
          loading="lazy"
          onerror="this.src = '/public/fallback-image.png'"
        >
        <div class="card__overlay">P</div>
      </div>
      <p class="card__name">${titulo}</p>
      ${data_lancamento ? `<p class="card__year">${data_lancamento.split("-")[0]}</p>` : ""}
    </a>
  `;

  return card;
}

export function createMediaList(headingName, media, vertical = false) {
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
    fragment.appendChild(createMediaCard({ vertical, ...media }));
  });

  // Assemble final structure
  listHorizontal.appendChild(fragment);
  listWrapper.append(heading, listHorizontal);

  return listWrapper;
}

export function agruparGenero(lista) {
  const grupos = {}; // 1. Objeto para armazenar os grupos

  lista.forEach((item) => {
    // 2. Main loop
    if (!item.genero) return; // 2.1. Se não tiver gênero, pula pq senao dá erro

    const generosItem = item.genero.map((g) => g.trim()); // transforma string em array

    generosItem.forEach((genero) => {
      // 3. Loop nos gêneros do item (filme ou seroe)
      if (!grupos[genero]) {
        // 3.1. Se nao existe a prateleira ela é criada
        grupos[genero] = [];
      }
      grupos[genero].push(item); // 4. Coloca o item na prateleira
    });
  });

  return grupos;
}
