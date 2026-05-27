import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ArrowLeft,
  Package,
  AlertCircle,
  Sparkles,
  CreditCard,
  Shield
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { GridPattern } from "../components/ui/GridPattern";
import { useCartStore } from "../store/useCartStore";
import { formatCurrency, getImageUrl } from "../lib/utils";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ink pt-20 pb-16 flex items-center justify-center">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.03)_0%,transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center p-12 bg-ink-elevated border border-ink-border">
              <div className="w-20 h-20 mx-auto mb-6 bg-arcane/5 border border-arcane/30 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-arcane/50" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Keranjang Kosong</h2>
              <p className="text-gray-400 mb-8">
                Belum ada produk di keranjang belanja Anda
              </p>
              <Link to="/shop">
                <Button className="bg-arcane text-bone hover:bg-arcane-glow">
                  <Package className="w-4 h-4 mr-2" />
                  Mulai Belanja
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink pt-20 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.03)_0%,transparent_60%)]" />
      </div>


      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/shop">
            <Button variant="ghost" className="mb-6 hover:bg-arcane/5 border border-ink-border text-bone-muted hover:text-bone">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Shop
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Keranjang{" "}
                <span className="text-arcane">
                  Belanja
                </span>
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {items.length} produk di keranjang
              </p>
            </div>
            <Badge className="bg-arcane/10 text-arcane border-arcane/20 px-4 py-2 w-fit">
              <Sparkles className="w-4 h-4 mr-2" />
              Total: {formatCurrency(getTotalPrice())}
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="relative overflow-hidden bg-ink-elevated border border-ink-border rounded-2xl hover:border-arcane/20 transition-all">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-arcane/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    
                    <div className="relative p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border border-ink-border">
                          <img
                            src={getImageUrl(item.imageUrl)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-white mb-2">{item.name}</h3>
                              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                {item.description}
                              </p>
                              <Badge className="bg-arcane/10 text-arcane border-arcane/20">
                                {item.ServerType?.name || item.serverType?.name}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity & Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-ink-border">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || item._isUpgrade}
                                className="border-ink-border hover:bg-arcane/5 disabled:opacity-50 text-bone"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-16 text-center font-bold text-lg text-white">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item._isUpgrade}
                                className="border-ink-border hover:bg-arcane/5 text-bone disabled:opacity-40"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              {item._isUpgrade ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-end gap-2">
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs px-1.5 py-0">
                                      UPGRADE
                                    </Badge>
                                  </div>
                                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    {formatCurrency(item._upgradePrice * item.quantity)}
                                  </p>
                                  <p className="text-xs text-blue-400">
                                    Selisih dari rank {item._currentRankName}
                                  </p>
                                </div>
                              ) : item.discount > 0 ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-end gap-2">
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-1.5 py-0">
                                      -{item.discount}%
                                    </Badge>
                                  </div>
                                  <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    {formatCurrency(Math.floor((item.price - (item.price * item.discount / 100)) * item.quantity))}
                                  </p>
                                  <p className="text-xs text-green-400">
                                    Hemat {formatCurrency(Math.floor(item.price * item.discount / 100 * item.quantity))}
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs text-gray-500 mb-1">
                                    {formatCurrency(item.price)} x {item.quantity}
                                  </p>
                                  <p className="text-2xl font-bold text-arcane">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: items.length * 0.05 }}
            >
              <Button
                variant="ghost"
                onClick={clearCart}
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Kosongkan Keranjang
              </Button>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="relative overflow-hidden bg-ink-elevated border border-ink-border rounded-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,165,116,0.03),transparent_70%)]" />
                
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-arcane" />
                    Ringkasan Pesanan
                  </h3>

                  {/* Items Summary */}
                  <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                    {items.map((item) => {
                      const finalPrice = item._isUpgrade
                        ? item._upgradePrice
                        : item.discount > 0
                          ? Math.floor(item.price - (item.price * item.discount / 100))
                          : item.price;
                      const subtotal = finalPrice * item.quantity;
                      
                      return (
                        <div key={item.id} className="p-3 rounded-lg bg-ink/40 border border-ink-border">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm text-gray-400 flex-1">
                              {item.name} <span className="text-arcane">x{item.quantity}</span>
                            </span>
                            <span className="font-medium text-white ml-2">
                              {formatCurrency(subtotal)}
                            </span>
                          </div>
                          {item._isUpgrade ? (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs px-1.5 py-0">
                                UPGRADE
                              </Badge>
                              <span className="text-xs text-gray-500 line-through">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ) : item.discount > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs px-1.5 py-0">
                                -{item.discount}%
                              </Badge>
                              <span className="text-xs text-gray-500 line-through">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-ink-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-bone-muted">Subtotal ({items.length} item)</span>
                      <span className="font-medium text-white">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Biaya Admin</span>
                      <span className="font-medium text-arcane">Gratis</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-4 border-t border-ink-border">
                      <span className="text-bone">Total</span>
                      <span className="text-arcane">
                        {formatCurrency(getTotalPrice())}
                      </span>
                    </div>
                  </div>

                  {/* Info Alerts */}
                  <div className="space-y-3 my-6">
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                      <Shield className="w-4 h-4 text-blue-400/70 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-400/70">
                        Pembayaran aman melalui <strong>Tripay</strong>
                      </p>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-arcane/5 border border-arcane/10">
                      <CreditCard className="w-4 h-4 text-arcane/70 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-arcane/70">
                        Berbagai metode pembayaran tersedia
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full shadow-lg shadow-arcane/20 group mb-3"
                    size="lg"
                  >
                    Lanjut ke Checkout
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Link to="/shop">
                    <Button variant="outline" className="w-full">
                      Lanjut Belanja
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 165, 116, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 165, 116, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 165, 116, 0.3);
        }
      `}</style>
    </div>
  );
};

export default CartPage;