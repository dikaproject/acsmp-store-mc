import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2,
  BookOpen,
  ChevronRight,
  Home,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { GridPattern } from "../components/ui/GridPattern";
import { guideAPI } from "../lib/api";
import { formatDate, getImageUrl } from "../lib/utils";

const GuideDetailPage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const [guideRes, allGuidesRes] = await Promise.all([
          guideAPI.getBySlug(slug),
          guideAPI.getAll()
        ]);
        
        setGuide(guideRes.data.data);
        
        // Get related guides (exclude current)
        const related = allGuidesRes.data.data
          .filter(g => g.slug !== slug && g.isActive)
          .slice(0, 3);
        setRelatedGuides(related);
      } catch (error) {
        console.error("Error fetching guide:", error);
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
        await navigator.share({
          title: guide.title,
          text: `Baca panduan: ${guide.title}`,
          url: window.location.href
        });
      } catch (error) {
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Panduan Tidak Ditemukan</h2>
          <Link to="/guides">
            <Button>Kembali ke Panduan</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      {/* Breadcrumb */}
      <section className="py-6 border-b border-gray-800/50 bg-black/50 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/guides" className="hover:text-emerald-400 transition-colors">
              Panduan
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-[200px] md:max-w-none">{guide.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-black" />
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
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/guides">
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="mb-6 hover:bg-emerald-500/10 hover:text-emerald-400 border border-emerald-500/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Panduan
                </Button>
              </motion.div>
            </Link>

            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              <BookOpen className="w-3 h-3 mr-1" />
              Panduan
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {guide.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">{formatDate(guide.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">5 min read</span>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShare}
                  className="hover:bg-emerald-500/10 hover:text-emerald-400 border border-emerald-500/20"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {guide.imageUrl && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <SpotlightCard 
                className="rounded-2xl"
                spotlightColor="rgba(16, 185, 129, 0.15)"
              >
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/20">
                  <img
                    src={getImageUrl(guide.imageUrl)}
                    alt={guide.title}
                    className="w-full h-auto"
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SpotlightCard 
                className="rounded-2xl"
                spotlightColor="rgba(16, 185, 129, 0.1)"
              >
                <div className="relative p-8 md:p-12 bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-emerald-500/20 backdrop-blur-xl">
                  <div 
                    className="prose prose-invert prose-emerald max-w-none
                      prose-headings:text-white prose-headings:font-bold
                      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                      prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-white
                      prose-code:text-emerald-400 prose-code:bg-emerald-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
                      prose-pre:bg-black prose-pre:border prose-pre:border-emerald-500/20
                      prose-ul:text-gray-300 prose-ol:text-gray-300
                      prose-li:marker:text-emerald-400
                      prose-img:rounded-lg prose-img:border prose-img:border-emerald-500/20
                      prose-blockquote:border-l-emerald-500 prose-blockquote:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: guide.content }}
                  />
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      {relatedGuides.length > 0 && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Panduan Terkait</h2>
              <p className="text-gray-400">
                Baca panduan lainnya yang mungkin kamu butuhkan
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedGuides.map((relatedGuide, index) => (
                <motion.div
                  key={relatedGuide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/guides/${relatedGuide.slug}`}>
                    <SpotlightCard 
                      className="rounded-2xl h-full"
                      spotlightColor="rgba(16, 185, 129, 0.15)"
                    >
                      <div className="h-full overflow-hidden bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-emerald-500/20 backdrop-blur-xl shadow-xl shadow-emerald-500/5 group">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                        
                        {relatedGuide.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={getImageUrl(relatedGuide.imageUrl)}
                              alt={relatedGuide.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          </div>
                        )}
                        <div className="p-6 relative">
                          <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                            {relatedGuide.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                            {relatedGuide.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
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
          </div>
        </section>
      )}
    </div>
  );
};

export default GuideDetailPage;