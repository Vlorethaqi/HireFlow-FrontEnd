
import axios from "axios";

const API_URL = "https://hireflow-backend-4b0o.onrender.com";

const api = axios.create({
  baseURL: API_URL
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

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

    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest = refreshRequest || axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken }
      );

      const { data } = await refreshRequest;
      refreshRequest = null;

      if (data.success === false) {
        throw new Error(data.message || "Refresh failed");
      }

      const nextToken = data.accessToken || data.token;
      sessionStorage.setItem("token", nextToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);

      if (data.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));
      }

      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      refreshRequest = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
      window.dispatchEvent(new Event("authChange"));
      return Promise.reject(refreshError);
    }
  }
);

export default api;
