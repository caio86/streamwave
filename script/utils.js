export function capitalizeString(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function createMediaCard({
  nome,
  data_lancamento,
  banner,
  poster,
  id,
  vertical = false,
}) {
  const card = document.createElement("div");
  card.className = `card card--${vertical ? "vertical" : "horizontal"}`;

  card.innerHTML = `
    <a href="./details.html?id=${id}" class="card__link">
      <div class="card__img-wrapper">
        <img
          src="${vertical ? poster : banner}"
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
  const grupos = {};

  lista.forEach((item) => {
    if (!item.genero) return;

    const generosItem = item.genero.split(",").map((g) => g.trim());

    generosItem.forEach((genero) => {
      if (!grupos[genero]) {
        grupos[genero] = [];
      }
      grupos[genero].push(item);
    });
  });

  return grupos;
}