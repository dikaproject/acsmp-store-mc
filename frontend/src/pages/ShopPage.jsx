import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, Filter, Sparkles, Tag, TrendingUp, Zap, 
  Star, Package, Clock, ChevronLeft, ChevronRight, Info, X,
  CheckCircle, Command, Gift, Shield, Lock, Banknote
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
          <div className="w-8 h-8 border border-ink-border border-t-arcane animate-spin" />
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
              <div className="relative bg-ink-elevated border border-ink-border">
                {/* Header */}
                <div className="relative p-6 border-b border-ink-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center border bg-arcane/15 border-arcane/30">
                          {product.type === 'FEATURE' ? (
                            <Shield className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                          )}
                        </div>
                        <div>
                          <h2 className="font-display text-2xl text-bone">
                            {product.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default">
                              {product.type === 'FEATURE' ? 'Feature' : 'Rank'}
                            </Badge>
                            <Badge variant="secondary">
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
                        <div className="w-8 h-8 bg-arcane/15 flex items-center justify-center border border-arcane/30">
                          <Gift className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl text-bone">Benefits</h3>
                      </div>

                      <div className="grid gap-3">
                        {product.benefits.map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-arcane/5 border border-arcane/20"
                          >
                            <CheckCircle className="w-4 h-4 text-arcane flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                            <span className="text-sm text-bone-muted leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commands Section */}
                  {product.infoCommands && Array.isArray(product.infoCommands) && product.infoCommands.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-arcane/15 flex items-center justify-center border border-arcane/30">
                          <Command className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl text-bone">Commands yang Tersedia</h3>
                      </div>
                      
                      <div className="grid gap-2">
                        {product.infoCommands.map((command, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 bg-arcane/5 border border-arcane/20 font-mono text-sm text-arcane"
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
                        <div className="w-8 h-8 bg-arcane/15 flex items-center justify-center border border-arcane/30">
                          <Tag className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl text-bone">Group Name</h3>
                      </div>
                      <div className="p-4 bg-arcane/5 border border-arcane/20">
                        <code className="text-arcane font-mono">{product.groupName}</code>
                      </div>
                    </div>
                  )}

                  {/* Permission (for FEATURE) */}
                  {product.permission && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-arcane/15 flex items-center justify-center border border-arcane/30">
                          <Shield className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl text-bone">Permission Node</h3>
                      </div>
                      <div className="p-4 bg-arcane/5 border border-arcane/20">
                        <code className="text-arcane font-mono">{product.permission}</code>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  {product.amount && !['COIN', 'MONEY'].includes(product.type) && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-arcane/15 flex items-center justify-center border border-arcane/30">
                          <Clock className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl text-bone">Duration</h3>
                      </div>
                      <div className="p-4 bg-arcane/5 border border-arcane/20">
                        <span className="text-arcane font-mono">{product.amount} Hari</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-bone-subtle uppercase tracking-widest mb-1">Price</p>
                      {product.discount > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-bone-subtle line-through font-mono">
                              {formatCurrency(product.price)}
                            </span>
                            <Badge variant="success">
                              -{product.discount}%
                            </Badge>
                          </div>
                          <p className="font-mono text-2xl text-arcane">
                            {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                          </p>
                          <p className="text-xs text-[hsl(var(--success))]">
                            Hemat {formatCurrency(Math.floor(product.price * product.discount / 100))}
                          </p>
                        </div>
                      ) : (
                        <p className="font-mono text-2xl text-arcane">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      onClick={onClose}
                      className="px-6 py-3 bg-arcane text-bone hover:bg-arcane-glow font-medium uppercase text-sm tracking-widest"
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
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();
  const { isUserLoggedIn, serverTypeId: userServerTypeId, currentRank } = useAuthStore();

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
          isActive: true,
        }),
        serverTypeAPI.getAll({ isActive: true }),
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

  // Extract just the rank name (first word) — currentRank is e.g. "VIP 27 Mar 2026 07:35"
  const rankName = currentRank ? currentRank.split(' ')[0] : null;

  // Find the product matching the player's current rank (case-insensitive groupName match)
  const currentRankProduct = useMemo(() => {
    if (!rankName || !isUserLoggedIn || !products.length) return null;
    return products.find(
      p =>
        p.type === 'RANK' &&
        String(p.serverTypeId) === String(userServerTypeId) &&
        p.groupName?.toLowerCase() === rankName.toLowerCase()
    ) || null;
  }, [rankName, products, userServerTypeId, isUserLoggedIn]);

  // Helper: compute discounted price for a product
  const discountedPrice = useCallback(
    (p) => Math.floor(p.price - p.price * (p.discount || 0) / 100),
    []
  );

  // Returns true when the RANK product is already owned or lower than current rank (using discounted prices)
  const isProductRankLocked = useCallback(
    (product) => {
      if (product.type !== 'RANK' || !currentRankProduct) return false;
      return discountedPrice(product) <= discountedPrice(currentRankProduct);
    },
    [currentRankProduct, discountedPrice]
  );

  // Returns the upgrade price (discounted target - discounted current) or null when not applicable
  // Returns null if the product is inactive (inactive products cannot be upgraded)
  const getUpgradePrice = useCallback(
    (product) => {
      if (product.type !== 'RANK' || !currentRankProduct) return null;
      if (!product.isActive) return null;
      const targetPrice = discountedPrice(product);
      const currentPrice = discountedPrice(currentRankProduct);
      if (targetPrice <= currentPrice) return null;
      return targetPrice - currentPrice;
    },
    [currentRankProduct, discountedPrice]
  );

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

    if (isProductRankLocked(product)) {
      toast.error(`Kamu sudah memiliki rank ${product.name} atau yang lebih tinggi`);
      return;
    }

    const upgradePrice = getUpgradePrice(product);
    if (upgradePrice !== null) {
      clearCart();
      addItem({ ...product, _isUpgrade: true, _upgradePrice: upgradePrice, _currentRankName: rankName }, 1);
      toast.success(
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Upgrade {product.name} — lanjut ke checkout...</span>
        </div>
      );
      navigate('/checkout');
      return;
    }

    addItem(product, 1);
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        <span>{product.name} ditambahkan ke keranjang!</span>
      </div>
    );
  }, [addItem, clearCart, navigate, isProductLocked, isProductRankLocked, getUpgradePrice, rankName, userServerName]);

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
    { value: "money", label: "Money", icon: Banknote },
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
        <div className="absolute inset-0 bg-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.04)_0%,transparent_60%)]" />
        
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(212,165,116,0.2) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(212,165,116,0.2) 1px, transparent 1px)`,
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30 mb-6"
            >
              <div className="w-1.5 h-1.5 bg-arcane" />
              <ShoppingCart className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
                Premium Shop
              </span>
              <Sparkles className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
            </motion.div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6 text-bone leading-[1.05]">
              Explore our <span className="italic text-arcane">premium collection</span>
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
          <div className="relative p-4 bg-ink-elevated border border-ink-border">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-arcane" strokeWidth={1.75} />
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
            className="p-6 bg-ink-elevated border border-ink-border"
          >
            <h3 className="text-[11px] font-medium text-bone-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
              Server Type
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleServerChange("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedServer === "all"
                    ? "bg-arcane text-bone"
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
                      ? "bg-arcane text-bone"
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
            className="p-6 bg-ink-elevated border border-ink-border"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
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
                        ? "bg-arcane text-bone"
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

          {/* Info Notice - Rank Upgrade (dynamic based on player rank) */}
          {isUserLoggedIn && rankName && currentRankProduct ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-arcane/5 border border-arcane/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-arcane/15 flex items-center justify-center border border-arcane/30 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-medium text-arcane mb-1.5 uppercase tracking-widest">
                    Rank Aktif Kamu: <span className="text-bone">{rankName}</span>
                  </h4>
                  <p className="text-sm text-bone-muted leading-relaxed">
                    Harga upgrade ditampilkan otomatis pada rank yang lebih tinggi — kamu hanya membayar{" "}
                    <span className="text-arcane">selisih harga</span>. Rank yang setara atau lebih rendah dikunci karena sudah kamu miliki.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : isUserLoggedIn && rankName && !currentRankProduct ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-arcane/5 border border-arcane/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-arcane/15 flex items-center justify-center border border-arcane/30 flex-shrink-0">
                  <Info className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-medium text-arcane mb-1.5 uppercase tracking-widest">
                    Rank Terdeteksi: <span className="text-bone">{rankName}</span>
                  </h4>
                  <p className="text-sm text-bone-muted leading-relaxed">
                    Rank kamu terdeteksi tetapi belum terdaftar di toko ini. Hubungi Admin melalui Discord atau WhatsApp jika ada pertanyaan mengenai upgrade.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : !isUserLoggedIn ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-arcane/5 border border-arcane/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-arcane/15 flex items-center justify-center border border-arcane/30 flex-shrink-0">
                  <Info className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-medium text-arcane mb-1.5 uppercase tracking-widest">
                    Ingin Upgrade Rank?
                  </h4>
                  <p className="text-sm text-bone-muted leading-relaxed">
                    <span className="text-arcane">Login</span> terlebih dahulu untuk melihat harga upgrade rank secara otomatis. Kamu hanya perlu membayar selisih harga dari rank saat ini ke rank yang dituju.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Server Lock Notice */}
          {isUserLoggedIn && userServerTypeId && userServerName && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-arcane/5 border border-arcane/30"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-arcane/15 flex items-center justify-center border border-arcane/30 flex-shrink-0">
                  <Lock className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-medium text-arcane mb-1.5 uppercase tracking-widest">
                    Server: {userServerName}
                  </h4>
                  <p className="text-sm text-bone-muted leading-relaxed">
                    Kamu sedang berbelanja untuk server <span className="text-arcane">{userServerName}</span>. Produk dari server lain tidak bisa ditambahkan ke keranjang. Untuk membeli produk server lain, silakan logout dan login ulang dengan memilih server yang sesuai.
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
              <div key={i} className="h-96 bg-ink-elevated rounded-2xl animate-pulse" />
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
                  className="group relative bg-ink-elevated border border-ink-border overflow-hidden hover:border-arcane/40 transition-colors"
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

                    {/* Info Button for Ranks and Features */}
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

                    {/* Price: upgrade / discount / normal */}
                    <div className="mb-4 flex-grow flex flex-col justify-end">
                      {(() => {
                        const upgradePrice = getUpgradePrice(product);
                        if (upgradePrice !== null) {
                          // Original upgrade price without target discount (to show as strikethrough)
                          const currentDiscounted = discountedPrice(currentRankProduct);
                          const originalUpgrade = product.price - currentDiscounted;
                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-arcane/15 border border-arcane/30">
                                  <TrendingUp className="w-3 h-3 text-arcane" strokeWidth={1.75} />
                                  <span className="text-[10px] font-medium text-arcane uppercase tracking-widest">Upgrade</span>
                                </div>
                                {product.discount > 0 && (
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[hsl(var(--success))]/15 border border-[hsl(var(--success))]/30">
                                    <Tag className="w-3 h-3 text-[hsl(var(--success))]" />
                                    <span className="text-[10px] font-medium text-[hsl(var(--success))] uppercase tracking-widest">{product.discount}% Off</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500 line-through">
                                  {formatCurrency(product.discount > 0 ? originalUpgrade : product.price)}
                                </p>
                              </div>
                              <p className="font-mono text-2xl text-arcane">
                                {formatCurrency(upgradePrice)}
                              </p>
                              <p className="text-xs text-arcane/70">Selisih dari rank saat ini</p>
                            </div>
                          );
                        }
                        if (product.discount > 0) {
                          return (
                            <div className="space-y-2">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[hsl(var(--success))]/15 border border-[hsl(var(--success))]/30 w-fit">
                                <Tag className="w-3 h-3 text-[hsl(var(--success))]" />
                                <span className="text-[10px] font-medium text-[hsl(var(--success))] uppercase tracking-widest">{product.discount}% Off</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500 line-through">{formatCurrency(product.price)}</p>
                                <p className="font-mono text-2xl text-[hsl(var(--success))]">
                                  {formatCurrency(Math.floor(product.price - (product.price * product.discount / 100)))}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <p className="font-mono text-2xl text-arcane">
                            {formatCurrency(product.price)}
                          </p>
                        );
                      })()}
                    </div>

                    {/* Add to Cart / Upgrade / Locked Button */}
                    {(() => {
                      const locked = isProductLocked(product);
                      const rankLocked = isProductRankLocked(product);
                      const upgradePrice = getUpgradePrice(product);

                      if (locked) {
                        return (
                          <button
                            disabled
                            className="w-full py-3 px-4 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-arcane/10 border border-arcane/30 text-arcane cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4" />
                            Server Berbeda
                          </button>
                        );
                      }

                      if (rankLocked) {
                        return (
                          <button
                            disabled
                            className="w-full py-3 px-4 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-ink border border-ink-border text-bone-subtle cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4 text-[hsl(var(--success))]" />
                            Sudah Dimiliki
                          </button>
                        );
                      }

                      if (upgradePrice !== null) {
                        return (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-3 px-4 font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-arcane text-bone hover:bg-arcane-glow transition-colors"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Upgrade
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!!product.isOutOfStock}
                          className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                            !product.isOutOfStock
                              ? "bg-arcane text-bone hover:bg-arcane-glow"
                              : "bg-gray-800 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {!product.isOutOfStock ? "Add to Cart" : "Out of Stock"}
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
                            ? 'bg-arcane text-bone'
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