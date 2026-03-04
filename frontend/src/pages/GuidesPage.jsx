import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  ArrowRight, 
  Search, 
  Filter,
  BookOpen,
  TrendingUp,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Zap,
  Clock,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { GlowingButton } from "../components/ui/GlowingButton";
import { AnimatedGradientText } from "../components/ui/AnimatedGradientText";
import { GridPattern } from "../components/ui/GridPattern";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { guideAPI } from "../lib/api";
import { getImageUrl } from "../lib/utils";

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await guideAPI.getAll();
        const activeGuides = response.data.data.filter(guide => guide.isActive);
        setGuides(activeGuides);
        setFilteredGuides(activeGuides);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGuides(guides);
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const searchLower = searchQuery.toLowerCase().trim();
    const filtered = guides.filter(guide => {
      const titleMatch = guide.title.toLowerCase().includes(searchLower);
      const contentText = guide.content.replace(/<[^>]*>/g, '').toLowerCase();
      const contentMatch = contentText.includes(searchLower);
      return titleMatch || contentMatch;
    });
    
    setFilteredGuides(filtered);
    setSearchResults(filtered.slice(0, 4));
    setShowSearchDropdown(isSearchFocused && filtered.length > 0);
  }, [searchQuery, guides, isSearchFocused]);

  const featuredGuide = filteredGuides[0];
  const regularGuides = filteredGuides.slice(1);

  const stats = [
    { label: "Total Panduan", value: guides.length, icon: Book, color: "emerald" },
    { label: "Kategori", value: "6+", icon: Filter, color: "cyan" },
    { label: "User Helped", value: "10K+", icon: TrendingUp, color: "purple" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
          <p className="text-muted-foreground">Memuat panduan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
          <GridPattern />
        </div>
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Panduan & Tutorial</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-white"
              >
                Panduan Lengkap
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <AnimatedGradientText 
                  gradient="from-emerald-400 via-cyan-400 to-emerald-400"
                  className="drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                  Nexus SMP
                </AnimatedGradientText>
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Pelajari semua yang perlu kamu ketahui untuk memulai petualangan di Nexus SMP
            </motion.p>

            {/* Search Bar with Dropdown */}
            <motion.div 
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative z-50">
                <SpotlightCard 
                  className="rounded-2xl overflow-hidden"
                  spotlightColor="rgba(16, 185, 129, 0.15)"
                >
                  <div className="relative bg-[#0a0b0f] border border-emerald-500/20 rounded-2xl p-1 transition-all duration-300 hover:border-emerald-500/40">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 z-10" />
                      <Input
                        type="text"
                        placeholder="Cari panduan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => {
                          // Delay to allow click on dropdown items
                          setTimeout(() => setIsSearchFocused(false), 200);
                        }}
                        className="pl-12 pr-12 py-6 text-lg bg-transparent border-0 focus:ring-0 text-white placeholder:text-gray-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setShowSearchDropdown(false);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </SpotlightCard>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {showSearchDropdown && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setIsSearchFocused(false);
                        }}
                      />
                      
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-[60]"
                      >
                        <SpotlightCard 
                          className="rounded-2xl"
                          spotlightColor="rgba(16, 185, 129, 0.15)"
                        >
                          <div className="bg-[#0a0b0f] border border-emerald-500/20 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar shadow-2xl shadow-emerald-500/20">
                            {searchResults.length === 0 ? (
                              <div className="p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center">
                                  <Search className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-400 text-sm">
                                  Tidak ada panduan yang cocok dengan pencarian "{searchQuery}"
                                </p>
                              </div>
                            ) : (
                              <>
                                {searchResults.map((guide, index) => (
                              <Link
                                key={guide.id}
                                to={`/guides/${guide.slug}`}
                                onClick={() => {
                                  setShowSearchDropdown(false);
                                  setIsSearchFocused(false);
                                  setSearchQuery("");
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center gap-10 p-4 hover:bg-emerald-500/10 transition-colors border-b border-gray-800/50 last:border-0"
                                >
                                  {guide.imageUrl && (
                                    <img
                                      src={getImageUrl(guide.imageUrl)}
                                      alt={guide.title}
                                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white mb-1 truncate">
                                      {guide.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-1">
                                      {guide.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                    </p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                </motion.div>
                              </Link>
                            ))}
                            
                            {searchResults.length < filteredGuides.length && (
                              <div 
                                className="p-4 text-center text-sm text-gray-500 border-t border-gray-800/50 cursor-pointer hover:bg-emerald-500/5 transition-colors"
                                onClick={() => {
                                  setShowSearchDropdown(false);
                                  setIsSearchFocused(false);
                                }}
                              >
                                Lihat {filteredGuides.length - searchResults.length} panduan lainnya di bawah
                              </div>
                            )}
                              </>
                            )}
                          </div>
                        </SpotlightCard>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <SpotlightCard 
                    className="rounded-2xl"
                    spotlightColor="rgba(16, 185, 129, 0.15)"
                  >
                    <div className="relative p-8 text-center bg-[#0a0b0f] rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/20"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <p className="text-3xl font-bold text-white mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Guide */}
      {featuredGuide && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-3xl font-bold text-white">Panduan Unggulan</h2>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/guides/${featuredGuide.slug}`}>
                <SpotlightCard 
                  className="rounded-2xl"
                  spotlightColor="rgba(16, 185, 129, 0.2)"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-emerald-500/20 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 group">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image */}
                      {featuredGuide.imageUrl && (
                        <div className="relative h-80 md:h-auto overflow-hidden">
                          <img
                            src={getImageUrl(featuredGuide.imageUrl)}
                            alt={featuredGuide.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 shadow-lg">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8 md:p-10 flex flex-col justify-center relative">
                        <Badge className="w-fit mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          Panduan Utama
                        </Badge>
                        
                        <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                          {featuredGuide.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-6 line-clamp-3">
                          {featuredGuide.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                          <Clock className="w-4 h-4" />
                          <span>5 min read</span>
                        </div>
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-fit bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30">
                            Baca Panduan
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Guides Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {searchQuery ? "Hasil Pencarian" : "Semua Panduan"}
            </h2>
            <p className="text-gray-400">
              {searchQuery ? (
                <>
                  Ditemukan <span className="text-emerald-400 font-semibold">{filteredGuides.length}</span> panduan untuk "{searchQuery}"
                </>
              ) : (
                `${filteredGuides.length} panduan tersedia`
              )}
            </p>
          </motion.div>

          {filteredGuides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-xl text-white font-semibold mb-2">
                Tidak ada panduan yang ditemukan
              </p>
              <p className="text-gray-400 mb-6">
                Coba kata kunci lain atau hapus pencarian untuk melihat semua panduan
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  Hapus Pencarian
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/guides/${guide.slug}`}>
                    <SpotlightCard 
                      className="rounded-2xl h-full"
                      spotlightColor="rgba(16, 185, 129, 0.15)"
                    >
                      <div className="h-full overflow-hidden bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-emerald-500/5 group">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        
                        {/* Image */}
                        {guide.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={getImageUrl(guide.imageUrl)}
                              alt={guide.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          </div>
                        )}

                        <div className="p-6 relative">
                          <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                            {guide.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                            {guide.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              <span>5 min read</span>
                            </div>
                            <motion.div whileHover={{ x: 5 }}>
                              <ArrowRight className="w-5 h-5 text-emerald-400" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
              whileHover={{ rotate: 12, scale: 1.1 }}
            >
              <MessageCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Masih Bingung?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join Discord server kami! Tim support dan komunitas siap membantu 24/7
            </p>
            
            <a 
              href="https://discord.com/invite/nexus-cloud" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <GlowingButton variant="secondary">
                <MessageCircle className="w-5 h-5" />
                Join Discord Server
                <ExternalLink className="w-4 h-4" />
              </GlowingButton>
            </a>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              {[
                { icon: "🎯", label: "Support 24/7" },
                { icon: "🎮", label: "Komunitas aktif" },
                { icon: "🎁", label: "Event & Giveaway" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                  <span className="flex items-center gap-1">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GuidesPage;
