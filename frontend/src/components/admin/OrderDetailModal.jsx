import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Server,
  Package,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Copy,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatCurrency, getImageUrl } from "../../lib/utils";
import toast from "react-hot-toast";

const OrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus, onRefresh }) => {
  if (!isOpen || !order) return null;

  const getProductSummary = (product) => {
    if (!product) return '-';
    if (product.type === 'COIN') return `${product.amount.toLocaleString('id-ID')} Coins`;
    if (product.type === 'MONEY') return `${product.amount.toLocaleString('id-ID')} Money`;
    if (product.type === 'FEATURE') return `Feature: ${product.permission || '-'}`;
    if (product.type === 'RANK') return `Rank: ${product.groupName || '-'}`;
    return `${product.amount.toLocaleString('id-ID')} hari`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: Clock,
        label: 'Pending Payment'
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

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

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
            <div className="sticky top-0 bg-[#13151a] border-b border-white/\[0.06\] p-6 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-gray-400">{order.orderCode}</p>
                    <button
                      onClick={() => copyToClipboard(order.orderCode)}
                      className="p-1 hover:bg-white/\[0.07\] rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/\[0.07\] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                    <p className="text-xs text-gray-400 mb-1">Minecraft Name</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{order.minecraftName}</p>
                      <button
                        onClick={() => copyToClipboard(order.minecraftName)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {order.email && (
                    <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-white">{order.email}</p>
                      </div>
                    </div>
                  )}

                  {order.whatsapp && (
                    <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">WhatsApp</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-white">{order.whatsapp}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                    <p className="text-xs text-gray-400 mb-1">Server Type</p>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      <Server className="w-3 h-3 mr-1" />
                      {order.serverType?.name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {item.product?.imageUrl && (
                          <img
                            src={getImageUrl(item.product.imageUrl)}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-white">{item.product?.name}</p>
                          <p className="text-sm text-gray-400">
                            {getProductSummary(item.product)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">x{item.quantity}</p>
                        <p className="font-bold text-white">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Total Amount</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {order.tripayReference && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-1">Payment Reference</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-white">{order.tripayReference}</p>
                        <button
                          onClick={() => copyToClipboard(order.tripayReference)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {order.tripayMethod && (
                      <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                        <p className="font-medium text-white uppercase">{order.tripayMethod}</p>
                      </div>
                    )}

                    {order.paymentUrl && (
                      <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Payment URL</p>
                        <a
                          href={order.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          <span>Open Payment Page</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {order.expiredAt && (
                      <div className="p-4 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Payment Expires</p>
                        <p className="text-sm text-white">
                          {new Date(order.expiredAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="text-sm text-white">
                        {new Date(order.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {order.paidAt && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div className="flex-1">
                        <p className="text-xs text-emerald-400">Paid</p>
                        <p className="text-sm text-white">
                          {new Date(order.paidAt).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-white/\[0.03\] rounded-lg border border-gray-700/50">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Last Updated</p>
                      <p className="text-sm text-white">
                        {new Date(order.updatedAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-700 hover:bg-white/\[0.07\]"
                >
                  Close
                </Button>

                {order.status === 'PAID' && (
                  <Button
                    onClick={() => {
                      onUpdateStatus(order.id, 'COMPLETED');
                      onClose();
                    }}
                    className="bg-arcane"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}

                {order.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={() => {
                        onUpdateStatus(order.id, 'PAID');
                        onClose();
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button
                      onClick={() => {
                        onUpdateStatus(order.id, 'FAILED');
                        onClose();
                      }}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark as Failed
                    </Button>
                  </>
                )}

                <Button
                  onClick={() => {
                    onRefresh();
                    toast.success("Order refreshed");
                  }}
                  variant="outline"
                  className="border-gray-700 hover:bg-white/\[0.07\] ml-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailModal;





