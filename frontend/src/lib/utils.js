import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Build full image URL from a stored path like /uploads/products/xxx.jpg
 * Uses VITE_API_URL directly (e.g. https://domain.com/api) so the result
 * becomes https://domain.com/api/uploads/xxx.jpg
 */
export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
  // Some controllers (e.g. product) already store /api/uploads/... in the DB.
  // Others (gallery, guide, serverType, linktree) store /uploads/... without /api.
  // When path already starts with /api/, use the base origin (strip /api from apiUrl).
  if (path.startsWith("/api/")) {
    const base = apiUrl.replace(/\/api$/, "");
    return `${base}${path}`;
  }
  return `${apiUrl}${path}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getOrderStatusColor(status) {
  const colors = {
    pending: "text-yellow-500 bg-yellow-500/10",
    paid: "text-blue-500 bg-blue-500/10",
    processing: "text-indigo-500 bg-indigo-500/10",
    completed: "text-emerald-500 bg-emerald-500/10",
    failed: "text-red-500 bg-red-500/10",
    expired: "text-gray-500 bg-gray-500/10",
  };
  return colors[status] || colors.pending;
}

export function getOrderStatusText(status) {
  const texts = {
    pending: "Menunggu Pembayaran",
    paid: "Dibayar",
    processing: "Diproses",
    completed: "Selesai",
    failed: "Gagal",
    expired: "Kadaluarsa",
  };
  return texts[status] || status;
}
