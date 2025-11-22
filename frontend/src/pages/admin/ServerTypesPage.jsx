import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Plus,
  Search,
  Grid3x3,
  List,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import ServerTypeModal from "../../components/admin/ServerTypeModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";

const ServerTypesPage = () => {
  const [serverTypes, setServerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'

  useEffect(() => {
    fetchServerTypes();
  }, []);

  const fetchServerTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/server-types`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServerTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching server types:", error);
      toast.error("Gagal memuat data server types");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedServer(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (server) => {
    setSelectedServer(server);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (server) => {
    setSelectedServer(server);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (server) => {
    setSelectedServer(server);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/server-types/${selectedServer.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Server type berhasil dihapus");
      fetchServerTypes();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting server type:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus server type");
    }
  };

  const filteredServers = serverTypes.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Server Types</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage your Minecraft server types and configurations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Server Type
          </Button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Servers</p>
                  <p className="text-3xl font-bold text-white">{serverTypes.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Server className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {serverTypes.filter(s => s.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {serverTypes.reduce((sum, s) => sum + (s._count?.products || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search & View Toggle */}
      <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari server type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/30 border-gray-700/50 focus:border-emerald-500/50"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-800/30 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Types Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredServers.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-emerald-500/30 transition-all overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800/50">
                    {server.imageUrl ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${server.imageUrl}`}
                        alt={server.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${
                        server.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {server.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {server.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {server.description || 'No description'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">
                          {server._count?.products || 0} Products
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(server)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleEdit(server)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-emerald-500/50 hover:text-emerald-400"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(server)}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Image</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Description</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Products</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServers.map((server, index) => (
                    <motion.tr
                      key={server.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800/50">
                          {server.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${server.imageUrl}`}
                              alt={server.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{server.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400 max-w-md truncate">
                          {server.description || '-'}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                          <Package className="w-3 h-3 mr-1" />
                          {server._count?.products || 0}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${
                          server.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {server.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleView(server)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(server)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-emerald-500/50 hover:text-emerald-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(server)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredServers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Server className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery ? 'Tidak ada hasil' : 'Belum ada server type'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery 
              ? 'Coba kata kunci lain' 
              : 'Mulai dengan menambahkan server type pertama'}
          </p>
          {!searchQuery && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Server Type
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <ServerTypeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        serverType={selectedServer}
        onSuccess={fetchServerTypes}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus Server Type"
        message={`Apakah Anda yakin ingin menghapus server type "${selectedServer?.name}"?`}
      />
    </div>
  );
};

export default ServerTypesPage;