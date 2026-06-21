import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Search, BookOpen, X,
  Sparkles, MessageCircle, ExternalLink, Clock, ChevronRight, ShieldAlert
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { GlowingButton } from "../components/ui/GlowingButton";
import { AnimatedGradientText } from "../components/ui/AnimatedGradientText";
import { GridPattern } from "../components/ui/GridPattern";
import { Badge } from "../components/ui/Badge";
import { guideAPI } from "../lib/api";
import { getImageUrl } from "../lib/utils";
import { RULES_GUIDE } from "../components/RulesServerContent";

const GuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    guideAPI.getAll()
      .then(r => {
        const active = r.data.data.filter(g => g.isActive);
        setGuides(active);
        setFilteredGuides(active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter setiap kali query berubah
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredGuides(guides);
      setDropdownOpen(false);
      return;
    }
    const filtered = guides.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.content.replace(/<[^>]*>/g, "").toLowerCase().includes(q)
    );
    setFilteredGuides(filtered);
    setDropdownOpen(true);
  }, [searchQuery, guides]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dropdownResults = filteredGuides.slice(0, 5);
  const featuredGuide = filteredGuides[0];
  const regularGuides = filteredGuides.slice(1);

  const clearSearch = () => { setSearchQuery(""); setDropdownOpen(false); };

  const handleSearchKeyDown = e => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setDropdownOpen(false);
      // scroll ke section results
      document.getElementById("all-guides")?.scrollIntoView({ behavior: "smooth" });
    }
    if (e.key === "Escape") clearSearch();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-arcane border-t-transparent rounded-full"
          />
          <p className="text-bone-muted">Memuat panduan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-arcane/10 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(116,80,163,0.12),transparent_55%)]" />
          <GridPattern />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* badge */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-arcane/10 border border-arcane/30 rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4 text-arcane-glow" />
              <span className="text-sm text-arcane-glow font-medium">Panduan & Tutorial</span>
              <Sparkles className="w-4 h-4 text-arcane-glow" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }} className="block text-white"
              >
                Panduan Lengkap
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <AnimatedGradientText
                  gradient="from-arcane via-arcane-glow to-arcane"
                  className="drop-shadow-[0_0_30px_rgba(116,80,163,0.6)]"
                >
                  AmazingCraft
                </AnimatedGradientText>
              </motion.span>
            </h1>

            <motion.p
              className="text-xl text-bone-muted mb-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              Semua yang perlu kamu tahu untuk memulai petualangan di AmazingCraft
            </motion.p>

            {/* ── SEARCH ── */}
            <motion.div
              className="relative max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              ref={searchRef}
            >
              {/* Input wrapper */}
              <div className={`flex items-center gap-3 bg-ink-elevated border rounded-2xl px-4 py-3 transition-all duration-200 ${
                dropdownOpen ? "border-arcane/50 shadow-lg shadow-arcane/10" : "border-arcane/20 hover:border-arcane/35"
              }`}>
                <Search className="w-5 h-5 text-arcane-glow flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari panduan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 bg-transparent text-white placeholder:text-bone-subtle text-base outline-none"
                />
                {searchQuery && (
                  <button onClick={clearSearch}
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors">
                    <X className="w-3.5 h-3.5 text-bone-muted" />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50"
                  >
                    <div className="bg-ink-elevated border border-arcane/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                      {dropdownResults.length === 0 ? (
                        <div className="p-6 text-center">
                          <p className="text-bone-subtle text-sm">Tidak ada panduan untuk <span className="text-white">"{searchQuery}"</span></p>
                        </div>
                      ) : (
                        <>
                          <div className="px-4 pt-3 pb-1">
                            <p className="text-xs text-bone-subtle font-medium uppercase tracking-wider">
                              {dropdownResults.length} hasil ditemukan
                            </p>
                          </div>
                          {dropdownResults.map((guide, i) => (
                            <Link key={guide.id} to={`/guides/${guide.slug}`}
                              onClick={() => { setDropdownOpen(false); clearSearch(); }}
                            >
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-arcane/8 transition-colors border-t border-ink-border first:border-0 group/item"
                              >
                                {guide.imageUrl ? (
                                  <img src={getImageUrl(guide.imageUrl)} alt={guide.title}
                                    className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-arcane/10 border border-arcane/20 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 text-arcane-glow" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-sm font-semibold text-white truncate group-hover/item:text-arcane-glow transition-colors">
                                    {guide.title}
                                  </p>
                                  <p className="text-xs text-bone-subtle truncate mt-0.5">
                                    {guide.content.replace(/<[^>]*>/g, "").substring(0, 70)}...
                                  </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-arcane-glow flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </motion.div>
                            </Link>
                          ))}
                          {filteredGuides.length > 5 && (
                            <div
                              className="px-4 py-3 text-center text-xs text-bone-subtle border-t border-ink-border cursor-pointer hover:bg-arcane/5 transition-colors"
                              onClick={() => { setDropdownOpen(false); document.getElementById("all-guides")?.scrollIntoView({ behavior: "smooth" }); }}
                            >
                              Lihat {filteredGuides.length - 5} panduan lainnya ↓
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── RULES PINNED ── */}
      <section className="py-6 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">Peraturan Server</h2>
              <Badge className="bg-red-500/10 text-red-400 border-red-500/30 ml-1 text-xs">WAJIB BACA</Badge>
            </div>
            <p className="text-bone-subtle text-sm">Berlaku untuk semua pemain AmazingCraft</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/guides/peraturan-server">
              <div className="relative overflow-hidden bg-ink-elevated rounded-2xl border border-red-500/20 hover:border-red-500/40 shadow-lg shadow-red-500/5 group transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/25 text-xs">📜 PERATURAN RESMI</Badge>
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/25 text-xs">13 Pasal</Badge>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-red-300 transition-colors">
                      Peraturan Resmi AmazingCraft
                    </h3>
                    <p className="text-bone-muted text-sm max-w-xl">
                      Dengan bergabung ke server, kamu menyetujui seluruh peraturan — cheating, RMT, refund, claim land, dan ketentuan lainnya.
                    </p>
                  </div>
                  <div className="flex-shrink-0 px-4 py-2 rounded-xl bg-red-500/8 border border-red-500/25 text-red-400 font-medium text-sm flex items-center gap-2 group-hover:bg-red-500/15 transition-colors">
                    Baca Sekarang
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED GUIDE ── */}
      {featuredGuide && (
        <section className="py-10 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="mb-7"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-arcane-glow" />
                <h2 className="text-2xl font-bold text-white">Panduan Unggulan</h2>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/guides/${featuredGuide.slug}`}>
                <div className="relative overflow-hidden bg-ink-elevated rounded-2xl border border-ink-border hover:border-arcane/30 shadow-xl shadow-arcane/5 group transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-arcane/4 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredGuide.imageUrl && (
                      <div className="relative h-72 md:h-auto overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                        <img src={getImageUrl(featuredGuide.imageUrl)} alt={featuredGuide.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-arcane/80 text-white border-0 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />Featured
                        </Badge>
                      </div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col justify-center relative">
                      <Badge className="w-fit mb-4 bg-arcane/10 text-arcane-glow border-arcane/25">Panduan Utama</Badge>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-arcane-glow transition-colors">
                        {featuredGuide.title}
                      </h3>
                      <p className="text-bone-muted mb-5 line-clamp-3">
                        {featuredGuide.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-2 text-sm text-bone-subtle mb-6">
                        <Clock className="w-4 h-4" /><span>5 min baca</span>
                      </div>
                      <Button className="w-fit bg-arcane hover:bg-arcane-glow text-bone shadow-lg shadow-arcane/30 transition-colors">
                        Baca Panduan <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── ALL GUIDES ── */}
      <section id="all-guides" className="py-10 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              {searchQuery ? "Hasil Pencarian" : "Semua Panduan"}
            </h2>
            <p className="text-bone-muted text-sm">
              {searchQuery ? (
                <>Ditemukan <span className="text-arcane-glow font-semibold">{filteredGuides.length}</span> panduan untuk "{searchQuery}"</>
              ) : (
                `${filteredGuides.length} panduan tersedia`
              )}
            </p>
          </motion.div>

          {filteredGuides.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-arcane/10 border border-arcane/20 flex items-center justify-center">
                <Search className="w-10 h-10 text-bone-subtle" />
              </div>
              <p className="text-xl text-white font-semibold mb-2">Tidak ada panduan ditemukan</p>
              <p className="text-bone-muted mb-6">Coba kata kunci lain atau hapus pencarian</p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery("")}
                  className="bg-arcane hover:bg-arcane-glow text-bone transition-colors">
                  Hapus Pencarian
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {regularGuides.map((guide, index) => (
                <motion.div key={guide.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.08 }}
                >
                  <Link to={`/guides/${guide.slug}`}>
                    <div className="h-full overflow-hidden bg-ink-elevated rounded-2xl border border-ink-border hover:border-arcane/30 shadow-md group transition-all duration-300">
                      <div className="absolute inset-0 bg-arcane/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                      {guide.imageUrl && (
                        <div className="relative h-44 overflow-hidden rounded-t-2xl">
                          <img src={getImageUrl(guide.imageUrl)} alt={guide.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-elevated/80 to-transparent" />
                        </div>
                      )}
                      <div className="p-5 relative">
                        <h3 className="font-bold text-base text-white group-hover:text-arcane-glow transition-colors line-clamp-2 mb-2">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-bone-muted line-clamp-3 mb-4">
                          {guide.content.replace(/<[^>]*>/g, '').substring(0, 110)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-bone-subtle">
                            <Clock className="w-3.5 h-3.5" /><span>5 min baca</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-arcane-glow group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(116,80,163,0.07),transparent_55%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center max-w-xl mx-auto"
          >
            <div className="w-18 h-18 w-16 h-16 mx-auto mb-6 rounded-2xl bg-arcane/15 border border-arcane/25 flex items-center justify-center shadow-xl shadow-arcane/20">
              <MessageCircle className="w-8 h-8 text-arcane-glow" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Masih Bingung?</h2>
            <p className="text-bone-muted mb-8">
              Join Discord AmazingCraft! Tim support dan komunitas siap membantu kamu 24/7
            </p>
            <a href="https://discord.gg/amazingcraft" target="_blank" rel="noopener noreferrer"
              className="inline-block">
              <GlowingButton variant="secondary">
                <MessageCircle className="w-5 h-5" />
                Join Discord AmazingCraft
                <ExternalLink className="w-4 h-4" />
              </GlowingButton>
            </a>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-bone-muted">
              {[
                { icon: "🎯", label: "Support 24/7" },
                { icon: "⚔️", label: "Komunitas aktif" },
                { icon: "🎁", label: "Event & Giveaway" },
              ].map((item, i) => (
                <motion.div key={i} className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-arcane animate-pulse" />
                  <span>{item.icon} {item.label}</span>
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
