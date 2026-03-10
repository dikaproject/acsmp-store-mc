import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Plus,
  Search,
  Edit3,
  Trash2,
  Zap,
  CheckCircle2,
  XCircle,
  Lock,
  Server,
  Loader2,
  RefreshCw,
  Shield,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import RconModal from "../../components/admin/RconModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const RconPage = () => {
  const [configs, setConfigs] = useState([]);
  const [serverTypes, setServerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [testingId, setTestingId] = useState(null);
  const [testResults, setTestResults] = useState({});

  const token = localStorage.getItem("token");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [configsRes, serverTypeRes] = await Promise.all([
        axios.get(`${API_URL}/rcon`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/server-types`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const fetchedConfigs = configsRes.data.data || [];
      const fetchedServerTypes = serverTypeRes.data.data || [];

      // Mark which serverTypes already have a config
      const configuredIds = new Set(fetchedConfigs.map(c => c.serverTypeId));
      const enrichedServerTypes = fetchedServerTypes.map(st => ({
        ...st,
        hasRconConfig: configuredIds.has(st.id)
      }));

      setConfigs(fetchedConfigs);
      setServerTypes(enrichedServerTypes);
    } catch (err) {
      console.error("Error fetching RCON configs:", err);
      toast.error("Gagal memuat konfigurasi RCON");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = () => {
    setSelectedConfig(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = (config) => {
    setSelectedConfig(config);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (config) => {
    setDeleteTarget(config);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_URL}/rcon/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("RCON config berhasil dihapus");
      setDeleteTarget(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus config");
    }
  };

  const handleTestConnection = async (config) => {
    setTestingId(config.id);
    setTestResults(prev => ({ ...prev, [config.id]: null }));
    try {
      const res = await axios.post(
        `${API_URL}/rcon/${config.id}/test`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTestResults(prev => ({ ...prev, [config.id]: res.data }));
      if (res.data.success) {
        toast.success(`${config.name}: Koneksi berhasil`);
      } else {
        toast.error(`${config.name}: ${res.data.message}`);
      }
    } catch (err) {
      const result = { success: false, message: err.response?.data?.message || "Test gagal" };
      setTestResults(prev => ({ ...prev, [config.id]: result }));
      toast.error(`${config.name}: ${result.message}`);
    } finally {
      setTestingId(null);
    }
  };

  const filtered = configs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.serverType?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: configs.length,
    active: configs.filter(c => c.isActive).length,
    covered: new Set(configs.map(c => c.serverTypeId)).size,
    totalServers: serverTypes.length
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">RCON Config</h1>
            <p className="text-sm text-gray-400">Kelola konfigurasi RCON per server</p>
          </div>
        </div>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
      >
        <Shield className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-300">Informasi Keamanan</p>
          <p className="text-xs text-amber-300/70 mt-1">
            Password RCON disimpan dengan enkripsi AES-256-GCM. Password tidak pernah dikembalikan melalui API
            dan tidak akan terlihat di halaman ini. Pastikan hanya admin terpercaya yang memiliki akses ke halaman ini.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: "Total Config", value: stats.total, icon: Terminal, color: "from-cyan-400 to-teal-400", glow: "cyan-500" },
          { label: "Aktif", value: stats.active, icon: CheckCircle2, color: "from-emerald-400 to-green-400", glow: "emerald-500" },
          { label: "Server Terkonfigurasi", value: stats.covered, icon: Server, color: "from-blue-400 to-indigo-400", glow: "blue-500" },
          { label: "Total Server Types", value: stats.totalServers, icon: Zap, color: "from-purple-400 to-pink-400", glow: "purple-500" }
        ].map((stat, i) => (
          <Card key={i} className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-${stat.glow}/20`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama, host, atau server type..."
            className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder-gray-500 pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchAll}
            className="border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 hover:text-cyan-400"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Config
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
        >
          <Terminal className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? "Tidak ada config yang cocok" : "Belum ada RCON config"}
          </p>
          {!searchQuery && (
            <p className="text-gray-600 text-sm mt-2">Klik "Tambah Config" untuk menambahkan konfigurasi RCON pertama</p>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((config, i) => {
            const testResult = testResults[config.id];
            const isTesting = testingId === config.id;

            return (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-cyan-500/20 transition-all">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Icon + Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                          config.isActive
                            ? "bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-500/20"
                            : "bg-gray-700/50 shadow-none"
                        }`}>
                          <Terminal className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">{config.name}</h3>
                            <Badge className={config.isActive
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                              : "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                            }>
                              {config.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                            {config.hasPassword && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                                <Lock className="w-3 h-3 mr-1 inline" />
                                Terenkripsi
                              </Badge>
                            )}
                          </div>

                          {/* Connection info */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Server className="w-3.5 h-3.5 text-gray-600" />
                              <span className="font-mono">{config.host}:{config.port}</span>
                            </span>
                            <span className="text-gray-600">·</span>
                            <span>
                              Server: <span className="text-purple-400">{config.serverType?.name || "—"}</span>
                            </span>
                            <span className="text-gray-600">·</span>
                            <span>Timeout: {config.timeout}ms</span>
                          </div>

                          {/* Test result inline */}
                          {testResult && (
                            <div className={`flex items-center gap-2 mt-2 text-xs ${testResult.success ? "text-emerald-400" : "text-red-400"}`}>
                              {testResult.success
                                ? <CheckCircle2 className="w-3.5 h-3.5" />
                                : <XCircle className="w-3.5 h-3.5" />
                              }
                              <span>{testResult.message}</span>
                              {testResult.output && (
                                <span className="text-gray-600 font-mono truncate max-w-xs">{testResult.output}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestConnection(config)}
                          disabled={isTesting || !config.isActive}
                          title={!config.isActive ? "Config nonaktif" : "Test koneksi RCON"}
                          className="border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-40"
                        >
                          {isTesting
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Zap className="w-3.5 h-3.5" />
                          }
                          <span className="ml-1.5 hidden sm:inline">Test</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(config)}
                          className="border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="ml-1.5 hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(config)}
                          className="border-gray-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Unconfigured servers notice */}
      {!loading && serverTypes.filter(st => !st.hasRconConfig).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-300">Server Type Belum Terkonfigurasi</p>
              <p className="text-xs text-blue-300/70 mt-1">
                Server berikut belum memiliki RCON config:{" "}
                <span className="font-medium">
                  {serverTypes.filter(st => !st.hasRconConfig).map(st => st.name).join(", ")}
                </span>.
                Command akan menggunakan fallback env vars jika tersedia.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <RconModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        config={selectedConfig}
        serverTypes={serverTypes}
        onSuccess={fetchAll}
      />

      {/* Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus RCON Config"
        message={`Apakah kamu yakin ingin menghapus config "${deleteTarget?.name}"? Config ini akan dihapus permanen dan server yang terkait tidak akan bisa menjalankan RCON command.`}
      />
    </div>
  );
};

export default RconPage;
