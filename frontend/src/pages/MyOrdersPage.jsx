import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package, Clock, CheckCircle2, XCircle, AlertCircle, CreditCard,
  ChevronRight, ChevronLeft, ExternalLink, Copy, Check, RefreshCw,
  ShoppingBag, Server, Calendar, Sparkles, History
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { orderAPI } from "../lib/api";
import { formatCurrency, getImageUrl } from "../lib/utils";
import toast from "react-hot-toast";

const STATUS_MAP = {
  PENDING:    { label: "Menunggu Bayar", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", Icon: Clock },
  PAID:       { label: "Dibayar",        color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30",   Icon: CreditCard },
  PROCESSING: { label: "Diproses",       color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30", Icon: RefreshCw },
  COMPLETED:  { label: "Selesai",        color: "text-emerald-400",bg: "bg-emerald-400/10 border-emerald-400/30", Icon: CheckCircle2 },
  FAILED:     { label: "Gagal",          color: "text-red-400",    bg: "bg-red-400/10 border-red-400/30",     Icon: XCircle },
  EXPIRED:    { label: "Kedaluwarsa",    color: "text-gray-400",   bg: "bg-gray-400/10 border-gray-400/30",   Icon: AlertCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status] || STATUS_MAP.PENDING;
  const { Icon, label, color, bg } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const OrderCard = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white font-mono">{order.orderCode}</span>
              <button onClick={copy} className="text-gray-500 hover:text-white transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              {date}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Server */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 font-semibold">{order.serverType?.name || "-"}</span>
        </div>

        {/* Items */}
        <div className="space-y-1.5">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
              {item.product?.imageUrl ? (
                <img
                  src={getImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                </div>
              )}
              <span className="text-sm text-gray-300 flex-1 min-w-0 truncate">{item.product?.name || "Item"}</span>
              <span className="text-xs text-gray-500">x{item.quantity}</span>
              <span className="text-sm font-semibold text-white">{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>
          <div className="flex gap-2">
            {order.status === "PENDING" && order.paymentUrl && (
              <a
                href={order.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Bayar
              </a>
            )}
            <Link
              to={`/track?code=${order.orderCode}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Detail
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { minecraftName, isUserLoggedIn } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/login", { state: { from: { pathname: "/my-orders" } } });
    }
  }, [isUserLoggedIn, navigate]);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await orderAPI.getMyOrders({ page: p, limit: 10 });
      setOrders(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      toast.error("Gagal memuat riwayat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) fetchOrders(page);
  }, [page, isUserLoggedIn]);

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04)_0%,transparent_60%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Riwayat Pesanan</h1>
              <p className="text-sm text-gray-500">
                <span className="text-purple-400 font-semibold">{minecraftName}</span> — {total} pesanan
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-purple-500/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Belum ada pesanan</h3>
            <p className="text-gray-500 mb-6">Yuk beli sesuatu di toko kami!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Ke Shop
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
