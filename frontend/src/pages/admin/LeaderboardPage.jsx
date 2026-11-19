import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Plus,
  Minus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Search,
  RefreshCw,
  ExternalLink,
  Info,
  PenLine,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";
import { leaderboardEntryAPI } from "../../lib/api";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import SkinImage from "../../components/leaderboard/SkinImage";
import { getHeadUrls } from "../../lib/minecraftSkin";

const formatIDR = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatSigned = (amount) => `${amount > 0 ? "+" : "−"}${formatIDR(Math.abs(amount))}`;

const inputCls =
  "w-full bg-[#1a1d24] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-arcane/50";

const Head = ({ name, size = 28 }) => (
  <SkinImage
    sources={getHeadUrls(name, 64)}
    alt={name}
    width={size}
    height={size}
    className="rounded-md [image-rendering:pixelated] shrink-0"
    style={{ width: size, height: size }}
    fallback={<div className="rounded-md bg-white/10 shrink-0" style={{ width: size, height: size }} />}
  />
);

// Dates are picked as WIB calendar days (the leaderboard periods are WIB too)
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const todayWIB = () => new Date(Date.now() + WIB_OFFSET_MS).toISOString().slice(0, 10);
const toWIBDate = (iso) => new Date(new Date(iso).getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

const PREVIEW_PERIODS = [
  { id: "all", label: "All Time" },
  { id: "year", label: "Tahun Ini" },
  { id: "month", label: "Bulan Ini" },
];

const emptyForm = () => ({ minecraftName: "", direction: "add", amount: "", note: "", donatedAt: todayWIB() });

const EntryModal = ({ isOpen, onClose, entry, ranking, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const today = todayWIB();
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(entry);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      entry
        ? {
            minecraftName: entry.minecraftName,
            direction: entry.amount < 0 ? "subtract" : "add",
            amount: String(Math.abs(entry.amount)),
            note: entry.note || "",
            donatedAt: toWIBDate(entry.donatedAt),
          }
        : emptyForm()
    );
  }, [isOpen, entry]);

  // Debounced name for the head preview, so typing doesn't fire a request per keystroke
  const [previewName, setPreviewName] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setPreviewName(form.minecraftName.trim()), 400);
    return () => clearTimeout(t);
  }, [form.minecraftName]);

  // Current standing of the typed gamertag, so the admin knows what they're adjusting
  const current = useMemo(() => {
    const key = form.minecraftName.trim().toLowerCase();
    if (!key) return null;
    return ranking.find((d) => d.minecraftName.toLowerCase() === key) || null;
  }, [form.minecraftName, ranking]);

  const amountNumber = parseInt(form.amount.replace(/\D/g, ""), 10) || 0;
  const signed = form.direction === "subtract" ? -amountNumber : amountNumber;
  // When editing, the entry's old amount is already inside the current total
  const baseTotal = (current?.totalAmount ?? 0) - (isEdit && current ? entry.amount : 0);
  const projected = Math.max(0, baseTotal + signed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.minecraftName.trim().length < 2) return toast.error("Gamertag wajib diisi");
    if (!amountNumber) return toast.error("Nominal wajib diisi");

    if (!form.donatedAt || form.donatedAt > today) return toast.error("Tanggal donasi tidak boleh di masa depan");

    const payload = {
      minecraftName: form.minecraftName.trim(),
      amount: signed,
      note: form.note.trim(),
      // Start of that day in WIB, so it lands in the right month/year period
      donatedAt: new Date(`${form.donatedAt}T00:00:00+07:00`).toISOString(),
    };
    setLoading(true);
    try {
      if (isEdit) await leaderboardEntryAPI.update(entry.id, payload);
      else await leaderboardEntryAPI.create(payload);
      toast.success(isEdit ? "Donasi manual diperbarui" : "Donasi manual ditambahkan");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md bg-[#13151a] rounded-2xl border border-white/[0.06] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {isEdit ? "Edit Donasi Manual" : "Tambah Donasi Manual"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Gamertag <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    <Head name={previewName || "MHF_Steve"} size={22} />
                  </div>
                  <input
                    type="text"
                    value={form.minecraftName}
                    onChange={(e) => setForm((p) => ({ ...p, minecraftName: e.target.value }))}
                    placeholder="mis. Steve123 atau .BedrockName"
                    maxLength={32}
                    className={`${inputCls} pl-11 font-mono`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {current
                    ? `Total all-time sekarang ${formatIDR(current.totalAmount)} (peringkat #${current.rank})`
                    : form.minecraftName.trim()
                      ? "Belum ada di leaderboard — akan jadi entri baru"
                      : "Gamertag bisa milik siapa saja, tidak harus pernah order"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Nominal <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex rounded-xl border border-white/10 bg-[#1a1d24] p-1 shrink-0">
                    {[
                      { id: "add", icon: Plus, label: "Tambah", cls: "bg-emerald-500/15 text-emerald-300" },
                      { id: "subtract", icon: Minus, label: "Kurangi", cls: "bg-red-500/15 text-red-300" },
                    ].map(({ id, icon: Icon, label, cls }) => (
                      <button
                        key={id}
                        type="button"
                        title={label}
                        onClick={() => setForm((p) => ({ ...p, direction: id }))}
                        className={`px-2.5 rounded-lg transition-colors ${form.direction === id ? cls : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amountNumber ? amountNumber.toLocaleString("id-ID") : ""}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="50.000"
                      className={`${inputCls} pl-10 tabular-nums`}
                    />
                  </div>
                </div>
                {amountNumber > 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Total all-time setelah disimpan:{" "}
                    <span className="font-semibold text-yellow-300">{formatIDR(projected)}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Tanggal Donasi</label>
                <input
                  type="date"
                  value={form.donatedAt}
                  max={today}
                  onChange={(e) => setForm((p) => ({ ...p, donatedAt: e.target.value }))}
                  className={`${inputCls} [color-scheme:dark]`}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Menentukan donasi ini masuk leaderboard bulan/tahun yang mana.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Catatan (opsional)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                  placeholder="mis. Donasi via transfer manual 12 Nov"
                  maxLength={200}
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1.5">Hanya terlihat oleh admin.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300">
                  Batal
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-arcane hover:bg-arcane-glow text-bone">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {isEdit ? "Simpan" : "Tambahkan"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminLeaderboardPage = () => {
  const [entries, setEntries] = useState([]);
  const [ranking, setRanking] = useState([]); // preview for the selected period
  const [allRanking, setAllRanking] = useState([]); // all-time, for the modal's hints
  const [previewPeriod, setPreviewPeriod] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, entry: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const requestId = useRef(0);

  const fetchData = async (period = previewPeriod) => {
    // Quick period switches: only the latest request may update the state
    const id = ++requestId.current;
    setLoading(true);
    try {
      const [current, allTime] = await Promise.all([
        leaderboardEntryAPI.getAll(period),
        period === "all" ? null : leaderboardEntryAPI.getAll("all"),
      ]);
      if (id !== requestId.current) return;
      setEntries(current.data.data?.entries || []);
      setRanking(current.data.data?.ranking || []);
      setAllRanking((allTime ?? current).data.data?.ranking || []);
    } catch {
      if (id === requestId.current) toast.error("Gagal memuat data leaderboard");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(previewPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewPeriod]);

  const confirmDelete = async () => {
    try {
      await leaderboardEntryAPI.delete(deleteTarget.id);
      toast.success("Donasi manual dihapus");
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const filtered = entries.filter((e) => e.minecraftName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Tambah atau koreksi total donasi gamertag secara manual
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/leaderboard" target="_blank" rel="noreferrer">
            <Button className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Lihat Publik
            </Button>
          </a>
          <Button onClick={() => fetchData()} className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/50">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setModal({ open: true, entry: null })}
            className="bg-arcane hover:bg-arcane-glow text-bone shadow-lg shadow-arcane/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Donasi
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-arcane/20 bg-arcane/5 px-4 py-3 text-sm text-gray-300">
        <Info className="w-4 h-4 text-arcane mt-0.5 shrink-0" />
        <p>
          Nominal manual <span className="text-white font-medium">ditambahkan</span> ke total order asli gamertag
          tersebut. Pakai mode <span className="text-red-300 font-medium">Kurangi</span> untuk koreksi. Di halaman publik
          hanya total akhirnya yang tampil.
        </p>
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Manual entries */}
        <Card className="xl:col-span-3 bg-gray-900/50 border-white/[0.06]">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <PenLine className="w-4 h-4 text-arcane" />
                <h2 className="font-semibold text-white">Donasi Manual</h2>
                <span className="text-xs text-gray-500">({entries.length})</span>
              </div>
              <div className="relative sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari gamertag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#1a1d24] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-arcane/50"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 text-arcane animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>{entries.length ? "Tidak ada yang cocok" : "Belum ada donasi manual"}</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {filtered.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <Head name={entry.minecraftName} size={32} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-semibold text-white truncate">{entry.minecraftName}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {formatDate(entry.donatedAt)}
                        {entry.note ? ` · ${entry.note}` : ""}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold tabular-nums shrink-0 ${entry.amount > 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {formatSigned(entry.amount)}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setModal({ open: true, entry })}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(entry)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Merged ranking preview */}
        <Card className="xl:col-span-2 bg-gray-900/50 border-white/[0.06]">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <h2 className="font-semibold text-white">Preview Ranking</h2>
                <span className="text-xs text-gray-500">(top 10 tampil di publik)</span>
              </div>
              <div className="flex gap-1.5">
                {PREVIEW_PERIODS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setPreviewPeriod(id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      previewPeriod === id
                        ? "bg-yellow-400/10 border-yellow-400/40 text-yellow-300"
                        : "border-white/10 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 text-arcane animate-spin" />
              </div>
            ) : ranking.length === 0 ? (
              <p className="text-center py-16 text-gray-500 text-sm">Belum ada donatur</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {ranking.map((d) => (
                  <div
                    key={d.minecraftName}
                    className={`flex items-center gap-3 px-6 py-3 ${d.rank > 10 ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`w-7 text-sm font-bold tabular-nums ${
                        d.rank === 1 ? "text-yellow-400" : d.rank === 2 ? "text-gray-300" : d.rank === 3 ? "text-orange-400" : "text-gray-500"
                      }`}
                    >
                      #{d.rank}
                    </span>
                    <Head name={d.minecraftName} size={26} />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white truncate">{d.minecraftName}</p>
                      {d.manualAmount !== 0 && (
                        <p className="text-[11px] text-gray-500 truncate">
                          Order {formatIDR(d.orderAmount)} ·{" "}
                          <span className={d.manualAmount > 0 ? "text-emerald-400/80" : "text-red-400/80"}>
                            manual {formatSigned(d.manualAmount)}
                          </span>
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-gray-200 shrink-0">
                      {formatIDR(d.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <EntryModal
        isOpen={modal.open}
        entry={modal.entry}
        ranking={allRanking}
        onClose={() => setModal({ open: false, entry: null })}
        onSuccess={() => fetchData()}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? `${deleteTarget.minecraftName} (${formatSigned(deleteTarget.amount)})` : ""}
        itemType="Donasi Manual"
      />
    </div>
  );
};

export default AdminLeaderboardPage;
