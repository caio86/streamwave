const BASE_URL = "http://localhost:3000";

export async function listaFilmes(base_url = BASE_URL) {
  const data = await fetch(`${base_url}/filmes`).then((res) => res.json());
  return data;
}

export async function listaSeries(base_url = BASE_URL) {
  const data = await fetch(`${base_url}/series`).then((res) => res.json());
  return data;
}
