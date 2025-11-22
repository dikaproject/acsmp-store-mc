import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
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
