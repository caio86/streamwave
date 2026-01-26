/**
 * @param {string} endpoint
 */
async function fetchWithBackup(endpoint) {
  const urls = [
    "http://localhost:3000/api/v1",
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
  try {
    const res = await fetchWithBackup("/filmes");
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch /filmes:`, error);
    return [];
  }
}

export async function listaSeries() {
  try {
    const res = await fetchWithBackup("/series");
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch /series:`, error);
    return [];
  }
}

export async function getFilmeByID(id) {
  if (!id?.trim()) {
    throw new Error("ID is required");
  }

  try {
    const res = await fetchWithBackup(`/filmes/${id}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch /filmes/${id}:`, error);
    return {};
  }
}

export async function getSerieByID(id) {
  if (!id?.trim()) {
    throw new Error("ID is required");
  }

  try {
    const res = await fetchWithBackup(`/series/${id}`);
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch /series/${id}:`, error);
    return {};
  }
}

export async function listaConteudo() {
  const [filmes, series] = await Promise.all([listaFilmes(), listaSeries()]);

  return { filmes, series };
}
