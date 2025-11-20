/**
 * @param {string} endpoint
 */
async function fetchWithBackup(endpoint) {
  const urls = [
    "http://localhost:3000",
    "https://my-json-server.typicode.com/caio86/streamwave",
  ];

  if (!endpoint?.trim()) {
    throw new Error("Endpoint is not defined");
  }

  endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (endpoint[0] != "/") {
    endpoint = "/" + endpoint;
  }

  let lastError;

  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);

      if (response.ok) {
        return response;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error;
      console.warn(`Failed to fetch from ${baseUrl}:`, error.message);
    }
  }

  throw new Error(`All endpoints failed. Last error: ${lastError?.message}`);
}

export async function fetchData(endpoint) {
  try {
    const res = await fetchWithBackup(endpoint);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
}

export async function listaFilmes() {
  const data = await fetchData("/filmes");
  return data;
}

export async function listaSeries() {
  const data = await fetchData("/series");
  return data;
}

export async function listaConteudo() {
  const [filmes, series] = await Promise.all([listaFilmes(), listaSeries()]);

  return { filmes, series };
}
