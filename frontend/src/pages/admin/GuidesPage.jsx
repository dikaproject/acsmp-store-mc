import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Search,
  Grid3x3,
  List,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Globe,
  Lock
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import GuideModal from "../../components/admin/GuideModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import { getImageUrl } from "../../lib/utils";

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Filters
  const [filters, setFilters] = useState({
    isActive: 'all'
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/guides`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGuides(response.data.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Gagal memuat data guides");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedGuide(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (guide) => {
    setSelectedGuide(guide);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (guide) => {
    setSelectedGuide(guide);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (guide) => {
    setSelectedGuide(guide);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/guides/${selectedGuide.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Guide berhasil dihapus");
      fetchGuides();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus guide");
    }
  };

  // Filter guides
  const filteredGuides = guides.filter(guide => {
    const matchSearch = 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchActive = filters.isActive === 'all' || 
      guide.isActive.toString() === filters.isActive;

    return matchSearch && matchActive;
  });

  // Calculate stats
  const stats = {
    total: guides.length,
    active: guides.filter(g => g.isActive).length,
    inactive: guides.filter(g => !g.isActive).length,
    withImage: guides.filter(g => g.imageUrl).length
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat guides...</p>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Guides</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage tutorial guides and documentation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Guide
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total Guides</p>
                <BookOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">+5 this month</span>
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
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Published</p>
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Live on website</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Draft</p>
                <Lock className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.inactive}</p>
              <p className="text-xs text-gray-500 mt-1">Not published</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">With Image</p>
                <ImageIcon className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-purple-400">{stats.withImage}</p>
              <p className="text-xs text-gray-500 mt-1">Featured images</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari guide berdasarkan judul atau slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/30 border-gray-700/50 focus:border-indigo-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2 bg-gray-800/30 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.isActive !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <p className="text-sm text-gray-400">
                Showing {filteredGuides.length} of {guides.length} guides
              </p>
              <button
                onClick={() => {
                  setFilters({ isActive: 'all' });
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
              >
                Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guides Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-indigo-500/30 transition-all overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800/50">
                    {guide.imageUrl ? (
                      <img
                        src={getImageUrl(guide.imageUrl)}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                        <FileText className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${
                        guide.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {guide.isActive ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Order Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-gray-700 text-white">
                        #{guide.order}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Slug */}
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs px-2 py-1 bg-gray-800/50 rounded text-indigo-400 border border-gray-700/50">
                        /{guide.slug}
                      </code>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {guide.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                      {stripHtml(guide.content)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(guide.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {stripHtml(guide.content).split(' ').length} words
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(guide)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleEdit(guide)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-indigo-500/50 hover:text-indigo-400"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(guide)}
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
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Order</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Image</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Title</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Slug</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Content</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuides.map((guide, index) => (
                    <motion.tr
                      key={guide.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <Badge variant="outline" className="border-gray-700">
                          #{guide.order}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800/50">
                          {guide.imageUrl ? (
                            <img
                              src={getImageUrl(guide.imageUrl)}
                              alt={guide.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white max-w-xs truncate">
                          {guide.title}
                        </p>
                      </td>
                      <td className="p-4">
                        <code className="text-xs px-2 py-1 bg-gray-800/50 rounded text-indigo-400">
                          /{guide.slug}
                        </code>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400 max-w-md truncate">
                          {stripHtml(guide.content)}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge className={`${
                          guide.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {guide.isActive ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400">
                          {new Date(guide.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleView(guide)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(guide)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-indigo-500/50 hover:text-indigo-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(guide)}
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
      {filteredGuides.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || filters.isActive !== 'all'
              ? 'Tidak ada hasil'
              : 'Belum ada guide'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery || filters.isActive !== 'all'
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Mulai dengan menambahkan guide pertama'}
          </p>
          {!searchQuery && filters.isActive === 'all' && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Guide
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <GuideModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        guide={selectedGuide}
        onSuccess={fetchGuides}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus Guide"
        message={`Apakah Anda yakin ingin menghapus guide "${selectedGuide?.title}"?`}
      />
    </div>
  );
};

export default GuidesPage;