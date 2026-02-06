const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

/**
 * @param {string} endpoint
 */
async function fetchWithBackup(endpoint) {
  const urls = [VITE_API_ENDPOINT];

  if (!endpoint?.trim()) {
    throw new Error("Endpoint is not defined");
  }

  const token = localStorage.getItem("streamwave_token");

  endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (endpoint[0] != "/") {
    endpoint = "/" + endpoint;
  }

  let lastError;

  for (const baseUrl of urls) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

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

async function fetchWrite(endpoint, options = {}) {
  const baseUrl = VITE_API_ENDPOINT;

  if (!endpoint?.trim()) {
    throw new Error("Endpoint is not defined");
  }

  endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const token = localStorage.getItem("streamwave_token");
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorData;
    let errorText = "";
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } else {
        errorText = await response.text();
      }
    } catch {
      errorText = await response.text();
    }

    const error = new Error(
      `HTTP ${response.status}: ${response.statusText} ${errorText}`.trim()
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response;
}

function toIdString(id) {
  if (id === null || id === undefined) return "";
  return String(id).trim();
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

export async function createFilme(payload) {
  const res = await fetchWrite("/filmes", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateFilme(id, payload) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/filmes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deleteFilme(id) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  await fetchWrite(`/filmes/${id}`, {
    method: "DELETE",
  });
}

export async function createSerie(payload) {
  const res = await fetchWrite("/series", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateSerie(id, payload) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/series/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deleteSerie(id) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  await fetchWrite(`/series/${id}`, {
    method: "DELETE",
  });
}

export async function listaTemporadas(serieId) {
  if (!toIdString(serieId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWithBackup(`/series/${serieId}/temporadas`);
  return await res.json();
}

export async function createTemporada(serieId, payload) {
  if (!toIdString(serieId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/series/${serieId}/temporadas`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateTemporada(serieId, temporadaId, payload) {
  if (!toIdString(serieId) || !toIdString(temporadaId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/series/${serieId}/temporadas/${temporadaId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function deleteTemporada(serieId, temporadaId) {
  if (!toIdString(serieId) || !toIdString(temporadaId)) {
    throw new Error("ID is required");
  }

  await fetchWrite(`/series/${serieId}/temporadas/${temporadaId}`, {
    method: "DELETE",
  });
}

export async function listaEpisodios(temporadaId) {
  if (!toIdString(temporadaId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWithBackup(`/temporadas/${temporadaId}/episodios`);
  return await res.json();
}

export async function createEpisodio(temporadaId, payload) {
  if (!toIdString(temporadaId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/temporadas/${temporadaId}/episodios`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateEpisodio(temporadaId, episodioId, payload) {
  if (!toIdString(temporadaId) || !toIdString(episodioId)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(
    `/temporadas/${temporadaId}/episodios/${episodioId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );

  return await res.json();
}

export async function deleteEpisodio(temporadaId, episodioId) {
  if (!toIdString(temporadaId) || !toIdString(episodioId)) {
    throw new Error("ID is required");
  }

  await fetchWrite(`/temporadas/${temporadaId}/episodios/${episodioId}`, {
    method: "DELETE",
  });
}

export async function loginUsuario(email, senha) {
  const res = await fetchWrite("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  return await res.json();
}

export async function registerUsuario(payload) {
  const res = await fetchWrite("/usuarios/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function updateUsuario(id, payload) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function getUsuario(id) {
  if (!toIdString(id)) {
    throw new Error("ID is required");
  }

  const res = await fetchWrite(`/usuarios/${id}`, {
    method: "GET",
  });

  return await res.json();
}

export async function getUsuarioByUsername(username) {
  if (!toIdString(username)) {
    throw new Error("Username is required");
  }

  const res = await fetchWrite(`/usuarios/${username}`, {
    method: "GET",
  });

  return await res.json();
}
