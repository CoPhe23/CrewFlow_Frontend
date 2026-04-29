const API_URL = "http://localhost:3001";

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export async function apiRequest(path, method = "GET", data = null) {
  const token = getStoredToken();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let res;

  try {
    res = await fetch(`${API_URL}${path}`, options);
  } catch {
    throw new Error("Nem sikerült kapcsolódni a szerverhez.");
  }

  let result = null;

  try {
    result = await res.json();
  } catch {
    result = null;
  }

  if (res.status === 401) {
    clearAuthStorage();
    throw new Error("Lejárt a munkamenet. Jelentkezz be újra.");
  }

  if (!res.ok) {
    throw new Error(result?.error || "Hiba történt a kérés közben.");
  }

  return result;
}