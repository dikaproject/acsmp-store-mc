import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Search,
  Grid3x3,
  LayoutGrid,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  Upload,
  ZoomIn,
  Download,
  Calendar,
  Hash
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import GalleryModal from "../../components/admin/GalleryModal";
import GalleryViewModal from "../../components/admin/GalleryViewModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import { getImageUrl } from "../../lib/utils";

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('masonry'); // masonry or grid
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Filters
  const [filters, setFilters] = useState({
    isActive: 'all'
  });

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gallery`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGalleries(response.data.data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Gagal memuat data gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedGallery(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (gallery) => {
    setSelectedGallery(gallery);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (gallery) => {
    setSelectedGallery(gallery);
    setShowViewModal(true);
  };

  const handleDelete = (gallery) => {
    setSelectedGallery(gallery);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/gallery/${selectedGallery.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Gallery berhasil dihapus");
      fetchGalleries();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus gallery");
    }
  };

  const handleDownload = async (gallery) => {
    try {
      const imageUrl = getImageUrl(gallery.imageUrl);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gallery.title.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Gagal download image");
    }
  };

  // Filter galleries
  const filteredGalleries = galleries.filter(gallery => {
    const matchSearch = 
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchActive = filters.isActive === 'all' || 
      gallery.isActive.toString() === filters.isActive;

    return matchSearch && matchActive;
  });

  // Calculate stats
  const stats = {
    total: galleries.length,
    active: galleries.filter(g => g.isActive).length,
    inactive: galleries.filter(g => !g.isActive).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat gallery...</p>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Gallery</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage server screenshots and media
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total Images</p>
                <ImageIcon className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">In gallery</p>
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
                <p className="text-xs text-gray-400">Active</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Visible</p>
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
                <p className="text-xs text-gray-400">Hidden</p>
                <XCircle className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
              <p className="text-xs text-gray-500 mt-1">Not visible</p>
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
                placeholder="Cari berdasarkan judul atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/30 border-gray-700/50 focus:border-pink-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-pink-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2 bg-gray-800/30 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('masonry')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'masonry'
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="Masonry View"
              >
                <LayoutGrid className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-pink-500/20 text-pink-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.isActive !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <p className="text-sm text-gray-400">
                Showing {filteredGalleries.length} of {galleries.length} images
              </p>
              <button
                onClick={() => {
                  setFilters({ isActive: 'all' });
                  setSearchQuery('');
                }}
                className="text-xs text-pink-400 hover:text-pink-300 transition-colors ml-auto"
              >
                Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {viewMode === 'masonry' ? (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filteredGalleries.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className="break-inside-avoid"
              >
                <Card className="group border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-pink-500/30 transition-all overflow-hidden">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-800/50">
                    <img
                      src={getImageUrl(gallery.imageUrl)}
                      alt={gallery.title}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleView(gallery)}
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(gallery)}
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDownload(gallery)}
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(gallery)}
                          size="sm"
                          className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/30 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className={`${
                        gallery.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30 backdrop-blur-sm'
                      }`}>
                        {gallery.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </div>

                    {/* Order Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-gray-700 text-white">
                        <Hash className="w-3 h-3 mr-1" />
                        {gallery.order}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-2">
                      {gallery.title}
                    </h3>
                    
                    {gallery.description && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(gallery.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredGalleries.map((gallery, index) => (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="group border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-pink-500/30 transition-all overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-800/50">
                    <img
                      src={getImageUrl(gallery.imageUrl)}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleView(gallery)}
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(gallery)}
                          size="sm"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Bottom Actions */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2">
                        <Button
                          onClick={() => handleDownload(gallery)}
                          size="sm"
                          className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(gallery)}
                          size="sm"
                          className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/30 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-gray-700 text-white text-xs">
                        #{gallery.order}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className={`text-xs ${
                        gallery.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-sm'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30 backdrop-blur-sm'
                      }`}>
                        {gallery.isActive ? '✓' : '✕'}
                      </Badge>
                    </div>
                  </div>

                  {/* Title */}
                  <CardContent className="p-3">
                    <h3 className="text-sm font-medium text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                      {gallery.title}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {filteredGalleries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || filters.isActive !== 'all'
              ? 'Tidak ada hasil'
              : 'Belum ada gambar'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery || filters.isActive !== 'all'
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Mulai dengan mengupload gambar pertama'}
          </p>
          {!searchQuery && filters.isActive === 'all' && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-pink-500 to-rose-500"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <GalleryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        gallery={selectedGallery}
        onSuccess={fetchGalleries}
        totalGalleries={galleries.length} // Add this prop
      />

      <GalleryViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        gallery={selectedGallery}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus Gambar"
        message={`Apakah Anda yakin ingin menghapus gambar "${selectedGallery?.title}"?`}
      />
    </div>
  );
};

export default GalleryPage;