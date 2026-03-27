import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  CheckCircle2,
  FileImage,
  Hash,
  Info,
  Server
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import axios from "axios";
import { getImageUrl } from "../../lib/utils";

const GalleryModal = ({ isOpen, onClose, mode, gallery, onSuccess, totalGalleries }) => {
  const [loading, setLoading] = useState(false);
  const [serverTypes, setServerTypes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: '0',
    isActive: true,
    serverTypeId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (gallery && mode === 'edit') {
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        order: gallery.order?.toString() || '0',
        isActive: gallery.isActive ?? true,
        serverTypeId: gallery.serverTypeId || ''
      });
      if (gallery.imageUrl) {
        setImagePreview(getImageUrl(gallery.imageUrl));
      }
    } else {
      // Auto set next display order for new gallery
      const nextOrder = (totalGalleries || 0) + 1;
      setFormData({
        title: '',
        description: '',
        order: nextOrder.toString(),
        isActive: true,
        serverTypeId: ''
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [gallery, mode, isOpen, totalGalleries]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/server-types`)
      .then(r => setServerTypes((r.data.data || []).filter(s => s.isActive)))
      .catch(() => {});
  }, []);

  const handleImageChange = (file) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'create' && !imageFile) {
      toast.error("Gambar harus diupload");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive ? 'true' : 'false');
      if (formData.serverTypeId) formDataToSend.append('serverTypeId', formData.serverTypeId);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/gallery`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Gambar berhasil diupload");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/gallery/${gallery.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Gallery berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-gray-800/50 bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'create' ? 'Upload Image' : 'Edit Gallery'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {mode === 'create' ? 'Upload gambar baru ke gallery' : 'Update informasi gallery'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-gray-400" />
                  Image {mode === 'create' && <span className="text-red-400">*</span>}
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${
                    dragActive 
                      ? 'border-pink-500 bg-pink-500/5' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative aspect-video">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files[0])}
                            className="hidden"
                          />
                          <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors">
                            Change Image
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        className="hidden"
                      />
                      <div className="aspect-video flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors p-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-pink-400" />
                        </div>
                        <p className="text-sm font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Server Spawn Area"
                    className="bg-gray-800/50 border-gray-700 focus:border-pink-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi gambar (optional)..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    placeholder="0"
                    className="bg-gray-800/50 border-gray-700 focus:border-pink-500"
                  />
                  {mode === 'create' && (
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-400">
                        Auto set to {formData.order} (next available order)
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                {/* Server Type */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4 text-gray-400" />
                    Server (opsional)
                  </label>
                  <select
                    value={formData.serverTypeId}
                    onChange={(e) => setFormData({ ...formData, serverTypeId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">— Semua Server —</option>
                    {serverTypes.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Kosongkan agar gambar muncul di semua server</p>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Visibility
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: true })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.isActive
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium text-white">Visible</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: false })}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        !formData.isActive
                          ? 'border-gray-500 bg-gray-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-white">Hidden</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-gray-800"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Uploading...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Upload' : 'Update'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GalleryModal;