import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest = refreshRequest || axios.post("http://localhost:3000/auth/refresh", {
        refreshToken
      });

      const { data } = await refreshRequest;
      refreshRequest = null;

      if (data.success === false) {
        throw new Error(data.message || "Refresh failed");
      }

      const nextToken = data.accessToken || data.token;
      localStorage.setItem("token", nextToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));
      }

      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshRequest = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChange"));
      return Promise.reject(refreshError);
    }
  }
);

export default api;
