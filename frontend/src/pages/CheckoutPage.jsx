import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  GamepadIcon,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Shield,
  ShoppingBag
} from "lucide-react";
import Flag from "react-world-flags";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { GridPattern } from "../components/ui/GridPattern";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatCurrency, getImageUrl } from "../lib/utils";
import toast from "react-hot-toast";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { minecraftName } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [paymentChannels, setPaymentChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  
  const [contactInfo, setContactInfo] = useState({
    email: "",
    whatsapp: ""
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    if (!minecraftName) {
      toast.error("Anda harus login terlebih dahulu");
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    fetchPaymentChannels();
  }, [items, navigate, minecraftName]);

  const fetchPaymentChannels = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/payment-channels`
      );
      setPaymentChannels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching payment channels:", error);
      toast.error("Gagal memuat metode pembayaran");
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleInputChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactInfo.whatsapp || !selectedPaymentMethod) {
      toast.error("Lengkapi nomor WhatsApp dan pilih metode pembayaran");
      return;
    }

    const waRegex = /^(\+?62|0)[0-9]{9,12}$/;
    if (!waRegex.test(contactInfo.whatsapp.replace(/\s/g, ''))) {
      toast.error("Format nomor WhatsApp tidak valid");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("Sesi login berakhir, silakan login kembali");
        navigate('/login');
        return;
      }

      const orderData = {
        minecraftName: minecraftName,
        email: contactInfo.email || null,
        whatsapp: contactInfo.whatsapp,
        serverTypeId: items[0].serverTypeId,
        paymentMethod: selectedPaymentMethod,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        const { payment, orderCode } = response.data.data;
        
        clearCart();
        
        toast.success("Pesanan berhasil dibuat! Mengarahkan ke halaman pembayaran...", {
          duration: 2000
        });

        setTimeout(() => {
          if (payment?.checkout_url) {
            window.location.href = payment.checkout_url;
          } else {
            toast.error("URL pembayaran tidak tersedia");
            navigate(`/track?code=${orderCode}`);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Gagal membuat pesanan");
      setLoading(false); 
    }
  };

  const groupedChannels = paymentChannels.reduce((acc, channel) => {
    const group = channel.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(channel);
    return acc;
  }, {});

  const getGroupIcon = (group) => {
    const icons = {
      'E-Wallet': '💳',
      'Virtual Account': '🏦',
      'Convenience Store': '🏪',
      'QRIS': '📱'
    };
    return icons[group] || '💰';
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      {/* Subtle animated orb */}
      <motion.div
        className="fixed top-20 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/5 backdrop-blur-xl border border-purple-500/20 rounded-full mb-6"
          >
            <CreditCard className="w-4 h-4 text-purple-400/70" />
            <span className="text-sm text-purple-400/70 font-medium">Checkout</span>
            <Sparkles className="w-4 h-4 text-purple-400/70" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Selesaikan{" "}
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Pembelian
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Lengkapi data dan pilih metode pembayaran yang Anda inginkan
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-8 bg-black/60 backdrop-blur-xl rounded-2xl border border-purple-500/10">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Data Pembeli
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Pastikan data yang Anda masukkan sudah benar
                  </p>
                  <div className="space-y-5">
                    {/* Minecraft Name */}
                    <div>
                      <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <GamepadIcon className="w-4 h-4 text-purple-400" />
                        Minecraft Name
                      </label>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-purple-400">{minecraftName}</p>
                          <p className="text-xs text-purple-400/70">
                            Item akan dikirim ke karakter ini
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-400" />
                        WhatsApp <span className="text-red-400">*</span>
                      </label>
                      <Input
                        name="whatsapp"
                        type="tel"
                        placeholder="08123456789 atau +628123456789"
                        value={contactInfo.whatsapp}
                        onChange={handleInputChange}
                        required
                        className="bg-black/40 border-purple-500/20 focus:border-purple-500/40 text-white placeholder:text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Untuk konfirmasi pesanan dan notifikasi pembayaran
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-400" />
                        Email (Wajib)
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={contactInfo.email}
                        onChange={handleInputChange}
                        className="bg-black/40 border-purple-500/20 focus:border-purple-500/40 text-white placeholder:text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Email untuk notifikasi pembayaran
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-8 bg-black/60 backdrop-blur-xl rounded-2xl border border-purple-500/10">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    Metode Pembayaran <span className="text-red-400">*</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Pilih metode pembayaran yang Anda inginkan
                  </p>
                  
                  {/* Malaysia Payment Info */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0 overflow-hidden">
                        <Flag code="MY" className="w-8 h-8 object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-blue-400 mb-1">
                          Info untuk Player Malaysia
                        </h4>
                        <p className="text-xs text-blue-300/80 leading-relaxed">
                          Jika kamu dari <span className="font-semibold text-blue-300">Malaysia</span>, silakan pilih metode pembayaran <span className="font-semibold text-blue-300">QRIS</span> dan gunakan aplikasi <span className="font-semibold text-blue-300">Touch 'n Go (TNG) eWallet</span> untuk melakukan pembayaran.
                        </p>
                      </div>
                    </div>
                  </div>

                  {loadingChannels ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedChannels).map(([group, channels]) => (
                        <div key={group}>
                          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="text-xl">{getGroupIcon(group)}</span>
                            {group}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {channels.map((channel) => {
                              const isSelected = selectedPaymentMethod === channel.code;
                              const isActive = channel.active;
                              
                              return (
                                <motion.button
                                  key={channel.code}
                                  type="button"
                                  onClick={() => isActive && setSelectedPaymentMethod(channel.code)}
                                  disabled={!isActive}
                                  whileHover={isActive ? { scale: 1.03 } : {}}
                                  whileTap={isActive ? { scale: 0.98 } : {}}
                                  className={`relative p-4 rounded-xl border-2 transition-all ${
                                    isSelected
                                      ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                                      : isActive
                                      ? 'border-purple-500/20 hover:border-purple-500/30 bg-black/40'
                                      : 'border-gray-800 bg-black/20 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="flex flex-col items-center text-center gap-3">
                                    {channel.icon_url ? (
                                      <img
                                        src={channel.icon_url}
                                        alt={channel.name}
                                        className="w-12 h-12 object-contain"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-purple-400" />
                                      </div>
                                    )}
                                    
                                    <div className="w-full">
                                      <p className="font-medium text-sm text-white mb-1">{channel.name}</p>
                                      {channel.total_fee?.flat > 0 && (
                                        <p className="text-xs text-amber-400">
                                          +{formatCurrency(channel.total_fee.flat)}
                                        </p>
                                      )}
                                      {!isActive && (
                                        <Badge variant="secondary" className="mt-1 text-xs">
                                          Unavailable
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {isSelected && (
                                      <CheckCircle2 className="w-5 h-5 text-purple-400 absolute top-2 right-2" />
                                    )}
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                <div className="relative overflow-hidden bg-black/60 backdrop-blur-xl rounded-2xl border border-purple-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.03),transparent_70%)]" />
                  
                  <div className="relative p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-400" />
                      Ringkasan Pesanan
                    </h3>
                    {/* Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar mb-6">
                      {items.map((item) => {
                        const finalPrice = item.discount > 0 
                          ? Math.floor(item.price - (item.price * item.discount / 100))
                          : item.price;
                        
                        return (
                          <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-black/40 border border-purple-500/10">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover border border-purple-500/20"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{item.name}</p>
                              {item.discount > 0 ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-1.5 py-0">
                                      -{item.discount}%
                                    </Badge>
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatCurrency(item.price)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-green-400">
                                    {item.quantity}x • {formatCurrency(finalPrice)}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-400">
                                  {item.quantity}x • {formatCurrency(item.price)}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Summary */}
                    <div className="border-t border-purple-500/10 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="font-medium text-white">{formatCurrency(getTotalPrice())}</span>
                      </div>
                      {selectedPaymentMethod && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Biaya Admin</span>
                          <span className="font-medium text-amber-400">
                            {(() => {
                              const channel = paymentChannels.find(c => c.code === selectedPaymentMethod);
                              const fee = channel?.total_fee?.flat || 0;
                              return fee > 0 ? `+ ${formatCurrency(fee)}` : 'Gratis';
                            })()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-purple-500/10">
                        <span className="text-white">Total</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                          {(() => {
                            const channel = paymentChannels.find(c => c.code === selectedPaymentMethod);
                            const fee = channel?.total_fee?.flat || 0;
                            return formatCurrency(getTotalPrice() + fee);
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 my-6">
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <AlertCircle className="w-4 h-4 text-blue-400/70 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-400/70">
                          <p className="font-medium mb-1">Catatan Penting:</p>
                          <ul className="space-y-1">
                            <li>• Pembayaran via Tripay</li>
                            <li>• Selesaikan dalam 24 jam</li>
                            <li>• Item ke <strong>{minecraftName}</strong></li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                        <Shield className="w-4 h-4 text-purple-400/70 flex-shrink-0" />
                        <p className="text-xs text-purple-400/70 font-medium">
                          Pembayaran aman & terenkripsi
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading || !selectedPaymentMethod || !contactInfo.whatsapp}
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 group"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          Bayar Sekarang
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;