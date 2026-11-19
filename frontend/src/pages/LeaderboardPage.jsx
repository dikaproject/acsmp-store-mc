import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Trophy, Medal, Crown, Award, TrendingUp, Package, ShoppingBag,
  AlertCircle, Users, Sparkles, Heart, ArrowRight, CalendarDays, Timer, Loader2,
} from "lucide-react";
import { leaderboardAPI } from "../lib/api";
import { getImageUrl } from "../lib/utils";
import { getBodyUrls, getHeadUrls } from "../lib/minecraftSkin";
import SkinImage from "../components/leaderboard/SkinImage";
import { GridPattern } from "../components/ui/GridPattern";
import { AnimatedGradientText } from "../components/ui/AnimatedGradientText";

const formatIDR = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

// Visual theme per podium place
const PLACES = {
  1: {
    icon: Crown,
    text: "text-yellow-300",
    accent: "text-yellow-400",
    glow: "rgba(250, 204, 21, 0.32)",
    border: "border-yellow-400/40",
    face: "from-yellow-400/25 via-amber-500/10 to-amber-900/5",
    top: "bg-gradient-to-r from-yellow-300/50 via-amber-200/60 to-yellow-300/50",
    stage: "h-52 sm:h-80",
    block: "h-24 sm:h-36",
    delay: "",
  },
  2: {
    icon: Medal,
    text: "text-slate-200",
    accent: "text-slate-300",
    glow: "rgba(203, 213, 225, 0.22)",
    border: "border-slate-300/30",
    face: "from-slate-300/20 via-slate-400/10 to-slate-900/5",
    top: "bg-gradient-to-r from-slate-300/35 via-slate-100/45 to-slate-300/35",
    stage: "h-44 sm:h-64",
    block: "h-16 sm:h-24",
    delay: "lb-float-delay",
  },
  3: {
    icon: Award,
    text: "text-orange-300",
    accent: "text-orange-400",
    glow: "rgba(251, 146, 60, 0.22)",
    border: "border-orange-400/30",
    face: "from-orange-400/20 via-orange-500/10 to-orange-900/5",
    top: "bg-gradient-to-r from-orange-300/35 via-orange-200/45 to-orange-300/35",
    stage: "h-40 sm:h-56",
    block: "h-12 sm:h-20",
    delay: "lb-float-delay-2",
  },
};

const TYPE_BADGE = {
  RANK: { label: "Rank", cls: "bg-arcane/15 text-arcane-glow border-arcane/30" },
  COIN: { label: "Coin", cls: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" },
  MONEY: { label: "Money", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  FEATURE: { label: "Feature", cls: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  BATTLEPASS: { label: "Battlepass", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  UNKNOWN: { label: "Lainnya", cls: "bg-white/5 text-bone-muted border-white/10" },
};

// Pointer tilt only on real mouse devices without reduced-motion: phones get
// the (cheap) idle float animation only.
const canTilt = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useTilt() {
  const [enabled] = useState(canTilt);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 140, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 140, damping: 16 });

  const handlers = enabled
    ? {
        onPointerMove: (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 30);
          rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
        },
        onPointerLeave: () => {
          rotateX.set(0);
          rotateY.set(0);
        },
      }
    : {};

  return { style: { rotateX: springX, rotateY: springY }, handlers };
}

const Head = ({ name, size = 36, className = "" }) => (
  <SkinImage
    sources={getHeadUrls(name, 64)}
    alt={name}
    width={size}
    height={size}
    className={`rounded-lg [image-rendering:pixelated] shrink-0 ${className}`}
    style={{ width: size, height: size }}
    fallback={<div className={`rounded-lg bg-white/10 shrink-0 ${className}`} style={{ width: size, height: size }} />}
  />
);

/* ─────────────────────────── Podium ─────────────────────────── */

function PodiumSpot({ donor, place, order }) {
  const theme = PLACES[place];
  const Icon = theme.icon;
  const tilt = useTilt();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + order * 0.12, type: "spring", stiffness: 90, damping: 14 }}
      className="flex flex-col items-center min-w-0"
    >
      {/* Skin stage */}
      <div className={`relative w-full ${theme.stage}`} style={{ perspective: 900 }} {...tilt.handlers}>
        <div
          className="absolute inset-x-0 bottom-0 top-[15%] pointer-events-none"
          style={{ background: `radial-gradient(closest-side, ${theme.glow}, transparent)` }}
        />
        {place === 1 && (
          <Sparkles className="absolute top-[8%] right-[12%] w-4 h-4 sm:w-5 sm:h-5 text-yellow-300/70" />
        )}

        <motion.div
          style={{ ...tilt.style, transformStyle: "preserve-3d" }}
          className="relative h-full w-full flex items-end justify-center"
        >
          {donor ? (
            <div className={`lb-float ${theme.delay} relative h-[90%] flex items-end justify-center`}>
              <SkinImage
                sources={getBodyUrls(donor.minecraftName)}
                alt={`Skin ${donor.minecraftName}`}
                className="h-full w-auto max-w-full object-contain select-none"
                fallback={<Users className="w-16 h-16 text-white/10" />}
              />
            </div>
          ) : (
            <div className="h-[70%] w-[55%] rounded-2xl border border-dashed border-white/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white/10" />
            </div>
          )}
          <div className={`lb-shadow ${theme.delay} absolute bottom-0 left-[28%] right-[28%] h-2.5 sm:h-3 rounded-[50%] bg-black/70`} />
        </motion.div>
      </div>

      {/* Name plate */}
      <div className="w-full text-center px-1 mt-3 mb-3">
        <div className={`inline-flex items-center gap-1 ${theme.accent} mb-1`}>
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Juara {place}</span>
        </div>
        <p className={`font-mono font-bold text-xs sm:text-base truncate ${donor ? theme.text : "text-white/20"}`}>
          {donor?.minecraftName ?? "Belum ada"}
        </p>
        {donor && (
          <p className="text-[11px] sm:text-sm font-semibold text-bone tabular-nums mt-0.5 truncate">
            {formatIDR(donor.totalAmount)}
          </p>
        )}
      </div>

      {/* 3D block */}
      <div className="relative w-full">
        <div
          className={`h-3 sm:h-4 mx-[6%] rounded-t-sm ${theme.top}`}
          style={{ transform: "perspective(240px) rotateX(55deg)", transformOrigin: "bottom" }}
        />
        <div
          className={`relative overflow-hidden ${theme.block} rounded-b-xl border border-t-0 ${theme.border} bg-gradient-to-b ${theme.face} flex justify-center pt-2 sm:pt-3 ${place === 1 ? "lb-shine" : ""}`}
        >
          <span className={`font-display text-3xl sm:text-5xl font-black ${theme.text} opacity-70 leading-none`}>
            {place}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Podium({ donors }) {
  const [first, second, third] = donors;
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-6 max-w-3xl mx-auto">
      <PodiumSpot donor={second} place={2} order={1} />
      <PodiumSpot donor={first} place={1} order={0} />
      <PodiumSpot donor={third} place={3} order={2} />
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-6 max-w-3xl mx-auto animate-pulse">
      {[2, 1, 3].map((p) => (
        <div key={p} className="flex flex-col items-center gap-3">
          <div className={`w-1/2 rounded-2xl bg-white/5 ${PLACES[p].stage}`} />
          <div className="h-3 w-2/3 rounded bg-white/5" />
          <div className={`w-full rounded-xl bg-white/[0.04] ${PLACES[p].block}`} />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Lists ─────────────────────────── */

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 sm:px-5 py-3.5 animate-pulse">
      <div className="w-6 h-4 rounded bg-white/5" />
      <div className="w-9 h-9 rounded-lg bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-white/5 rounded w-1/3" />
        <div className="h-1.5 bg-white/5 rounded w-full" />
      </div>
      <div className="h-4 bg-white/5 rounded w-20" />
    </div>
  );
}

function DonorRow({ donor, topAmount, index }) {
  const pct = topAmount ? Math.max(4, (donor.totalAmount / topAmount) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-white/[0.025] transition-colors"
    >
      <span className="w-7 text-sm font-bold text-bone-subtle tabular-nums group-hover:text-arcane-glow transition-colors">
        #{donor.rank}
      </span>
      <Head name={donor.minecraftName} size={38} className="ring-1 ring-white/10" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-mono font-semibold text-sm text-bone truncate">{donor.minecraftName}</p>
          <p className="text-sm font-bold tabular-nums text-bone shrink-0">{formatIDR(donor.totalAmount)}</p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 + index * 0.04, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-arcane to-arcane-glow"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ProductRow({ product, topQty, index }) {
  const badge = TYPE_BADGE[product.productType] ?? TYPE_BADGE.UNKNOWN;
  const pct = topQty ? Math.max(4, (product.totalQuantity / topQty) * 100) : 0;
  const placeColor = PLACES[product.rank]?.accent ?? "text-bone-subtle";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-white/[0.025] transition-colors"
    >
      <span className={`w-7 text-sm font-bold tabular-nums ${placeColor}`}>#{product.rank}</span>
      <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10 shrink-0 flex items-center justify-center">
        <SkinImage
          sources={product.imageUrl ? [getImageUrl(product.imageUrl)] : []}
          alt={product.productName}
          className="w-full h-full object-cover"
          fallback={<Package className="w-5 h-5 text-bone-subtle" />}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-semibold text-sm text-bone truncate">{product.productName}</p>
            <span className={`hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-sm font-bold tabular-nums text-bone shrink-0">
            {product.totalQuantity.toLocaleString("id-ID")}
            <span className="text-xs font-normal text-bone-subtle ml-1">terjual</span>
          </p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.1 + index * 0.04, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-bone-subtle">
      <Icon className="w-9 h-9 opacity-40" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

const TABS = [
  { id: "donors", label: "Top Donatur", icon: Trophy },
  { id: "products", label: "Produk Terlaris", icon: TrendingUp },
];

// Calendar periods in WIB; must match backend getPeriodRange()
const PERIODS = [
  { id: "all", label: "Sepanjang Masa" },
  { id: "year", label: "Tahun Ini" },
  { id: "month", label: "Bulan Ini" },
];

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

// "now" expressed as WIB calendar parts (independent of the viewer's timezone)
const wibNow = () => new Date(Date.now() + WIB_OFFSET_MS);

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function periodInfo(period) {
  const now = wibNow();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  if (period === "month") {
    const nextReset = Date.UTC(year, month + 1, 1) - WIB_OFFSET_MS;
    const daysLeft = Math.max(1, Math.ceil((nextReset - Date.now()) / 86_400_000));
    return { range: `${MONTHS_ID[month]} ${year}`, reset: `Reset ${daysLeft} hari lagi` };
  }
  if (period === "year") {
    const nextReset = Date.UTC(year + 1, 0, 1) - WIB_OFFSET_MS;
    const daysLeft = Math.max(1, Math.ceil((nextReset - Date.now()) / 86_400_000));
    return { range: `Tahun ${year}`, reset: `Reset ${daysLeft} hari lagi` };
  }
  return { range: "Sejak server dibuka", reset: null };
}

const EMPTY_TEXT = {
  all: "Belum ada donatur. Jadilah yang pertama!",
  year: "Belum ada donatur tahun ini. Jadilah yang pertama!",
  month: "Belum ada donatur bulan ini. Kesempatanmu jadi Juara 1!",
};

export default function LeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // first load only: skeletons
  const [switching, setSwitching] = useState(false); // period change: keep old data, dim it
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("donors");
  const [period, setPeriod] = useState("all");
  const cache = useRef({}); // period -> data, so switching back is instant

  useEffect(() => {
    if (cache.current[period]) {
      setData(cache.current[period]);
      setSwitching(false);
      return;
    }
    let cancelled = false;
    setSwitching(true);
    leaderboardAPI
      .get(period)
      .then((res) => {
        if (cancelled) return;
        cache.current[period] = res.data.data;
        setData(res.data.data);
        setError(null);
      })
      .catch(() => !cancelled && setError("Gagal memuat data leaderboard."))
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setSwitching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const info = periodInfo(period);

  const donors = data?.topDonors ?? [];
  const products = data?.topProducts ?? [];
  const rest = donors.slice(3);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-arcane/10 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,204,21,0.08),transparent_55%)]" />
          <GridPattern />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-arcane/10 border border-arcane/30 rounded-full mb-6 backdrop-blur-xl"
          >
            <Trophy className="w-4 h-4 text-arcane" />
            <span className="text-sm text-arcane font-medium">Hall of Fame</span>
            <Sparkles className="w-4 h-4 text-arcane" />
          </motion.div>

          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white"
            >
              Leaderboard{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block"
            >
              <AnimatedGradientText gradient="from-yellow-300 via-amber-200 to-yellow-400">
                Donatur
              </AnimatedGradientText>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-bone-muted text-sm sm:text-base max-w-lg mx-auto"
          >
            Terima kasih untuk para pendukung yang bikin server tetap hidup. Ini dia pahlawan AmazingCraft!
          </motion.p>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/10"
            role="tablist"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`relative px-4 sm:px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  tab === id ? "text-white" : "text-bone-subtle hover:text-bone"
                }`}
              >
                {tab === id && (
                  <motion.span
                    layoutId="lb-tab"
                    className="absolute inset-0 rounded-lg bg-arcane/25 border border-arcane/40"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative inline-flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Period */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex flex-col items-center gap-2.5"
          >
            <div className="flex items-center gap-1.5 sm:gap-2" role="radiogroup" aria-label="Periode leaderboard">
              {PERIODS.map(({ id, label }) => (
                <button
                  key={id}
                  role="radio"
                  aria-checked={period === id}
                  onClick={() => setPeriod(id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all ${
                    period === id
                      ? "bg-yellow-400/10 border-yellow-400/40 text-yellow-300 shadow-[0_0_20px_-6px_rgba(250,204,21,0.5)]"
                      : "bg-transparent border-white/10 text-bone-subtle hover:text-bone hover:border-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-bone-subtle h-5">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {info.range}
              </span>
              {info.reset && (
                <span className="inline-flex items-center gap-1.5 text-arcane-glow">
                  <Timer className="w-3.5 h-3.5" />
                  {info.reset}
                </span>
              )}
              {switching && !loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-bone-muted" />}
            </div>
          </motion.div>
        </div>
      </section>

      <div
        className={`container mx-auto px-4 max-w-4xl transition-opacity duration-200 ${
          switching && !loading ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-busy={switching}
      >
        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <AlertCircle className="w-10 h-10 text-red-400/60" />
            <p className="text-bone-muted">{error}</p>
          </div>
        ) : tab === "donors" ? (
          <>
            {/* Podium */}
            <div className="mb-10 sm:mb-14">
              {loading ? (
                <PodiumSkeleton />
              ) : donors.length === 0 ? (
                <EmptyState icon={Trophy} text={EMPTY_TEXT[period]} />
              ) : (
                // key: replay the podium entrance when the period changes
                <Podium key={period} donors={donors} />
              )}
            </div>

            {/* #4 – #10 */}
            {(loading || rest.length > 0) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-arcane" />
                    <h2 className="text-sm font-semibold text-white">Peringkat Lainnya</h2>
                  </div>
                  <span className="text-xs text-bone-subtle">Top 10</span>
                </div>
                <div className="divide-y divide-white/5">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
                    : rest.map((d, i) => (
                        <DonorRow key={d.minecraftName} donor={d} topAmount={donors[0]?.totalAmount} index={i} />
                      ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 border-b border-white/10">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Produk Terlaris</h2>
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
              ) : products.length === 0 ? (
                <EmptyState icon={ShoppingBag} text="Belum ada produk terjual di periode ini" />
              ) : (
                products.map((p, i) => (
                  <ProductRow key={p.productId} product={p} topQty={products[0]?.totalQuantity} index={i} />
                ))
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 relative overflow-hidden rounded-2xl border border-arcane/25 bg-gradient-to-br from-arcane/15 via-arcane/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
          >
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-arcane/20 border border-arcane/30 items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-arcane-glow" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Mau namamu ada di podium?</p>
                <p className="text-sm text-bone-muted">Setiap pembelian di store ikut dihitung ke leaderboard.</p>
              </div>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-arcane hover:bg-arcane-glow text-white text-sm font-semibold transition-colors shrink-0"
            >
              Dukung Server
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
