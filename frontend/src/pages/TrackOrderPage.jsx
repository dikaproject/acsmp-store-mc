import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  CreditCard,
  Truck,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  User,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { GridPattern } from "../components/ui/GridPattern";
import { orderAPI } from "../lib/api";
import { formatCurrency, formatDate, getImageUrl } from "../lib/utils";
import toast from "react-hot-toast";

const TrackOrderPage = () => {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      toast.error("Masukkan kode pesanan");
      return;
    }

    setLoading(true);
    setNotFound(false);
    
    try {
      const response = await orderAPI.getByCode(orderCode.trim());
      setOrder(response.data.data);
      setNotFound(false);
    } catch (error) {
      console.error("Error tracking order:", error);
      setOrder(null);
      setNotFound(true);
      toast.error("Pesanan tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      const response = await orderAPI.getByCode(order.orderCode);
      setOrder(response.data.data);
      toast.success("Status pesanan diperbarui");
    } catch (error) {
      console.error("Error refreshing order:", error);
      toast.error("Gagal memperbarui status");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icon: Clock,
        label: "Menunggu Pembayaran",
        description: "Silakan selesaikan pembayaran Anda"
      },
      PAID: {
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: CreditCard,
        label: "Dibayar",
        description: "Pembayaran berhasil diterima"
      },
      PROCESSING: {
        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        icon: Truck,
        label: "Diproses",
        description: "Pesanan sedang diproses"
      },
      COMPLETED: {
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: CheckCircle2,
        label: "Selesai",
        description: "Pesanan telah selesai"
      },
      FAILED: {
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        icon: XCircle,
        label: "Gagal",
        description: "Pembayaran gagal"
      },
      EXPIRED: {
        color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        icon: AlertCircle,
        label: "Kadaluarsa",
        description: "Waktu pembayaran habis"
      }
    };

    return configs[status] || configs.PENDING;
  };

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        status: "PENDING",
        label: "Pesanan Dibuat",
        date: order.createdAt,
        active: true
      },
      {
        status: "PAID",
        label: "Pembayaran Diterima",
        date: order.paidAt,
        active: order.status !== "PENDING" && order.status !== "FAILED" && order.status !== "EXPIRED"
      },
      {
        status: "PROCESSING",
        label: "Sedang Diproses",
        date: order.paidAt,
        active: order.status === "PROCESSING" || order.status === "COMPLETED"
      },
      {
        status: "COMPLETED",
        label: "Selesai",
        date: order.status === "COMPLETED" ? order.updatedAt : null,
        active: order.status === "COMPLETED"
      }
    ];

    return timeline;
  };

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
          <GridPattern />
        </div>
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-full mb-6"
            >
              <Package className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-400 font-medium">Order Tracking</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Lacak Pesanan
              <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Real-time
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10">
              Masukkan kode pesanan untuk melacak status pembelian Anda secara real-time
            </p>

            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
            >
              <SpotlightCard 
                className="rounded-2xl"
                spotlightColor="rgba(99, 102, 241, 0.15)"
              >
                <div className="relative bg-[#0a0b0f] border border-indigo-500/20 rounded-2xl p-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Masukkan kode pesanan (Contoh: ORD-1234567890-ABCDE)"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value)}
                      className="pl-12 pr-36 py-6 text-lg bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-500"
                    />
                    <Button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          Lacak
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SpotlightCard>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* Not Found State */}
            {notFound && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md mx-auto"
              >
                <SpotlightCard 
                  className="rounded-2xl"
                  spotlightColor="rgba(239, 68, 68, 0.15)"
                >
                  <div className="text-center p-12 bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-red-500/20">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pesanan Tidak Ditemukan</h3>
                    <p className="text-gray-400 mb-6">
                      Periksa kembali kode pesanan Anda atau hubungi customer service
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setNotFound(false)}
                      className="border-red-500/30 hover:bg-red-500/10"
                    >
                      Coba Lagi
                    </Button>
                  </div>
                </SpotlightCard>
              </motion.div>
            )}

            {/* Order Details */}
            {order && (
              <motion.div
                key="order-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                {/* Status Hero Card */}
                <SpotlightCard 
                  className="rounded-2xl"
                  spotlightColor={
                    order.status === 'COMPLETED' ? "rgba(16, 185, 129, 0.2)" :
                    order.status === 'PENDING' ? "rgba(251, 191, 36, 0.2)" :
                    order.status === 'FAILED' ? "rgba(239, 68, 68, 0.2)" :
                    "rgba(99, 102, 241, 0.2)"
                  }
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-indigo-500/20">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      order.status === 'COMPLETED' ? 'from-emerald-500/5' :
                      order.status === 'PENDING' ? 'from-amber-500/5' :
                      order.status === 'FAILED' ? 'from-red-500/5' :
                      'from-indigo-500/5'
                    } to-transparent opacity-50`} />
                    
                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-6">
                          <div className={`w-20 h-20 rounded-2xl ${getStatusConfig(order.status).color} flex items-center justify-center shadow-xl`}>
                            {(() => {
                              const StatusIcon = getStatusConfig(order.status).icon;
                              return <StatusIcon className="w-10 h-10" />;
                            })()}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                              {getStatusConfig(order.status).label}
                            </h2>
                            <p className="text-gray-400 text-lg">
                              {getStatusConfig(order.status).description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={loading}
                          className="border-indigo-500/30 hover:bg-indigo-500/10"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>

                    {/* Order Info Grid */}
                    <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-indigo-500/20">
                      <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ShoppingBag className="w-4 h-4 text-indigo-400" />
                          <p className="text-xs text-gray-500 uppercase">Kode Pesanan</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-bold text-white text-sm">{order.orderCode}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order.orderCode)}
                            className="h-6 w-6 p-0 hover:bg-indigo-500/10"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-indigo-400" />
                          <p className="text-xs text-gray-500 uppercase">Server Type</p>
                        </div>
                        <p className="font-semibold text-white">{order.serverType.name}</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-black/40 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          <p className="text-xs text-gray-500 uppercase">Minecraft Name</p>
                        </div>
                        <p className="font-semibold text-white">{order.minecraftName}</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-indigo-400" />
                          <p className="text-xs text-gray-500 uppercase">Total</p>
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Payment URL for PENDING orders */}
                    {order.status === "PENDING" && order.paymentUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white text-lg mb-1 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-amber-400" />
                              Selesaikan Pembayaran
                            </p>
                            <p className="text-sm text-gray-400">
                              Kadaluarsa: {formatDate(order.expiredAt)}
                            </p>
                          </div>
                          <a href={order.paymentUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30">
                              Bayar Sekarang
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </a>
                        </div>
                      </motion.div>
                    )}
                    </div>
                  </div>
                </SpotlightCard>

                {/* Timeline & Order Items - Side by Side */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <SpotlightCard 
                    className="rounded-2xl"
                    spotlightColor="rgba(16, 185, 129, 0.15)"
                  >
                    <div className="p-8 bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-emerald-500/20">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Status Timeline
                      </h3>
                      <div className="space-y-6">
                        {getOrderTimeline(order).map((step, index) => (
                          <motion.div
                            key={step.status}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className="relative flex flex-col items-center">
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  step.active
                                    ? "bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30"
                                    : "bg-gray-800/50 border-2 border-gray-700"
                                }`}
                              >
                                {step.active ? (
                                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                                )}
                              </div>
                              {index < getOrderTimeline(order).length - 1 && (
                                <div
                                  className={`w-0.5 h-16 mt-2 ${
                                    step.active ? "bg-gradient-to-b from-emerald-500/50 to-transparent" : "bg-gray-700/50"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <h4 className={`font-semibold mb-1 ${step.active ? "text-white" : "text-gray-500"}`}>
                                {step.label}
                              </h4>
                              {step.date && (
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(step.date)}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>

                  {/* Order Items */}
                  <SpotlightCard 
                    className="rounded-2xl"
                    spotlightColor="rgba(99, 102, 241, 0.15)"
                  >
                    <div className="p-8 bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-indigo-500/20">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6">
                        <ShoppingBag className="w-5 h-5 text-indigo-400" />
                        Detail Pesanan
                      </h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {item.product.imageUrl && (
                                <img
                                  src={getImageUrl(item.product.imageUrl)}
                                  alt={item.product.name}
                                  className="w-14 h-14 rounded-lg object-cover border border-indigo-500/20"
                                />
                              )}
                              <div>
                                <h4 className="font-semibold text-white">{item.product.name}</h4>
                                <p className="text-sm text-gray-400">
                                  {item.quantity}x • {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold text-indigo-400">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </motion.div>
                        ))}

                        {/* Total */}
                        <div className="pt-4 border-t border-indigo-500/20">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-white">Total Pembayaran</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Contact Support */}
                <SpotlightCard 
                  className="rounded-2xl"
                  spotlightColor="rgba(99, 102, 241, 0.2)"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-[#0a0b0f] to-purple-500/10 rounded-2xl border border-indigo-500/30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
                    <div className="relative p-8 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-indigo-500/20 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <MessageCircle className="w-10 h-10 text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Butuh Bantuan?</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Join Discord kami untuk bantuan langsung dari tim support dan komunitas aktif
                      </p>
                      <a 
                        href="https://discord.com/invite/nexus-cloud" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Join Discord Server
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Support 24/7
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                          Komunitas aktif
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                          Event & Giveaway
                        </span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )}

            {/* Initial State */}
            {!order && !notFound && !loading && (
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
              >
                <SpotlightCard 
                  className="rounded-2xl"
                  spotlightColor="rgba(99, 102, 241, 0.15)"
                >
                  <div className="p-12 text-center bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-indigo-500/20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                      <Package className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Lacak Pesanan Anda
                    </h3>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                      Masukkan kode pesanan yang Anda terima via email atau WhatsApp untuk melacak status pesanan secara real-time
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      {[
                        { icon: Clock, label: "Status Real-time", desc: "Pantau status pesanan secara langsung", color: "indigo" },
                        { icon: CreditCard, label: "Info Pembayaran", desc: "Detail pembayaran yang jelas", color: "purple" },
                        { icon: Package, label: "Detail Pesanan", desc: "Rincian produk yang dibeli", color: "pink" },
                        { icon: CheckCircle2, label: "Timeline Lengkap", desc: "Histori perjalanan pesanan", color: "emerald" }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-5 rounded-xl bg-black/40 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center flex-shrink-0`}>
                            <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-1">{feature.label}</h4>
                            <p className="text-sm text-gray-400">{feature.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default TrackOrderPage;