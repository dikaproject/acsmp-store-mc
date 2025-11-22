import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Loader2, 
  CheckCircle2,
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Crown,
  Shield
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import axios from "axios";

const UserModal = ({ isOpen, onClose, mode, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN'
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'ADMIN'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'ADMIN'
      });
    }
    setShowPassword(false);
  }, [user, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (mode === 'create' && !formData.password) {
      toast.error("Password harus diisi");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's filled
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      if (mode === 'create') {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/create`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User berhasil ditambahkan");
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/users/update/${user.id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("User berhasil diupdate");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
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
          className="relative w-full max-w-md"
        >
          <Card className="border-gray-800/50 bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'create' ? 'Tambah Admin' : 'Edit User'}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {mode === 'create' ? 'Buat akun admin baru' : 'Update informasi user'}
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
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  Full Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Role <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'ADMIN'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white text-sm">Admin</p>
                        <p className="text-xs text-gray-400">Full access</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'VISITOR' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === 'VISITOR'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UserIcon className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white text-sm">Visitor</p>
                        <p className="text-xs text-gray-400">Limited</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Password {mode === 'create' && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={mode === 'edit' ? "Leave blank to keep current" : "Min. 6 characters"}
                    className="bg-gray-800/50 border-gray-700 focus:border-purple-500 pr-10"
                    required={mode === 'create'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {mode === 'edit' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika tidak ingin mengubah password
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              {formData.password && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="bg-gray-800/50 border-gray-700 focus:border-purple-500"
                    required
                  />
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">
                      Security Note
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Admin memiliki akses penuh ke dashboard. Pastikan password yang kuat dan jangan bagikan kredensial login.
                    </p>
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
                      {mode === 'create' ? 'Tambah User' : 'Update User'}
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

export default UserModal;