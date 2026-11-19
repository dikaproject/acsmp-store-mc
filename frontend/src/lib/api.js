 import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A 401 on a login request means bad credentials, not an expired session
const isLoginRequest = (url = "") => url.includes("/auth/login");

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoginRequest(error.config?.url)) {
      localStorage.removeItem("token");
      const { pathname, search } = window.location;
      const isAdmin = pathname.startsWith("/admin");

      if (isAdmin) {
        // Admin: clear the store and let the global modal (App.jsx) react
        useAuthStore.getState().logout();
        window.dispatchEvent(
          new CustomEvent("session:expired", {
            detail: { isAdmin },
          })
        );
      } else {
        // Player: clear the store and send them to /login, then back to this page
        useAuthStore.getState().logoutUser();
        if (pathname !== "/login") {
          const redirect = encodeURIComponent(pathname + search);
          window.location.assign(`/login?expired=1&redirect=${redirect}`);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
};

export const serverTypeAPI = {
  getAll: (params) => api.get("/server-types", { params }),
  getById: (id) => api.get(`/server-types/${id}`),
  create: (formData) => api.post("/server-types", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/server-types/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/server-types/${id}`),
};

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
};

export const digitalProductAPI = {
  getAll: (config) => api.get("/digital-products", config),
  getById: (id) => api.get(`/digital-products/${id}`),
  create: (formData) => api.post("/digital-products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  update: (id, formData) => api.put(`/digital-products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  delete: (id) => api.delete(`/digital-products/${id}`),
};

export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getById: (id) => api.get(`/orders/${id}`),
  getByCode: (code) => api.get(`/orders/code/${code}`),
  getAll: () => api.get("/orders"),
  getMyOrders: (params) => api.get("/orders/my", { params }),
  getPaymentChannels: () => api.get("/orders/payment-channels"),
};

// Update galleryAPI
export const galleryAPI = {
  getAll: (params) => api.get("/gallery", { params }),
  getById: (id) => api.get(`/gallery/${id}`),
  create: (formData) => api.post("/gallery", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Update guideAPI
export const guideAPI = {
  getAll: () => api.get("/guides"),
  getById: (id) => api.get(`/guides/${id}`),
  getBySlug: (slug) => api.get(`/guides/slug/${slug}`),
  create: (formData) => api.post("/guides", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/guides/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/guides/${id}`),
};

// Update settingAPI
export const settingAPI = {
  getAll: () => api.get("/settings"),
  getByKey: (key) => api.get(`/settings/${key}`),
  upsert: (data) => api.post("/settings", data),
  bulkUpsert: (data) => api.post("/settings/bulk", data),
  delete: (key) => api.delete(`/settings/${key}`),
};

// Add userAPI
export const userAPI = {
  getAll: () => api.get("/users/get"),
  getById: (id) => api.get(`/users/get/${id}`),
  create: (data) => api.post("/users/create", data),
  update: (id, data) => api.put(`/users/update/${id}`, data),
  delete: (id) => api.delete(`/users/delete/${id}`),
};

// Linktree API
export const linktreeAPI = {
  getAll: () => api.get("/linktree"),
  getAllAdmin: () => api.get("/linktree/admin"),
  getById: (id) => api.get(`/linktree/${id}`),
  create: (data) => api.post("/linktree", data),
  update: (id, data) => api.put(`/linktree/${id}`, data),
  delete: (id) => api.delete(`/linktree/${id}`),
  reorder: (data) => api.put("/linktree/reorder", data),
};

// Skin Upload API
export const skinAPI = {
  upload: (formData) =>
    api.post("/skin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000, // MineSkin can be slow
    }),
};

export const leaderboardAPI = {
  // period: "all" | "year" | "month"
  get: (period = "all") => api.get("/orders/leaderboard", { params: { period } }),
};

// Admin: manual donation entries merged into the public leaderboard
export const leaderboardEntryAPI = {
  getAll: (period = "all") => api.get("/leaderboard-entries", { params: { period } }),
  create: (data) => api.post("/leaderboard-entries", data),
  update: (id, data) => api.put(`/leaderboard-entries/${id}`, data),
  delete: (id) => api.delete(`/leaderboard-entries/${id}`),
};

export const voucherAPI = {
  validate: (code) => api.post("/vouchers/validate", { code }),
  getAll: () => api.get("/vouchers"),
  create: (data) => api.post("/vouchers", data),
  update: (id, data) => api.put(`/vouchers/${id}`, data),
  delete: (id) => api.delete(`/vouchers/${id}`),
};
