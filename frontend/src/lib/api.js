 import axios from "axios";
import toast from "react-hot-toast";

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Dispatch a custom event so the global modal can react
      window.dispatchEvent(
        new CustomEvent("session:expired", {
          detail: { isAdmin: window.location.pathname.startsWith("/admin") },
        })
      );
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
  getAll: () => api.get("/server-types"),
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

export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getById: (id) => api.get(`/orders/${id}`),
  getByCode: (code) => api.get(`/orders/code/${code}`),
  getAll: () => api.get("/orders"),
  getMyOrders: (params) => api.get("/orders/my", { params }),
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
  get: () => api.get("/orders/leaderboard"),
};

export const voucherAPI = {
  validate: (code) => api.post("/vouchers/validate", { code }),
  getAll: () => api.get("/vouchers"),
  create: (data) => api.post("/vouchers", data),
  update: (id, data) => api.put(`/vouchers/${id}`, data),
  delete: (id) => api.delete(`/vouchers/${id}`),
};
