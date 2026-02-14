import axios from "axios";
import { API_URL_LOCAL } from "../utils/constants";

const axiosInstance = axios.create({
  baseURL: API_URL_LOCAL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

const clearAuth = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && !navigator.onLine) {
      return Promise.reject(new Error("No internet connection"));
    }

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Don't retry refresh token endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      clearAuth();
      return Promise.reject(error);
    }

    // Skip token refresh for login requests
    if (originalRequest.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.get(`${API_URL_LOCAL}/auth/refresh`, {
        withCredentials: true,
      });

      const { accessToken } = response.data;

      if (accessToken) {
        setToken(accessToken);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } else {
        throw new Error("No access token in response");
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
