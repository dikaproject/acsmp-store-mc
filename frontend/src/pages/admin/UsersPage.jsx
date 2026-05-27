import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Calendar,
  Crown,
  User as UserIcon,
  Lock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import UserModal from "../../components/admin/UserModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all'
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/get`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (user) => {
    if (currentUser?.id === user.id) {
      toast.error("Tidak dapat menghapus akun sendiri");
      return;
    }
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/delete/${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User berhasil dihapus");
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchRole = filters.role === 'all' || user.role === filters.role;

    return matchSearch && matchRole;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    visitors: users.filter(u => u.role === 'VISITOR').length
  };

  const getRoleConfig = (role) => {
    const configs = {
      ADMIN: {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: Crown,
        label: 'Admin'
      },
      VISITOR: {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: UserIcon,
        label: 'Visitor'
      }
    };
    return configs[role] || configs.VISITOR;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat users...</p>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage admin accounts and permissions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Admin
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total Users</p>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All accounts</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Administrators</p>
                <Crown className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
              <p className="text-xs text-gray-500 mt-1">With full access</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Visitors</p>
                <UserIcon className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-400">{stats.visitors}</p>
              <p className="text-xs text-gray-500 mt-1">Limited access</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">
                Admin Access Only
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Halaman ini hanya untuk mengelola akun admin. Player biasa menggunakan nametag Minecraft untuk checkout tanpa registrasi. Hanya admin yang perlu login untuk mengakses dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <Card className="border-white/\[0.06\] bg-[#111318]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-9 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1d24] border-gray-700/50 rounded-xl focus:border-purple-500/50"
              />
            </div>

            {/* Role Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer [&_option]:bg-[#1a1d24] [&_option]:text-white [color-scheme:dark]"
              >
                <option value="all">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="VISITOR">Visitor</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.role !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <p className="text-sm text-gray-400">
                Showing {filteredUsers.length} of {users.length} users
              </p>
              <button
                onClick={() => {
                  setFilters({ role: 'all' });
                  setSearchQuery('');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors ml-auto"
              >
                Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredUsers.map((user, index) => {
            const roleConfig = getRoleConfig(user.role);
            const RoleIcon = roleConfig.icon;
            const isCurrentUser = currentUser?.id === user.id;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group border-white/\[0.06\] bg-[#111318] hover:border-purple-500/30 transition-all">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          user.role === 'ADMIN' 
                            ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
                            : 'bg-gradient-to-br from-blue-400 to-cyan-400'
                        } shadow-lg ${
                          user.role === 'ADMIN' ? 'shadow-purple-500/30' : 'shadow-blue-500/30'
                        }`}>
                          <RoleIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                            {user.name}
                          </h3>
                          {isCurrentUser && (
                            <Badge className="bg-arcane/10 text-arcane border-emerald-500/30 mt-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              You
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Badge className={roleConfig.color}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {roleConfig.label}
                      </Badge>
                    </div>

                    {/* Email */}
                    <div className="mb-4 p-3 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">Email</p>
                      </div>
                      <p className="text-sm text-white font-medium truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 bg-gray-800/20 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">Created</p>
                        </div>
                        <p className="text-xs text-white font-medium">
                          {new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="p-2 bg-gray-800/20 rounded-lg">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">Updated</p>
                        </div>
                        <p className="text-xs text-white font-medium">
                          {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-800">
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-white/\[0.07\] hover:border-purple-500/50 hover:text-purple-400"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user)}
                        disabled={isCurrentUser}
                        variant="outline"
                        size="sm"
                        className={`border-gray-700 ${
                          isCurrentUser 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
            <Users className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || filters.role !== 'all'
              ? 'Tidak ada hasil'
              : 'Belum ada user'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery || filters.role !== 'all'
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Mulai dengan menambahkan admin pertama'}
          </p>
          {!searchQuery && filters.role === 'all' && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Admin
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <UserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${selectedUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
};

export default UsersPage;





