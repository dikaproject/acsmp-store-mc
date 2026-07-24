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
  Calendar,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  Terminal,
  Banknote,
  Shield,
  AlertTriangle,
  BookOpen,
  PackageX
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import { getImageUrl } from "../../lib/utils";

const hasPlayerPlaceholder = (command) =>
  command.includes('{player}') || command.includes('%player%');

const ProductModal = ({ isOpen, onClose, mode, product, serverTypes, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'COIN',
    price: '',
    discount: '0',
    amount: '',
    groupName: '',
    permission: '',
    serverTypeId: '',
    isActive: true,
    isOutOfStock: false,
    benefits: [],
    commands: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newBenefit, setNewBenefit] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [newInfoCommand, setNewInfoCommand] = useState('');
  const isCurrencyType = formData.type === 'COIN' || formData.type === 'MONEY';

  // Calculate discounted price
  const getDiscountedPrice = () => {
    const price = parseInt(formData.price) || 0;
    const discount = parseInt(formData.discount) || 0;
    return price - (price * discount / 100);
  };

  useEffect(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        type: product.type || 'COIN',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        amount: product.amount?.toString() || '',
        groupName: product.groupName || '',
        permission: product.permission || '',
        serverTypeId: product.serverTypeId || '',
        isActive: product.isActive ?? true,
        isOutOfStock: product.isOutOfStock ?? false,
        benefits: product.benefits || [],
        commands: product.commands || [],
        infoCommands: product.infoCommands || []
      });
      if (product.imageUrl) {
        setImagePreview(getImageUrl(product.imageUrl));
      }
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'COIN',
        price: '',
        discount: '0',
        amount: '',
        groupName: '',
        permission: '',
        serverTypeId: serverTypes[0]?.id || '',
        isActive: true,
        isOutOfStock: false,
        benefits: [],
        commands: [],
        infoCommands: []
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setNewBenefit('');
    setNewCommand('');
    setNewInfoCommand('');
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

  // Benefits handlers
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()]
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    });
  };

  // Commands handlers
  const addCommand = () => {
    if (newCommand.trim()) {
      setFormData({
        ...formData,
        commands: [...formData.commands, newCommand.trim()]
      });
      setNewCommand('');
    }
  };

  const removeCommand = (index) => {
    setFormData({
      ...formData,
      commands: formData.commands.filter((_, i) => i !== index)
    });
  };

  // Info Commands handlers
  const addInfoCommand = () => {
    if (newInfoCommand.trim()) {
      setFormData({
        ...formData,
        infoCommands: [...(formData.infoCommands || []), newInfoCommand.trim()]
      });
      setNewInfoCommand('');
    }
  };

  const removeInfoCommand = (index) => {
    setFormData({
      ...formData,
      infoCommands: (formData.infoCommands || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price || '0');
      formDataToSend.append('discount', formData.discount || '0');
      formDataToSend.append('amount', formData.amount || '0');
      formDataToSend.append('serverTypeId', formData.serverTypeId);
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('isOutOfStock', formData.isOutOfStock.toString());
      
      // Warn if any command is missing a supported player placeholder
      const commandsMissingPlayer = (formData.commands || []).filter(c => c.trim() && !hasPlayerPlaceholder(c));
      if (commandsMissingPlayer.length > 0) {
        toast('Peringatan: ' + commandsMissingPlayer.length + ' command tidak memiliki {player} atau %player%. Command mungkin tidak berfungsi dengan benar!', {
          icon: '⚠️',
          style: { background: '#1a1a1a', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
        });
      }

      // Commands sent for all product types
      formDataToSend.append('commands', JSON.stringify(formData.commands || []));

      // Append RANK specific fields
      if (formData.type === 'RANK') {
        formDataToSend.append('groupName', formData.groupName || '');
        formDataToSend.append('benefits', JSON.stringify(formData.benefits || []));
        formDataToSend.append('infoCommands', JSON.stringify(formData.infoCommands || []));
      }

      // Append FEATURE specific fields
      if (formData.type === 'FEATURE') {
        formDataToSend.append('permission', formData.permission || '');
        formDataToSend.append('benefits', JSON.stringify(formData.benefits || []));
        formDataToSend.append('infoCommands', JSON.stringify(formData.infoCommands || []));
      }
      
      // Append image only if new file selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/products`,
          formDataToSend,
          config
        );
        toast.success("Product berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${product.id}`,
          formDataToSend,
          config
        );
        toast.success("Product berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menyimpan data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const discountedPrice = getDiscountedPrice();
  const hasDiscount = parseInt(formData.discount) > 0;

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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="border-white/\[0.06\] bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/\[0.06\]">
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
                className="p-2 hover:bg-white/\[0.07\] rounded-lg transition-colors"
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
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-white/\[0.05\] border-2 border-dashed border-gray-700 hover:border-purple-500/50 transition-colors">
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
                      className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer [&_option]:bg-[#1a1d24] [&_option]:text-white [color-scheme:dark]"
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'COIN' })}
                        disabled={isViewMode}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'COIN'
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Coins className="w-6 h-6 text-yellow-400" />
                          <span className="font-medium text-white">Coin</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'MONEY' })}
                        disabled={isViewMode}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'MONEY'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-white/[0.03] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Banknote className="w-6 h-6 text-emerald-400" />
                          <span className="font-medium text-white">Money</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'FEATURE' })}
                        disabled={isViewMode}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'FEATURE'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Shield className="w-6 h-6 text-purple-400" />
                          <span className="font-medium text-white">Feature</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, type: 'RANK' })}
                        disabled={isViewMode}
                        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                          formData.type === 'RANK'
                            ? 'border-orange-500 bg-orange-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Crown className="w-6 h-6 text-orange-400" />
                          <span className="font-medium text-white">Rank</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Visibility
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
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-red-400" />
                          <span className="font-medium text-white">Hidden</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Out of Stock */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Stock Status
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, isOutOfStock: false })}
                        disabled={isViewMode}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          !formData.isOutOfStock
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="font-medium text-white">In Stock</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isViewMode && setFormData({ ...formData, isOutOfStock: true })}
                        disabled={isViewMode}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          formData.isOutOfStock
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-gray-700 bg-white/\[0.03\] hover:border-gray-600'
                        } ${isViewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <PackageX className="w-5 h-5 text-amber-400" />
                          <span className="font-medium text-white">Out of Stock</span>
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
                      placeholder={formData.type === 'COIN'
                        ? 'e.g., 1000 Coins'
                        : formData.type === 'MONEY'
                        ? 'e.g., 100K Money'
                        : 'e.g., VIP Rank (30 Hari)'}
                      className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
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
                      className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      disabled={isViewMode}
                    />
                  </div>

                  {/* Price & Discount */}
                  <div className="grid grid-cols-2 gap-4">
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
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
                        required
                        disabled={isViewMode}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Percent className="w-4 h-4 text-green-400" />
                        Discount (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setFormData({ ...formData, discount: val.toString() });
                        }}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  {/* Price Preview */}
                  {hasDiscount && (
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Final Price:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            Rp {parseInt(formData.price || 0).toLocaleString('id-ID')}
                          </span>
                          <span className="text-lg font-bold text-green-400">
                            Rp {Math.floor(discountedPrice).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-green-400 mt-1">
                        💰 Hemat Rp {(parseInt(formData.price || 0) - Math.floor(discountedPrice)).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}

                  {/* Group Name (for RANK only) */}
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
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
                        required
                        disabled={isViewMode}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Nama group di LuckPerms (harus sudah ada di server)
                      </p>
                    </div>
                  )}

                  {/* Permission (for FEATURE only) */}
                  {formData.type === 'FEATURE' && (
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        Permission <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.permission}
                        onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                        placeholder="contoh essentials.home.2"
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
                        required
                        disabled={isViewMode}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Permission yang akan diberikan ke player
                      </p>
                    </div>
                  )}

                  {/* Amount Field */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      {isCurrencyType ? (
                        <>
                          {formData.type === 'MONEY'
                            ? <Banknote className="w-4 h-4 text-emerald-400" />
                            : <Coins className="w-4 h-4 text-yellow-400" />}
                          {formData.type === 'MONEY' ? 'Money Amount' : 'Coin Amount'} <span className="text-red-400">*</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 text-purple-400" />
                          Duration (Days) <span className="text-red-400">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder={formData.type === 'COIN' ? '1000' : formData.type === 'MONEY' ? '100000' : '30'}
                      min="0"
                      className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500"
                      required
                      disabled={isViewMode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'COIN' 
                        ? '💰 Jumlah coins yang akan diberikan'
                        : formData.type === 'MONEY'
                        ? '💵 Nominal money in-game yang akan diberikan'
                        : '📅 Berapa hari rank akan aktif (contoh: 7, 30, 90)'
                      }
                    </p>
                  </div>

                  {/* Command Preview for FEATURE */}
                  {formData.type === 'FEATURE' && (formData.permission || formData.amount) && (
                    <div className="md:col-span-2">
                      <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Command Preview</span>
                        </div>
                        <code className="block p-3 bg-black/50 rounded-lg text-sm font-mono text-purple-300 overflow-x-auto">
                          /lp user <span className="text-cyan-400">{'{player}'}</span> permission settemp <span className="text-yellow-400">{formData.permission || '{permission}'}</span> true <span className="text-green-400">{formData.amount || '{duration}'}d</span>
                        </code>
                        <p className="text-xs text-gray-500 mt-2">
                          ⚡ Command ini akan dieksekusi saat pembayaran berhasil
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Command Preview for RANK */}
                  {formData.type === 'RANK' && (formData.groupName || formData.amount) && (
                    <div className="md:col-span-2">
                      <div className="p-4 rounded-xl bg-gray-900/50 border border-orange-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-gray-300">Command Preview</span>
                        </div>
                        <code className="block p-3 bg-black/50 rounded-lg text-sm font-mono text-orange-300 overflow-x-auto">
                          /lp user <span className="text-cyan-400">{'{player}'}</span> parent addtemp <span className="text-yellow-400">{formData.groupName || '{group}'}</span> <span className="text-green-400">{formData.amount || '{duration}'}d</span>
                        </code>
                        <p className="text-xs text-gray-500 mt-2">
                          ⚡ Command ini akan dieksekusi saat pembayaran berhasil
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Command Preview for COIN (outside grid) */}
              {formData.type === 'COIN' && formData.amount && (
                <div className="pt-6 border-t border-gray-800">
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-300">Command Preview</span>
                    </div>
                    <code className="block p-3 bg-black/50 rounded-lg text-sm font-mono text-yellow-300 overflow-x-auto">
                      /points give <span className="text-cyan-400">{'{player}'}</span> <span className="text-green-400">{formData.amount}</span>
                    </code>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚡ Command ini akan dieksekusi saat pembayaran berhasil
                    </p>
                  </div>
                </div>
              )}

              {/* Command Preview for MONEY (outside grid) */}
              {formData.type === 'MONEY' && formData.amount && (
                <div className="pt-6 border-t border-gray-800">
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-gray-300">Command Preview</span>
                    </div>
                    <code className="block p-3 bg-black/50 rounded-lg text-sm font-mono text-emerald-300 overflow-x-auto">
                      /eco give <span className="text-cyan-400">{'{player}'}</span> <span className="text-green-400">{formData.amount}</span>
                    </code>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚡ Command ini akan dieksekusi saat pembayaran berhasil
                    </p>
                  </div>
                </div>
              )}

              {/* Benefits (RANK and FEATURE only) */}
              {(formData.type === 'RANK' || formData.type === 'FEATURE') && (
                <div className="pt-6 border-t border-gray-800">
                  <label className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Benefits
                  </label>
                  {!isViewMode && (
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                        placeholder="e.g., Access to /fly command"
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-purple-500 flex-1"
                      />
                      <Button type="button" onClick={addBenefit}
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.benefits.length > 0 ? formData.benefits.map((benefit, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Sparkles className="w-3 h-3 text-purple-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300 flex-1">{benefit}</span>
                        {!isViewMode && (
                          <button type="button" onClick={() => removeBenefit(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors">
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </motion.div>
                    )) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p>Belum ada benefits</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">💡 List keuntungan yang didapat player</p>
                </div>
              )}

              {/* Info Commands Section (RANK and FEATURE only) */}
              {(formData.type === 'RANK' || formData.type === 'FEATURE') && (
                <div className="pt-6 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-arcane" />
                      Info Commands
                      <span className="text-xs font-normal text-gray-500">(ditampilkan ke pembeli)</span>
                    </label>
                    {(formData.infoCommands || []).length > 0 && (
                      <span className="text-xs text-arcane bg-arcane/10 border border-arcane/20 px-2 py-0.5 rounded-full">
                        {formData.infoCommands.length} command
                      </span>
                    )}
                  </div>

                  {!isViewMode && (
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={newInfoCommand}
                        onChange={(e) => setNewInfoCommand(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInfoCommand())}
                        placeholder="e.g., /fly, /home set, /nick"
                        className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-arcane flex-1 font-mono text-sm"
                      />
                      <Button type="button" onClick={addInfoCommand}
                        className="bg-arcane/15 hover:bg-arcane/25 text-arcane border border-arcane/30">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(formData.infoCommands || []).length > 0 ? formData.infoCommands.map((cmd, index) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-arcane/10 border border-arcane/20">
                        <BookOpen className="w-3 h-3 text-arcane flex-shrink-0" />
                        <code className="text-sm text-gray-300 flex-1 font-mono break-all">{cmd}</code>
                        {!isViewMode && (
                          <button type="button" onClick={() => removeInfoCommand(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0">
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </motion.div>
                    )) : (
                      <div className="text-center py-4 text-gray-600 text-sm">
                        <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-30" />
                        <p>Belum ada info command</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 Command yang bisa digunakan player setelah membeli (contoh: /fly, /kit vip). Ditampilkan di halaman toko.
                  </p>
                </div>
              )}

              {/* Commands Section (all product types) */}
              <div className="pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Custom Commands
                  </label>
                  {formData.commands.length > 0 && (
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                      {formData.commands.length} command
                    </span>
                  )}
                </div>

                {/* Variable Reference Chips */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <span className="text-xs text-gray-500 self-center mr-1">Variabel:</span>
                  {[
                    { key: '{player}', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', required: true },
                    { key: '{amount}', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', required: false },
                    { key: '{quantity}', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', required: false },
                    { key: '{duration}', color: 'bg-green-500/20 text-green-400 border-green-500/30', required: false },
                    ...(formData.type === 'RANK' ? [{ key: '{groupName}', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', required: false }] : []),
                    ...(formData.type === 'FEATURE' ? [{ key: '{permission}', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', required: false }] : []),
                  ].map(({ key, color, required }) => (
                    <button
                      key={key}
                      type="button"
                      title={required ? 'Wajib — diisi otomatis dengan nama player' : 'Opsional'}
                      onClick={() => setNewCommand(prev => prev + key)}
                      className={`text-xs border px-2 py-0.5 rounded-full font-mono cursor-pointer hover:opacity-80 transition-opacity ${color} ${required ? 'ring-1 ring-cyan-400/30' : ''}`}
                    >
                      {key}{required && ' *'}
                    </button>
                  ))}
                </div>

                {/* Hardcoded fallback preview (only when commands list is empty) */}
                {formData.commands.length === 0 && (
                  <div className="mb-3 p-3 rounded-lg bg-gray-900/60 border border-dashed border-gray-700">
                    <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                      <Terminal className="w-3 h-3" />
                      Fallback hardcoded (digunakan jika tidak ada custom command):
                    </p>
                    <code className="block text-xs font-mono text-gray-500 overflow-x-auto">
                      {formData.type === 'COIN' && (
                        <>points give <span className="text-cyan-600">{'{player}'}</span> <span className="text-yellow-600">{formData.amount || '{amount}'}</span></>
                      )}
                      {formData.type === 'MONEY' && (
                        <>eco give <span className="text-cyan-600">{'{player}'}</span> <span className="text-emerald-600">{formData.amount || '{amount}'}</span></>
                      )}
                      {formData.type === 'RANK' && (
                        <>lp user <span className="text-cyan-600">{'{player}'}</span> parent addtemp <span className="text-orange-600">{formData.groupName || '{groupName}'}</span> <span className="text-green-600">{formData.amount || '{duration}'}d</span></>
                      )}
                      {formData.type === 'FEATURE' && (
                        <>lp user <span className="text-cyan-600">{'{player}'}</span> permission settemp <span className="text-purple-600">{formData.permission || '{permission}'}</span> true <span className="text-green-600">{formData.amount || '{duration}'}d</span></>
                      )}
                    </code>
                  </div>
                )}

                {/* Add Command Input */}
                {!isViewMode && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      value={newCommand}
                      onChange={(e) => setNewCommand(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCommand())}
                      placeholder={formData.type === 'MONEY'
                        ? 'e.g., eco give {player} {amount}'
                        : 'e.g., points give {player} {amount}'}
                      className="bg-[#1a1d24] border-gray-700 rounded-xl focus:border-cyan-500 flex-1 font-mono text-sm"
                    />
                    <Button type="button" onClick={addCommand}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Commands List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formData.commands.length > 0 ? formData.commands.map((command, index) => {
                    const missingPlayer = !hasPlayerPlaceholder(command);
                    return (
                      <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          missingPlayer
                            ? 'bg-amber-500/5 border-amber-500/30'
                            : 'bg-cyan-500/10 border-cyan-500/20'
                        }`}>
                        <Terminal className={`w-3 h-3 flex-shrink-0 ${missingPlayer ? 'text-amber-400' : 'text-cyan-400'}`} />
                        <code className="text-sm text-gray-300 flex-1 font-mono break-all">{command}</code>
                        {missingPlayer && (
                          <div title="Command ini tidak memiliki {player} atau %player%. Nama player tidak akan disubstitusi!">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          </div>
                        )}
                        {!isViewMode && (
                          <button type="button" onClick={() => removeCommand(index)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors flex-shrink-0">
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </motion.div>
                    );
                  }) : (
                    <div className="text-center py-4 text-gray-600 text-sm">
                      <Terminal className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      <p>Tidak ada custom command — fallback hardcoded aktif</p>
                    </div>
                  )}
                </div>

                {/* Warning if any command is missing a player placeholder */}
                {formData.commands.some(c => c.trim() && !hasPlayerPlaceholder(c)) && (
                  <div className="mt-2 flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-400">
                      Beberapa command tidak memiliki <code className="font-mono">{'{player}'}</code> atau <code className="font-mono">%player%</code>. Nama player tidak akan disubstitusi pada command tersebut — pastikan ini disengaja.
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-600 mt-2">
                  💡 Klik chip variabel di atas untuk menambahkan ke input. Custom command menggantikan fallback hardcoded.
                </p>
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
                  className="flex-1 border-gray-700 hover:bg-white/\[0.07\]"
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





