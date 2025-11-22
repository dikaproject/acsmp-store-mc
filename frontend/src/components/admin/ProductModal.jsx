import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  CheckCircle2,
  Coins,
  Crown,
  Server,
  Calendar
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";

const ProductModal = ({ isOpen, onClose, mode, product, serverTypes, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'COIN',
    price: '',
    amount: '',
    groupName: '',
    serverTypeId: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        type: product.type || 'COIN',
        price: product.price?.toString() || '',
        amount: product.amount?.toString() || '',
        groupName: product.groupName || '',
        serverTypeId: product.serverTypeId || '',
        isActive: product.isActive ?? true
      });
      if (product.imageUrl) {
        setImagePreview(`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.imageUrl}`);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'COIN',
        price: '',
        amount: '',
        groupName: '',
        serverTypeId: serverTypes[0]?.id || '',
        isActive: true
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [product, mode, isOpen, serverTypes]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('amount', formData.amount); // ✅ Always send amount
      formDataToSend.append('serverTypeId', formData.serverTypeId);
      formDataToSend.append('isActive', formData.isActive);
      
      // ✅ Only send groupName if type is RANK
      if (formData.type === 'RANK') {
        formDataToSend.append('groupName', formData.groupName);
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Product berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            } 
          }
        );
        toast.success("Product berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
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
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-gray-800/50 bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'create' ? 'Tambah Product' : mode === 'edit' ? 'Edit Product' : 'Detail Product'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {mode === 'create' ? 'Buat product baru' : mode === 'edit' ? 'Update informasi product' : 'Lihat detail product'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Product Image
                    </label>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-purple-500/50 transition-colors">
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

                  {/* Server Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Server Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.serverTypeId}
                      onChange={(e) => setFormData({ ...formData, serverTypeId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                      disabled={isViewMode}
                    >
                      <option value="">Pilih Server Type</option>
                      {serverTypes.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Product Type <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'COIN' })}
                        disabled={isViewMode}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'COIN'
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Coins className="w-6 h-6 text-yellow-400" />
                          <span className="font-medium text-white">Coin</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'RANK' })}
                        disabled={isViewMode}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'RANK'
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Crown className="w-6 h-6 text-orange-400" />
                          <span className="font-medium text-white">Rank</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={formData.type === 'COIN' ? 'e.g., 1000 Coins' : 'e.g., VIP Rank (30 Hari)'}
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
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
                      placeholder="Deskripsi product..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      disabled={isViewMode}
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Price (IDR) <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="10000"
                      min="0"
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                      required
                      disabled={isViewMode}
                    />
                  </div>

                  {/* ✅ Group Name (for RANK only) */}
                  {formData.type === 'RANK' && (
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-orange-400" />
                        Group Name <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                        placeholder="vip, mvp, elite"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                        required
                        disabled={isViewMode}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Nama group di LuckPerms (harus sudah ada di server)
                      </p>
                    </div>
                  )}

                  {/* ✅ Amount Field - Different for COIN and RANK */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      {formData.type === 'COIN' ? (
                        <>
                          <Coins className="w-4 h-4 text-yellow-400" />
                          Coin Amount <span className="text-red-400">*</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 text-orange-400" />
                          Duration (Days) <span className="text-red-400">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder={formData.type === 'COIN' ? '1000' : '30'}
                      min="0"
                      className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                      required
                      disabled={isViewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'COIN' 
                        ? '💰 Jumlah coins yang akan diberikan'
                        : '📅 Berapa hari rank akan aktif (contoh: 7, 30, 90)'
                      }
                    </p>
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
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-red-400" />
                          <span className="font-medium text-white">Inactive</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Additional Info */}
              {isViewMode && product && (
                <div className="pt-4 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Created</p>
                      <p className="text-white">
                        {new Date(product.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Last Updated</p>
                      <p className="text-white">
                        {new Date(product.updatedAt).toLocaleDateString('id-ID')}
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
                  className="flex-1 border-gray-700 hover:bg-gray-800"
                >
                  {isViewMode ? 'Tutup' : 'Batal'}
                </Button>
                {!isViewMode && (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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

export default ProductModal;