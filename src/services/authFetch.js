const API_URL = "http://localhost:3000";

let refreshRequest = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  refreshRequest = refreshRequest || fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  }).then((res) => res.json());

  const data = await refreshRequest;
  refreshRequest = null;

  if (data.success === false) {
    throw new Error(data.message || "Refresh failed");
  }

  const token = data.accessToken || data.token;
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", data.refreshToken);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("authChange"));
  }

  return token;
}

export async function authFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status !== 401 || options.skipRefresh) {
    return response;
  }

  try {
    const nextToken = await refreshAccessToken();
    headers.set("Authorization", `Bearer ${nextToken}`);

    response = await fetch(url, {
      ...options,
      headers
    });

    return response;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    throw error;
  }
}
