import api from "./api";

// REGISTER
export async function register(data) {
  const res = await api.post("/auth/register", data);
  return res.data;
}

// LOGIN
export async function login(data) {
  const res = await api.post("/auth/login", data);

  // IMPORTANT: ruaje në sessionStorage (jo localStorage)
  sessionStorage.setItem("token", res.data.accessToken || res.data.token);
  sessionStorage.setItem("refreshToken", res.data.refreshToken);
  sessionStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
}

// REFRESH (opsional, axios interceptor e bën këtë automatikisht)
export async function refreshToken(refreshToken) {
  const res = await api.post("/auth/refresh", { refreshToken });
  return res.data;
}