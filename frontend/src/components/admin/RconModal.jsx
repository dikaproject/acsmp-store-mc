import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Terminal,
  Server,
  Lock,
  Eye,
  EyeOff,
  Clock,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";

const RconModal = ({ isOpen, onClose, mode, config, serverTypes, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    serverTypeId: "",
    host: "",
    port: "25575",
    password: "",
    timeout: "10000",
    isActive: true
  });

  // Filter serverTypes to only show those without an existing RCON config in create mode
  const availableServerTypes = mode === "create"
    ? (serverTypes || []).filter(st => !st.hasRconConfig)
    : (serverTypes || []);

  useEffect(() => {
    if (!isOpen) return;
    setTestResult(null);
    setShowPassword(false);

    if (config && (mode === "edit" || mode === "view")) {
      setFormData({
        name: config.name || "",
        serverTypeId: config.serverTypeId || "",
        host: config.host || "",
        port: config.port?.toString() || "25575",
        password: "",
        timeout: config.timeout?.toString() || "10000",
        isActive: config.isActive ?? true
      });
    } else {
      setFormData({
        name: "",
        serverTypeId: availableServerTypes[0]?.id || "",
        host: "",
        port: "25575",
        password: "",
        timeout: "10000",
        isActive: true
      });
    }
  }, [isOpen, config, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (testResult) setTestResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        serverTypeId: formData.serverTypeId,
        host: formData.host,
        port: parseInt(formData.port),
        timeout: parseInt(formData.timeout),
        isActive: formData.isActive
      };

      // Only include password if provided
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (mode === "create") {
        if (!formData.password.trim()) {
          toast.error("Password RCON wajib diisi saat membuat konfigurasi baru");
          setLoading(false);
          return;
        }
        await axios.post(
          `${import.meta.env.VITE_API_URL}/rcon`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("RCON config berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/rcon/${config.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("RCON config berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Gagal menyimpan konfigurasi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config?.id) return;
    setTestLoading(true);
    setTestResult(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/rcon/${config.id}/test`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestResult(res.data);
    } catch (error) {
      setTestResult({
        success: false,
        message: error.response?.data?.message || "Gagal terhubung ke RCON server"
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === "view";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg"
        >
          <div className="bg-[#13151a] border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === "create" ? "Tambah RCON Config" : mode === "edit" ? "Edit RCON Config" : "Detail RCON Config"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {mode === "create" ? "Konfigurasi RCON server baru" : mode === "edit" ? "Update konfigurasi RCON" : "Lihat detail konfigurasi"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-6 space-y-5">

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Lock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Password disimpan terenkripsi dengan AES-256-GCM dan tidak pernah dikembalikan melalui API.
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Config <span className="text-red-400">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="contoh: Survival Server RCON"
                  disabled={isViewMode}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500"
                />
              </div>

              {/* Server Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Type <span className="text-red-400">*</span>
                </label>
                {mode === "edit" || mode === "view" ? (
                  <div className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-gray-400 text-sm">
                    {serverTypes?.find(s => s.id === formData.serverTypeId)?.name || formData.serverTypeId}
                    <span className="ml-2 text-xs text-gray-600">(tidak bisa diubah)</span>
                  </div>
                ) : (
                  <select
                    name="serverTypeId"
                    value={formData.serverTypeId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none cursor-pointer [&_option]:bg-gray-800 [&_option]:text-white"
                  >
                    <option value="">Pilih Server Type</option>
                    {availableServerTypes.map(st => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                )}
                {mode === "create" && availableServerTypes.length === 0 && (
                  <p className="text-xs text-amber-400 mt-1">Semua Server Type sudah memiliki RCON config.</p>
                )}
              </div>

              {/* Host + Port */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Host / IP <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      name="host"
                      value={formData.host}
                      onChange={handleChange}
                      placeholder="192.168.1.1 atau localhost"
                      disabled={isViewMode}
                      required
                      className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500 pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Port <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="port"
                    type="number"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="25575"
                    disabled={isViewMode}
                    required
                    min="1"
                    max="65535"
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password RCON
                  {mode === "create" && <span className="text-red-400"> *</span>}
                  {mode === "edit" && config?.hasPassword && (
                    <Badge className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 py-0 px-1.5">
                      Password tersimpan
                    </Badge>
                  )}
                </label>
                {!isViewMode ? (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={mode === "edit" ? "Kosongkan untuk tidak mengubah password" : "Masukkan password RCON"}
                      className="w-full pl-9 pr-10 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-gray-400 text-sm tracking-widest">
                    {config?.hasPassword ? "••••••••••••" : "—"}
                  </div>
                )}
              </div>

              {/* Timeout */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeout (ms)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    name="timeout"
                    type="number"
                    value={formData.timeout}
                    onChange={handleChange}
                    placeholder="10000"
                    disabled={isViewMode}
                    min="1000"
                    max="60000"
                    className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500 pl-9"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">Default: 10000ms (10 detik)</p>
              </div>

              {/* isActive Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-300">Status Aktif</p>
                  <p className="text-xs text-gray-500 mt-0.5">Config tidak aktif tidak akan digunakan</p>
                </div>
                {!isViewMode ? (
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                    className="transition-colors"
                  >
                    {formData.isActive
                      ? <ToggleRight className="w-8 h-8 text-cyan-400" />
                      : <ToggleLeft className="w-8 h-8 text-gray-600" />
                    }
                  </button>
                ) : (
                  <Badge className={formData.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                  }>
                    {formData.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                )}
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
                  testResult.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-red-500/10 border-red-500/20 text-red-300"
                }`}>
                  {testResult.success
                    ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  }
                  <div>
                    <p className="font-medium">{testResult.message}</p>
                    {testResult.output && (
                      <p className="text-xs mt-1 opacity-70 font-mono">{testResult.output}</p>
                    )}
                  </div>
                </div>
              )}
              </div>{/* end scrollable area */}

              {/* Actions - fixed at bottom */}
              <div className="flex justify-between gap-3 px-6 py-4 border-t border-gray-800/50 flex-shrink-0">
                {/* Test button (only in edit/view mode when config exists) */}
                {(mode === "edit" || mode === "view") && config?.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={testLoading}
                    className="border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 hover:text-cyan-400"
                  >
                    {testLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Testing...</>
                    ) : (
                      <><Terminal className="w-4 h-4 mr-2" />Test Koneksi</>
                    )}
                  </Button>
                )}

                <div className="flex gap-3 ml-auto">
                  <Button type="button" variant="outline" onClick={onClose}
                    className="border-gray-700 hover:bg-gray-800">
                    {isViewMode ? "Tutup" : "Batal"}
                  </Button>
                  {!isViewMode && (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                      ) : mode === "create" ? "Tambah Config" : "Simpan Perubahan"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RconModal;
