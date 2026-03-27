import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Search,
  Tag,
  Calendar,
  Hash,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import { voucherAPI } from "../../lib/api";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";

const emptyForm = {
  code: "",
  discount: "",
  maxUse: "1",
  isActive: true,
  expiredAt: "",
};

const VoucherModal = ({ isOpen, onClose, mode, voucher, onSuccess }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && voucher) {
        setFormData({
          code: voucher.code || "",
          discount: String(voucher.discount || ""),
          maxUse: String(voucher.maxUse ?? 1),
          isActive: voucher.isActive ?? true,
          expiredAt: voucher.expiredAt
            ? new Date(voucher.expiredAt).toISOString().slice(0, 16)
            : "",
        });
      } else {
        setFormData(emptyForm);
      }
    }
  }, [isOpen, mode, voucher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const disc = parseInt(formData.discount);
    if (!formData.code.trim()) return toast.error("Kode voucher wajib diisi");
    if (isNaN(disc) || disc < 1 || disc > 100)
      return toast.error("Diskon harus 1–100");

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discount: disc,
      maxUse: parseInt(formData.maxUse) || 1,
      isActive: formData.isActive,
      expiredAt: formData.expiredAt ? new Date(formData.expiredAt).toISOString() : null,
    };

    setLoading(true);
    try {
      if (mode === "edit") {
        await voucherAPI.update(voucher.id, payload);
        toast.success("Voucher diperbarui");
      } else {
        await voucherAPI.create(payload);
        toast.success("Voucher dibuat");
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan voucher";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            className="relative z-10 w-full max-w-md bg-[#13151a] rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {mode === "edit" ? "Edit Voucher" : "Buat Voucher Baru"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Kode Voucher <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="mis. DISKON20"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 uppercase"
                  maxLength={32}
                />
              </div>

              {/* Discount + MaxUse row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Diskon (%) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, discount: e.target.value }))
                    }
                    min="1"
                    max="100"
                    placeholder="10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Maks. Penggunaan
                  </label>
                  <input
                    type="number"
                    value={formData.maxUse}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, maxUse: e.target.value }))
                    }
                    min="1"
                    placeholder="1"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Expired At */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Kadaluarsa (opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiredAt}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, expiredAt: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Is Active */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.isActive ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                  onClick={() =>
                    setFormData((p) => ({ ...p, isActive: !p.isActive }))
                  }
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      formData.isActive ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-300">
                  {formData.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {mode === "edit" ? "Simpan" : "Buat Voucher"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherAPI.getAll();
      setVouchers(res.data.data || []);
    } catch (err) {
      toast.error("Gagal memuat voucher");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedVoucher(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = (v) => {
    setSelectedVoucher(v);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = (v) => {
    setDeleteTarget(v);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await voucherAPI.delete(deleteTarget.id);
      toast.success("Voucher dihapus");
      setShowDeleteModal(false);
      fetchVouchers();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const filtered = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpired = (v) => v.expiredAt && new Date(v.expiredAt) < new Date();
  const isExhausted = (v) => v.usedCount >= v.maxUse;

  const getStatusBadge = (v) => {
    if (!v.isActive) return { label: "Nonaktif", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
    if (isExpired(v)) return { label: "Kadaluarsa", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (isExhausted(v)) return { label: "Habis", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
    return { label: "Aktif", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Voucher</h1>
          <p className="text-gray-400 text-sm mt-1">
            Kelola kode promo & diskon untuk pemain
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchVouchers}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Voucher
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Cari kode voucher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Table */}
      <Card className="bg-gray-900/50 border-gray-800/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Belum ada voucher</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Diskon
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Penggunaan
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Kadaluarsa
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {filtered.map((v) => {
                    const status = getStatusBadge(v);
                    return (
                      <motion.tr
                        key={v.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="font-mono font-bold text-white text-sm">
                              {v.code}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-400 font-bold">
                            {v.discount}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Hash className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm text-gray-300">
                              {v.usedCount} / {v.maxUse}
                            </span>
                            <div className="ml-1 w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (v.usedCount / v.maxUse) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {v.expiredAt ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-gray-500" />
                              <span
                                className={
                                  isExpired(v) ? "text-red-400" : "text-gray-300"
                                }
                              >
                                {new Date(v.expiredAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(v)}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(v)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <VoucherModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        voucher={selectedVoucher}
        onSuccess={fetchVouchers}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.code}
        itemType="Voucher"
      />
    </div>
  );
};

export default VouchersPage;
