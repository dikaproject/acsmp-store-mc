import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  RefreshCw,
  Download,
  Server,
  Loader2,
  ChevronDown,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import toast from "react-hot-toast";
import axios from "axios";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import { formatCurrency } from "../../lib/utils";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [serverTypes, setServerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    serverType: 'all',
    dateRange: '30' // days
  });

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.serverType !== 'all' && { serverTypeId: filters.serverType })
      };

      const [ordersRes, serverTypesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/server-types`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setOrders(ordersRes.data.data);
      setPagination(ordersRes.data.pagination);
      setServerTypes(serverTypesRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status order berhasil diupdate");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Gagal update status");
    }
  };

  const handleCheckPayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/payment-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.data.status === 'PAID') {
        toast.success("Pembayaran sudah diterima!");
        fetchData();
      } else {
        toast.info(`Status pembayaran: ${response.data.data.status}`);
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      toast.error("Gagal cek status pembayaran");
    }
  };

  // Filter orders based on search
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.orderCode.toLowerCase().includes(searchLower) ||
      order.minecraftName.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower) ||
      order.whatsapp?.includes(searchQuery)
    );
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    paid: orders.filter(o => o.status === 'PAID').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    totalRevenue: orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
        label: 'Pending'
      },
      PAID: {
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: DollarSign,
        label: 'Paid'
      },
      PROCESSING: {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: RefreshCw,
        label: 'Processing'
      },
      COMPLETED: {
        color: 'bg-arcane/10 text-arcane border-emerald-500/30',
        icon: CheckCircle2,
        label: 'Completed'
      },
      FAILED: {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: XCircle,
        label: 'Failed'
      },
      EXPIRED: {
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: AlertCircle,
        label: 'Expired'
      }
    };
    return configs[status] || configs.PENDING;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Memuat orders...</p>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
          </div>
          <p className="text-gray-400 ml-13">
            Manage and track all customer orders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          <Button
            onClick={() => fetchData()}
            variant="outline"
            className="border-gray-700 hover:bg-white/\[0.07\]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
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
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Total Orders</p>
                <ShoppingCart className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">+12%</span>
              </div>
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
                <p className="text-xs text-gray-400">Pending</p>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
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
                <p className="text-xs text-gray-400">Paid</p>
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-blue-400">{stats.paid}</p>
              <p className="text-xs text-gray-500 mt-1">Processing</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Completed</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
              <p className="text-xs text-gray-500 mt-1">Success</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-white/\[0.06\] bg-[#111318] hover:border-gray-700 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400">Revenue</p>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-lg font-bold text-purple-400">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <Card className="border-white/\[0.06\] bg-[#111318]">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari order code, player, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1d24] border-gray-700/50 rounded-xl focus:border-blue-500/50"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer [&_option]:bg-[#1a1d24] [&_option]:text-white [color-scheme:dark]"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            {/* Server Type Filter */}
            <div className="md:col-span-3">
              <select
                value={filters.serverType}
                onChange={(e) => setFilters({ ...filters, serverType: e.target.value })}
                className="w-full px-3 py-2 bg-[#1a1d24] border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer [&_option]:bg-[#1a1d24] [&_option]:text-white [color-scheme:dark]"
              >
                <option value="all">All Servers</option>
                {serverTypes.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-1">
              <button className="w-full p-2 bg-white/\[0.03\] border border-gray-700/50 rounded-lg hover:bg-white/\[0.05\] transition-colors">
                <Calendar className="w-5 h-5 text-gray-400 mx-auto" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.status !== 'all' || filters.serverType !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <p className="text-sm text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              <button
                onClick={() => {
                  setFilters({ status: 'all', serverType: 'all', dateRange: '30' });
                  setSearchQuery('');
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors ml-auto"
              >
                Clear filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-white/\[0.06\] bg-[#111318]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800 bg-gray-800/20">
                <tr>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                <AnimatePresence>
                  {filteredOrders.map((order, index) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-white/\[0.07\]/20 transition-colors group"
                      >
                        {/* Order Code */}
                        <td className="p-4">
                          <div>
                            <p className="font-mono font-medium text-white group-hover:text-blue-400 transition-colors">
                              {order.orderCode}
                            </p>
                            {order.tripayReference && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Ref: {order.tripayReference}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
                              {order.minecraftName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">
                                {order.minecraftName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {order.email || order.whatsapp}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Server */}
                        <td className="p-4">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            <Server className="w-3 h-3 mr-1" />
                            {order.serverType?.name}
                          </Badge>
                        </td>

                        {/* Items */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-white">
                              {order.items?.length || 0} items
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-4">
                          <p className="font-bold text-white">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </td>

                        {/* Date */}
                        <td className="p-4">
                          <p className="text-sm text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleViewDetail(order)}
                              variant="outline"
                              size="sm"
                              className="border-gray-700 hover:bg-white/\[0.07\] hover:border-blue-500/50 hover:text-blue-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {order.status === 'PENDING' && (
                              <Button
                                onClick={() => handleCheckPayment(order.id)}
                                variant="outline"
                                size="sm"
                                className="border-gray-700 hover:bg-white/\[0.07\] hover:border-yellow-500/50 hover:text-yellow-400"
                                title="Check Payment"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}

                            {/* Quick Status Update */}
                            <div className="relative group/dropdown">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 hover:bg-white/\[0.07\]"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              
                              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10">
                                {['PAID', 'PROCESSING', 'COMPLETED', 'FAILED'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleUpdateStatus(order.id, status)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/\[0.07\] hover:text-white transition-colors"
                                  >
                                    Set as {status}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    variant="outline"
                    size="sm"
                    className="border-gray-700"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">
            {searchQuery || filters.status !== 'all' || filters.serverType !== 'all'
              ? 'Tidak ada hasil'
              : 'Belum ada order'}
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filters.status !== 'all' || filters.serverType !== 'all'
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Order akan muncul di sini setelah pelanggan melakukan pembelian'}
          </p>
        </motion.div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default OrdersPage;





