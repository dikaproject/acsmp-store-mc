import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, Share2, BookOpen,
  ChevronRight, Home, ArrowRight, ShieldAlert
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { GridPattern } from "../components/ui/GridPattern";
import { guideAPI } from "../lib/api";
import { formatDate, getImageUrl } from "../lib/utils";
import { RULES_GUIDE, getRulesHtml } from "../components/RulesServerContent";

const GuideDetailPage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        if (slug === "peraturan-server") {
          setGuide({ ...RULES_GUIDE, content: getRulesHtml() });
          const res = await guideAPI.getAll();
          setRelatedGuides(res.data.data.filter(g => g.isActive).slice(0, 3));
          setLoading(false);
          return;
        }
        const [guideRes, allRes] = await Promise.all([
          guideAPI.getBySlug(slug),
          guideAPI.getAll(),
        ]);
        setGuide(guideRes.data.data);
        setRelatedGuides(allRes.data.data.filter(g => g.slug !== slug && g.isActive).slice(0, 3));
      } catch (err) {
        console.error("Error fetching guide:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: guide.title, text: `Baca panduan: ${guide.title}`, url: window.location.href });
      } catch (_) {}
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-arcane border-t-transparent rounded-full" />
          <p className="text-bone-muted">Memuat panduan...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Panduan Tidak Ditemukan</h2>
          <Link to="/guides"><Button>Kembali ke Panduan</Button></Link>
        </div>
      </div>
    );
  }

  const isRules = !!guide.isRules;
  const accentColor = isRules ? "red" : "arcane";

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">

      {/* ── BREADCRUMB ── */}
      <section className="py-4 border-b border-ink-border bg-black/60 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-bone-subtle">
            <Link to="/" className="hover:text-arcane-glow transition-colors"><Home className="w-4 h-4" /></Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/guides" className="hover:text-arcane-glow transition-colors">Panduan</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-bone truncate max-w-[200px] md:max-w-none">{guide.title}</span>
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-b ${isRules ? "from-red-950/15" : "from-arcane/8"} to-black`} />
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,${isRules ? "rgba(248,113,113,0.08)" : "rgba(116,80,163,0.1)"},transparent_55%)]`} />
          <GridPattern />
        </div>

        <motion.div
          className={`absolute top-16 left-1/4 w-80 h-80 ${isRules ? "bg-red-500/6" : "bg-arcane/6"} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="max-w-4xl mx-auto"
          >
            <Link to="/guides">
              <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost"
                  className={`mb-6 border ${isRules ? "border-red-500/20 hover:bg-red-500/8 hover:text-red-300" : "border-arcane/20 hover:bg-arcane/8 hover:text-arcane-glow"}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Panduan
                </Button>
              </motion.div>
            </Link>

            <Badge className={`mb-4 ${isRules ? "bg-red-500/10 text-red-400 border-red-500/25" : "bg-arcane/10 text-arcane-glow border-arcane/25"}`}>
              {isRules
                ? <><ShieldAlert className="w-3 h-3 mr-1" />Peraturan Server</>
                : <><BookOpen className="w-3 h-3 mr-1" />Panduan</>
              }
            </Badge>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {guide.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-bone-subtle">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isRules ? "text-red-400" : "text-arcane-glow"}`} />
                <span className="text-sm">{formatDate(guide.createdAt)}</span>
              </div>
              {!isRules && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-arcane-glow" />
                  <span className="text-sm">5 min baca</span>
                </div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={handleShare}
                  className={`border ${isRules ? "border-red-500/20 hover:bg-red-500/8 hover:text-red-300" : "border-arcane/20 hover:bg-arcane/8 hover:text-arcane-glow"}`}>
                  <Share2 className="w-4 h-4 mr-2" />Share
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED IMAGE ── */}
      {guide.imageUrl && (
        <section className="pb-6">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }} className="max-w-4xl mx-auto"
            >
              <div className={`rounded-2xl overflow-hidden border ${isRules ? "border-red-500/20" : "border-arcane/20"}`}>
                <img src={getImageUrl(guide.imageUrl)} alt={guide.title} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTENT ── */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className={`relative p-7 md:p-10 bg-ink-elevated rounded-2xl border ${isRules ? "border-red-500/15" : "border-ink-border"} shadow-xl`}>
                {/* top accent */}
                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${isRules ? "via-red-500/40" : "via-arcane/30"} to-transparent`} />
                <div
                  className={isRules ? "rules-doc" : "guide-prose"}
                  dangerouslySetInnerHTML={{ __html: guide.content }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {relatedGuides.length > 0 && (
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-1">Panduan Lainnya</h2>
              <p className="text-bone-muted text-sm">Panduan AmazingCraft yang mungkin kamu butuhkan</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {relatedGuides.map((rel, index) => (
                <motion.div key={rel.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link to={`/guides/${rel.slug}`}>
                    <div className="h-full overflow-hidden bg-ink-elevated rounded-2xl border border-ink-border hover:border-arcane/30 shadow-md group transition-all duration-300">
                      <div className="absolute inset-0 bg-arcane/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                      {rel.imageUrl && (
                        <div className="relative h-40 overflow-hidden rounded-t-2xl">
                          <img src={getImageUrl(rel.imageUrl)} alt={rel.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-elevated/80 to-transparent" />
                        </div>
                      )}
                      <div className="p-5 relative">
                        <h3 className="font-bold text-base text-white group-hover:text-arcane-glow transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h3>
                        <p className="text-sm text-bone-muted line-clamp-2 mb-4">
                          {rel.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-bone-subtle">
                            <Clock className="w-3.5 h-3.5" /><span>5 min baca</span>
                          </div>
                          <motion.div whileHover={{ x: 4 }}>
                            <ArrowRight className="w-4 h-4 text-arcane-glow" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default GuideDetailPage;
