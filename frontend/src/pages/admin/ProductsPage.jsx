import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  Grid3x3,
  List,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Coins,
  Crown,
  Server,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ChevronDown,
  TrendingUp,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import ProductModal from "../../components/admin/ProductModal";
import DeleteConfirmModal from "../../components/admin/DeleteConfirmModal";
import { formatCurrency } from "../../lib/utils";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [serverTypes, setServerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // Filters
  const [filters, setFilters] = useState({
    serverType: 'all',
    type: 'all',
    isActive: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [productsRes, serverTypesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/server-types`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setProducts(productsRes.data.data);
      setServerTypes(serverTypesRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${selectedProduct.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product berhasil dihapus");
      fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus product");
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.serverType?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchServerType = filters.serverType === 'all' || product.serverTypeId === filters.serverType;
    const matchType = filters.type === 'all' || product.type === filters.type;
    const matchActive = filters.isActive === 'all' || product.isActive.toString() === filters.isActive;

    return matchSearch && matchServerType && matchType && matchActive;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    coins: products.filter(p => p.type === 'COIN').length,
    features: products.filter(p => p.type === 'FEATURE').length,
    ranks: products.filter(p => p.type === 'RANK').length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat products...</p>
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
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Products</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage coins and ranks for all server types
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
            Tambah Product
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total</p>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
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
                <p className="text-xs text-gray-400">Coins</p>
                <Coins className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.coins}</p>
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
                <p className="text-xs text-gray-400">Ranks</p>
                <Crown className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-orange-400">{stats.ranks}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total Value</p>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-blue-400">
                {formatCurrency(stats.totalValue)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card className="border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/30 border-gray-700/50 focus:border-purple-500/50"
              />
            </div>

            {/* Server Type Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.serverType}
                onChange={(e) => setFilters({ ...filters, serverType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Servers</option>
                {serverTypes.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="COIN">Coins</option>
                <option value="FEATURE">Features</option>
                <option value="RANK">Ranks</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="md:col-span-1 flex gap-2 bg-gray-800/30 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>

          {/* Active Filters Info */}
          {(filters.serverType !== 'all' || filters.type !== 'all' || filters.isActive !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <p className="text-sm text-gray-400">Showing {filteredProducts.length} of {products.length} products</p>
              <button
                onClick={() => {
                  setFilters({ serverType: 'all', type: 'all', isActive: 'all' });
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

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="group border-gray-800/50 bg-gradient-to-br from-[#13151a] to-[#0a0b0f] hover:border-purple-500/30 transition-all overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-800/50">
                    {product.imageUrl ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${
                        product.type === 'COIN'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : product.type === 'FEATURE'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>
                        {product.type === 'COIN' ? (
                          <>
                            <Coins className="w-3 h-3 mr-1" />
                            Coin
                          </>
                        ) : product.type === 'FEATURE' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Feature
                          </>
                        ) : (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Rank
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${
                        product.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    {/* Server Type */}
                    <div className="flex items-center gap-2 mb-2">
                      <Server className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400">{product.serverType?.name}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2 flex-1">
                      {product.description || 'No description'}
                    </p>

                    {/* Price & Amount */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Price</span>
                        <div className="text-right">
                          {product.discount > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                                  -{product.discount}%
                                </Badge>
                              </div>
                              <span className="text-sm font-bold text-green-400 block">
                                {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-purple-400">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {product.type === 'COIN' ? 'Coins' : product.type === 'FEATURE' ? 'Permission' : 'Group'}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {product.type === 'COIN' ? product.amount.toLocaleString() : product.type === 'FEATURE' ? product.permission : product.groupName}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleView(product)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 hover:bg-gray-800 hover:border-purple-500/50 hover:text-purple-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product)}
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
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Server</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Amount/Group</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800/50">
                          {product.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.imageUrl}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white max-w-xs truncate">{product.name}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          <Server className="w-3 h-3 mr-1" />
                          {product.serverType?.name}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${
                          product.type === 'COIN'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : product.type === 'FEATURE'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        }`}>
                          {product.type === 'COIN' ? (
                            <>
                              <Coins className="w-3 h-3 mr-1" />
                              Coin
                            </>
                          ) : product.type === 'FEATURE' ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Feature
                            </>
                          ) : (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Rank
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-left">
                          {product.discount > 0 ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </span>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  -{product.discount}%
                                </Badge>
                              </div>
                              <p className="font-bold text-green-400">
                                {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                              </p>
                            </div>
                          ) : (
                            <p className="font-bold text-purple-400">{formatCurrency(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-white">
                          {product.type === 'COIN' ? product.amount.toLocaleString() : product.type === 'FEATURE' ? product.permission : product.groupName}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge className={`${
                          product.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleView(product)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 hover:text-blue-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:bg-gray-800 hover:border-purple-500/50 hover:text-purple-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(product)}
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
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || filters.serverType !== 'all' || filters.type !== 'all' || filters.isActive !== 'all'
              ? 'Tidak ada hasil'
              : 'Belum ada product'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery || filters.serverType !== 'all' || filters.type !== 'all' || filters.isActive !== 'all'
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Mulai dengan menambahkan product pertama'}
          </p>
          {!searchQuery && filters.serverType === 'all' && filters.type === 'all' && filters.isActive === 'all' && (
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Product
            </Button>
          )}
        </motion.div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        product={selectedProduct}
        serverTypes={serverTypes}
        onSuccess={fetchData}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Hapus Product"
        message={`Apakah Anda yakin ingin menghapus product "${selectedProduct?.name}"?`}
      />
    </div>
  );
};

export default ProductsPage;