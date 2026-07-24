import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Medal, Crown, Star, TrendingUp, Package, ShoppingBag,
  Loader2, AlertCircle, Users, Award
} from "lucide-react";
import { leaderboardAPI } from "../lib/api";

const formatIDR = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const RANK_STYLES = [
  { bg: "from-yellow-500/20 to-amber-500/10", border: "border-yellow-500/40", text: "text-yellow-400", icon: Crown },
  { bg: "from-gray-400/20 to-gray-500/10",   border: "border-gray-400/40",   text: "text-gray-300",  icon: Medal },
  { bg: "from-orange-500/20 to-red-500/10",  border: "border-orange-500/40", text: "text-orange-400", icon: Award },
];

const TYPE_BADGE = {
  RANK:        { label: "Rank",        cls: "bg-arcane/15 text-arcane border border-arcane/30" },
  COIN:        { label: "Coin",        cls: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" },
  MONEY:       { label: "Money",       cls: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" },
  FEATURE:     { label: "Feature",     cls: "bg-cyan-500/20    text-cyan-300    border border-cyan-500/30" },
  BATTLEPASS:  { label: "Battlepass",  cls: "bg-rose-500/20   text-rose-300   border border-rose-500/30" },
  UNKNOWN:     { label: "Unknown",     cls: "bg-gray-500/20   text-gray-400   border border-gray-500/30" },
};

function RankBadge({ rank }) {
  const style = RANK_STYLES[rank - 1];
  if (style) {
    const Icon = style.icon;
    return (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${style.bg} border ${style.border} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${style.text}`} />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 flex-shrink-0">
      <span className="text-sm font-bold text-gray-400">#{rank}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-white/5 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
      <div className="h-4 bg-white/5 rounded w-24" />
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    leaderboardAPI
      .get()
      .then((res) => setData(res.data.data))
      .catch(() => setError("Gagal memuat data leaderboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-yellow-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/15 via-amber-900/8 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 text-sm text-yellow-300 mb-4"
          >
            <Trophy className="w-4 h-4" />
            Hall of Fame
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 mb-3"
          >
            Leaderboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base"
          >
            Top donatur dan produk terlaris dari semua transaksi yang telah selesai.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <AlertCircle className="w-10 h-10 text-red-400/60" />
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* ── Top Donors ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4.5 h-4.5 text-yellow-400" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Top Donatur</h2>
                  <p className="text-xs text-gray-500">Berdasarkan total pengeluaran</p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : data?.topDonors?.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-gray-600">
                    <Trophy className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Belum ada data donatur</p>
                  </div>
                ) : (
                  data?.topDonors?.map((donor, i) => (
                    <motion.div
                      key={donor.minecraftName}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.04 }}
                      className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.02] ${
                        i === 0 ? "bg-yellow-500/[0.04]" : ""
                      }`}
                    >
                      <RankBadge rank={donor.rank} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm font-mono truncate ${i === 0 ? "text-yellow-300" : "text-white"}`}>
                          {donor.minecraftName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {donor.orderCount} transaksi selesai
                        </p>
                      </div>
                      <p className={`text-sm font-bold tabular-nums flex-shrink-0 ${i === 0 ? "text-yellow-400" : "text-gray-300"}`}>
                        {formatIDR(donor.totalAmount)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* ── Top Products ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-400" style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Produk Terlaris</h2>
                  <p className="text-xs text-gray-500">Berdasarkan jumlah terjual</p>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : data?.topProducts?.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-gray-600">
                    <ShoppingBag className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Belum ada data produk</p>
                  </div>
                ) : (
                  data?.topProducts?.map((product, i) => {
                    const badge = TYPE_BADGE[product.productType] ?? TYPE_BADGE.UNKNOWN;
                    return (
                      <motion.div
                        key={product.productId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.17 + i * 0.04 }}
                        className={`flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.02] ${
                          i === 0 ? "bg-emerald-500/[0.04]" : ""
                        }`}
                      >
                        <RankBadge rank={product.rank} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${i === 0 ? "text-emerald-300" : "text-white"}`}>
                            {product.productName}
                          </p>
                          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Package className="w-3.5 h-3.5 text-gray-500" />
                          <span className={`text-sm font-bold tabular-nums ${i === 0 ? "text-emerald-400" : "text-gray-300"}`}>
                            {product.totalQuantity.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer note */}
        {!loading && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs text-gray-600 mt-8"
          >
            Data hanya mencakup transaksi berstatus <span className="text-gray-500 font-medium">Completed</span>.
          </motion.p>
        )}
      </div>
    </div>
  );
}
