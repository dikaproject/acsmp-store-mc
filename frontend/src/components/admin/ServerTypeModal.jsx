import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import { getImageUrl } from "../../lib/utils";

const ServerTypeModal = ({ isOpen, onClose, mode, serverType, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (serverType && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: serverType.name || '',
        description: serverType.description || '',
        isActive: serverType.isActive ?? true
      });
      if (serverType.imageUrl) {
        setImagePreview(getImageUrl(serverType.imageUrl));
      }
    } else {
      setFormData({ name: '', description: '', isActive: true });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [serverType, mode, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
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

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      // Convert to boolean explicitly
      formDataToSend.append('isActive', formData.isActive === true || formData.isActive === 'true' ? 'true' : 'false');
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/server-types`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Server type berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/server-types/${serverType.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Server type berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving server type:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-white/\[0.06\] bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/\[0.06\]">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'create' ? 'Tambah Server Type' : mode === 'edit' ? 'Edit Server Type' : 'Detail Server Type'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {mode === 'create' ? 'Buat server type baru' : mode === 'edit' ? 'Update informasi server type' : 'Lihat detail server type'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/\[0.07\] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Server Image
                </label>
                <div className="flex flex-col items-center gap-4">
                  {/* Image Preview */}
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white/\[0.05\] border-2 border-dashed border-gray-700 hover:border-arcane/30 transition-colors">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {!isViewMode && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">Click to change</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  {!isViewMode && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isViewMode}
                      />
                      <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-white transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Server Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Skyblock, Prison, RPG"
                  className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-arcane"
                  required
                  disabled={isViewMode}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi server type..."
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-arcane transition-colors resize-none"
                  disabled={isViewMode}
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => !isViewMode && setFormData({ ...formData, isActive: true })}
                    disabled={isViewMode}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      formData.isActive
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-white">Active</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => !isViewMode && setFormData({ ...formData, isActive: false })}
                    disabled={isViewMode}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      !formData.isActive
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      <span className="font-medium text-white">Inactive</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* View Mode Info */}
              {isViewMode && serverType && (
                <div className="pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Total Products</p>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                        {serverType._count?.products || 0} products
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Created</p>
                      <p className="text-white">
                        {new Date(serverType.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-gray-700 hover:bg-white/\[0.07\]"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </Button>
                {!isViewMode && (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r bg-arcane hover:bg-arcane-glow"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {mode === 'create' ? 'Tambah' : 'Update'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ServerTypeModal;





