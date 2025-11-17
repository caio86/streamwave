const noContent = document.querySelector("#noContent");
const container = document.querySelector(".container");

function capitalizeString(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function createMovieList(headingName, movies) {
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
  movies.forEach(({ nome, data_lancamento, banner }) => {
    const card = document.createElement("div");
    card.className = "card";

    const cardLink = document.createElement("a");
    cardLink.className = "card-link";

    const cardImgWrapper = document.createElement("div");
    cardImgWrapper.className = "card-img-wrapper";

    const cardImg = document.createElement("img");
    cardImg.className = "card-img";
    cardImg.src = banner;
    cardImg.alt = "banner filme";

    const cardOverlay = document.createElement("div");
    cardOverlay.className = "card-overlay";
    cardOverlay.textContent = "P";

    const cardNameElement = document.createElement("p");
    cardNameElement.className = "card-name";
    cardNameElement.textContent = nome;

    const cardYearElement = document.createElement("p");
    cardYearElement.className = "card-year";
    cardYearElement.textContent = data_lancamento.split("-")[0];

    // Assemble card
    cardImgWrapper.appendChild(cardImg);
    cardImgWrapper.appendChild(cardOverlay);

    cardLink.appendChild(cardImgWrapper);
    cardLink.appendChild(cardNameElement);
    cardLink.appendChild(cardYearElement);

    card.appendChild(cardLink);
    listHorizontal.appendChild(card);
  });

  // Assemble final structure
  listWrapper.appendChild(heading);
  listWrapper.appendChild(listHorizontal);

  return listWrapper;
}

const conteudo = {
  series: [
    {
      id: "s1",
      nome: "Breaking Bad",
      banner: "https://picsum.photos/300/169?random=1",
      genero: "Crime, Drama, Thriller",
      programacao: "Segunda a Sexta, 21h",
      sinopse:
        "Um professor de química se envolve no mundo do crime ao tentar garantir o futuro financeiro de sua família após ser diagnosticado com câncer terminal.",
      data_lancamento: "2008-01-20",
      classificacao: "18 anos",
      episodios: [
        {
          titulo: "Piloto",
          numero_temporada: 1,
          numero_episodio: 1,
          duracao: 58,
        },
        {
          titulo: "Cat's in the Bag",
          numero_temporada: 1,
          numero_episodio: 2,
          duracao: 48,
        },
      ],
      destaque: true,
      tipo: "serie",
    },
    {
      id: "s2",
      nome: "Friends",
      banner: "https://picsum.photos/300/169?random=2",
      genero: "Comédia, Romance",
      programacao: "Segunda a Sexta, 19h",
      sinopse:
        "Seis amigos que moram em Nova York enfrentam as situações da vida com humor e apoio uns dos outros.",
      data_lancamento: "1994-09-22",
      classificacao: "10 anos",
      episodios: [
        {
          titulo: "The One Where Monica Gets a Roommate",
          numero_temporada: 1,
          numero_episodio: 1,
          duracao: 22,
        },
        {
          titulo: "The One with the Sonogram at the End",
          numero_temporada: 1,
          numero_episodio: 2,
          duracao: 22,
        },
      ],
      destaque: false,
      tipo: "serie",
    },
    {
      id: "s3",
      nome: "Stranger Things",
      banner: "https://picsum.photos/300/169?random=3",
      genero: "Drama, Horror, Mistério",
      programacao: "Todos os episódios disponíveis",
      sinopse:
        "Quando uma criança desaparece, um grupo de amigos começa uma investigação sobre o caso e acaba desvendando uma série de mistérios sobrenaturais.",
      data_lancamento: "2016-07-15",
      classificacao: "16 anos",
      episodios: [
        {
          titulo: "Chapter One: The Vanishing of Will Byers",
          numero_temporada: 1,
          numero_episodio: 1,
          duracao: 47,
        },
        {
          titulo: "Chapter Two: The Weirdo on Maple Street",
          numero_temporada: 1,
          numero_episodio: 2,
          duracao: 48,
        },
      ],
      destaque: true,
      tipo: "serie",
    },
    {
      id: "s4",
      nome: "The Crown",
      banner: "https://picsum.photos/300/169?random=4",
      genero: "Biografia, Drama, História",
      programacao: "Todos os episódios disponíveis",
      sinopse:
        "A série conta a história da vida da rainha Elizabeth II e dos eventos históricos durante seu reinado.",
      data_lancamento: "2016-11-04",
      classificacao: "12 anos",
      episodios: [
        {
          titulo: "Wolferton Splash",
          numero_temporada: 1,
          numero_episodio: 1,
          duracao: 60,
        },
        {
          titulo: "The Queen's Speech",
          numero_temporada: 1,
          numero_episodio: 2,
          duracao: 60,
        },
      ],
      destaque: false,
      tipo: "serie",
    },
    {
      id: "s5",
      nome: "Black Mirror",
      banner: "https://picsum.photos/300/169?random=5",
      genero: "Sci-Fi, Drama, Thriller",
      programacao: "Todos os episódios disponíveis",
      sinopse:
        "Cada episódio da série apresenta uma história autônoma que explora os impactos da tecnologia na sociedade.",
      data_lancamento: "2011-12-04",
      classificacao: "16 anos",
      episodios: [
        {
          titulo: "The National Anthem",
          numero_temporada: 1,
          numero_episodio: 1,
          duracao: 60,
        },
        {
          titulo: "Fifteen Million Merits",
          numero_temporada: 1,
          numero_episodio: 2,
          duracao: 60,
        },
      ],
      destaque: true,
      tipo: "serie",
    },
  ],
  filmes: [
    {
      id: "f1",
      nome: "O Poderoso Chefão",
      banner: "https://picsum.photos/300/169?random=6",
      genero: "Crime, Drama",
      duracao_total: 175,
      sinopse:
        "Uma família mafiosa luta para estabelecer sua supremacia nos Estados Unidos depois da Segunda Guerra Mundial.",
      data_lancamento: "1972-03-24",
      classificacao: "18 anos",
      destaque: true,
      tipo: "filme",
      diretor: "Francis Ford Coppola",
      elenco: ["Marlon Brando", "Al Pacino", "James Caan"],
    },
    {
      id: "f2",
      nome: "Interestelar",
      banner: "https://picsum.photos/300/169?random=7",
      genero: "Ficção Científica, Drama, Aventura",
      duracao_total: 169,
      sinopse:
        "Um grupo de astronautas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
      data_lancamento: "2014-11-07",
      classificacao: "10 anos",
      destaque: true,
      tipo: "filme",
      diretor: "Christopher Nolan",
      elenco: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    },
    {
      id: "f3",
      nome: "Parasita",
      banner: "https://picsum.photos/300/169?random=8",
      genero: "Comédia, Drama, Thriller",
      duracao_total: 132,
      sinopse:
        "Uma família pobre coreana se infiltra na casa de uma família rica, criando uma relação de dependência que leva a consequências inesperadas.",
      data_lancamento: "2019-05-30",
      classificacao: "16 anos",
      destaque: false,
      tipo: "filme",
      diretor: "Bong Joon-ho",
      elenco: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    },
    {
      id: "f4",
      nome: "Cidade de Deus",
      banner: "https://picsum.photos/300/169?random=9",
      genero: "Crime, Drama",
      duracao_total: 130,
      sinopse:
        "Dois jovens seguem caminhos diferentes na violenta favela Cidade de Deus no Rio de Janeiro.",
      data_lancamento: "2002-08-30",
      classificacao: "18 anos",
      destaque: true,
      tipo: "filme",
      diretor: "Fernando Meirelles",
      elenco: ["Alexandre Rodrigues", "Leandro Firmino", "Phellipe Haagensen"],
    },
    {
      id: "f5",
      nome: "Toy Story",
      banner: "https://picsum.photos/300/169?random=10",
      genero: "Animação, Aventura, Comédia",
      duracao_total: 81,
      sinopse:
        "Os brinquedos de um menino ganham vida quando ele não está por perto, criando aventuras e amizades inesquecíveis.",
      data_lancamento: "1995-11-22",
      classificacao: "Livre",
      destaque: false,
      tipo: "filme",
      diretor: "John Lasseter",
      elenco: ["Tom Hanks", "Tim Allen", "Don Rickles"],
    },
  ],
};

conteudo.filmes.length;

Object.keys(conteudo).forEach((key) => {
  if (conteudo[key].length <= 0) {
    return;
  }

  noContent.style.display = "none";

  const list = createMovieList(capitalizeString(key), conteudo[key]);
  container.appendChild(list);
});
