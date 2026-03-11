import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, Filter, Sparkles, Tag, TrendingUp, Zap, 
  Star, Package, Clock, ChevronLeft, ChevronRight, Info, X,
  CheckCircle, Command, Gift, Shield, Lock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import SpotlightCard from "../components/ui/SpotlightCard";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { productAPI, serverTypeAPI } from "../lib/api";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatCurrency, getImageUrl } from "../lib/utils";
import toast from "react-hot-toast";

// Optimized Image Component with lazy loading
const ProductImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black">
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-12 h-12 text-gray-600" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

// Modal Component untuk Rank Details
const RankDetailModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="relative bg-black/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="relative p-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                          product.type === 'FEATURE' 
                            ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30'
                            : 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30'
                        }`}>
                          {product.type === 'FEATURE' ? (
                            <Shield className="w-6 h-6 text-purple-400" />
                          ) : (
                            <TrendingUp className="w-6 h-6 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white">
                            {product.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`border-0 ${
                              product.type === 'FEATURE'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {product.type === 'FEATURE' ? 'Feature' : 'Rank'}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-400 border-0">
                              {product.ServerType?.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 max-h-[calc(90vh-250px)] overflow-y-auto custom-scrollbar space-y-6">
                  
                  {/* Benefits Section */}
                  {product.benefits && Array.isArray(product.benefits) && product.benefits.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                          <Gift className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Benefits</h3>
                      </div>
                      
                      <div className="grid gap-3">
                        {product.benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-300 leading-relaxed">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commands Section */}
                  {product.infoCommands && Array.isArray(product.infoCommands) && product.infoCommands.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                          <Command className="w-4 h-4 text-violet-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Commands yang Tersedia</h3>
                      </div>
                      
                      <div className="grid gap-2">
                        {product.infoCommands.map((command, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 font-mono text-sm text-violet-300"
                          >
                            {command}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Group Name (for RANK) */}
                  {product.groupName && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                          <Tag className="w-4 h-4 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Group Name</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <code className="text-orange-300 font-mono">{product.groupName}</code>
                      </div>
                    </div>
                  )}

                  {/* Permission (for FEATURE) */}
                  {product.permission && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                          <Shield className="w-4 h-4 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Permission Node</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <code className="text-purple-300 font-mono">{product.permission}</code>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  {product.amount && product.type !== 'COIN' && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                          <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Duration</h3>
                      </div>
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <span className="text-cyan-300 font-bold">{product.amount} Hari</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      {product.discount > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.price)}
                            </span>
                            <Badge className="bg-green-500/20 text-green-400 border-0">
                              -{product.discount}%
                            </Badge>
                          </div>
                          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                          </p>
                          <p className="text-xs text-green-400">
                            Hemat {formatCurrency(Math.floor(product.price * product.discount / 100))}
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold rounded-xl"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [serverTypes, setServerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState(searchParams.get("server") || "all");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { isUserLoggedIn, serverTypeId: userServerTypeId } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, [selectedServer, selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, serverRes] = await Promise.all([
        productAPI.getAll({
          serverTypeId: selectedServer !== "all" ? selectedServer : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        }),
        serverTypeAPI.getAll(),
      ]);

      setProducts(productsRes.data.data || []);
      setServerTypes(serverRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleServerChange = useCallback((serverId) => {
    setSelectedServer(serverId);
    setCurrentPage(1);
    if (serverId === "all") {
      searchParams.delete("server");
    } else {
      searchParams.set("server", serverId);
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const isProductLocked = useCallback((product) => {
    if (!isUserLoggedIn || !userServerTypeId) return false;
    return String(product.serverTypeId) !== String(userServerTypeId);
  }, [isUserLoggedIn, userServerTypeId]);

  const userServerName = serverTypes.find(s => String(s.id) === String(userServerTypeId))?.name;

  const handleAddToCart = useCallback((product) => {
    if (isProductLocked(product)) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Tidak bisa menambahkan produk</span>
          <span className="text-xs opacity-80">
            Kamu login di server <strong>{userServerName}</strong>, produk ini untuk server <strong>{product.ServerType?.name}</strong>
          </span>
        </div>
      );
      return;
    }
    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>{product.name} ditambahkan ke keranjang!</span>
      </div>
    );
  }, [addItem, isProductLocked, userServerName]);

  const handleShowDetail = useCallback((product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const categories = [
    { value: "all", label: "Semua Produk", icon: Tag },
    { value: "coin", label: "Coins", icon: Sparkles },
    { value: "feature", label: "Features", icon: Shield },
    { value: "rank", label: "Ranks", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Rank Detail Modal */}
      <RankDetailModal
        product={selectedProduct}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(139,92,246,0.5), rgba(168, 85, 247, 0.5));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(139,92,246,0.7), rgba(168, 85, 247, 0.7));
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
        
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-full mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 uppercase tracking-wider">
                Premium Shop
              </span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400">Premium Collection</span>
            </h1>
            
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Tingkatkan pengalaman bermainmu dengan koleksi premium kami
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 relative z-10 pb-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative p-4 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-4 py-3 bg-transparent border-0 text-white placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Server Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" />
              Server Type
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleServerChange("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedServer === "all"
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                All Servers
              </button>
              {serverTypes.map((server) => (
                <button
                  key={server.id}
                  onClick={() => handleServerChange(server.id.toString())}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedServer === server.id.toString()
                      ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === category.value
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Info Notice - Rank Upgrade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                <Info className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-amber-400 mb-1.5">
                  💎 Ingin Upgrade Rank?
                </h4>
                <p className="text-sm text-amber-300/80 leading-relaxed">
                  Jika kamu ingin <span className="font-semibold text-amber-300">upgrade rank</span>, silakan hubungi <span className="font-semibold text-amber-300">Admin</span> melalui Discord atau WhatsApp. Kamu hanya perlu membayar selisih harganya, tidak perlu membayar penuh.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Server Lock Notice */}
          {isUserLoggedIn && userServerTypeId && userServerName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-cyan-400 mb-1.5">
                    🎮 Server: {userServerName}
                  </h4>
                  <p className="text-sm text-cyan-300/80 leading-relaxed">
                    Kamu sedang berbelanja untuk server <span className="font-semibold text-cyan-300">{userServerName}</span>. Produk dari server lain tidak bisa ditambahkan ke keranjang. Untuk membeli produk server lain, silakan logout dan login ulang dengan memilih server yang sesuai.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-purple-500/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div id="products-grid">
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all"
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden">
                    <ProductImage
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    {/* Server Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/60 backdrop-blur-sm border-white/20 text-white">
                        {product.ServerType?.name || "Server"}
                      </Badge>
                    </div>

                    {/* Info Button for Ranks and Features - Changed to white/cyan */}
                    {(product.type === 'RANK' || product.type === 'FEATURE') && (
                      <button
                        onClick={() => handleShowDetail(product)}
                        className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors group/btn"
                      >
                        <Info className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col min-h-[280px]">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Price with Discount */}
                    <div className="mb-4 flex-grow flex flex-col justify-end">
                      {product.discount > 0 ? (
                        <div className="space-y-2">
                          {/* Discount Badge */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 w-fit">
                            <Tag className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs font-bold text-green-400">
                              {product.discount}% OFF
                            </span>
                          </div>
                          
                          {/* Prices */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.price)}
                            </p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                              {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>

                    {/* Add to Cart Button - Always at Same Position */}
                    {(() => {
                      const locked = isProductLocked(product);
                      return (
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.isActive || locked}
                          className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                            locked
                              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 cursor-not-allowed"
                              : product.isActive
                                ? "bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {locked ? (
                            <>
                              <Lock className="w-4 h-4" />
                              Server Berbeda
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              {product.isActive ? "Add to Cart" : "Out of Stock"}
                            </>
                          )}
                        </button>
                      );
                    })()}
                  </div>

                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white/5 disabled:opacity-50 text-white disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`min-w-[40px] h-10 rounded-xl font-semibold transition-all ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="text-gray-600 px-1">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white/5 disabled:opacity-50 text-white disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;