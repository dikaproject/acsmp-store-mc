import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Image, Sparkles, ArrowRight, MousePointer2 } from "lucide-react";
import { GlowingButton } from "../ui/GlowingButton";
import CircularGallery from "../ui/CircularGallery";

const GallerySection = ({ gallery = [] }) => {
  // Transform gallery data untuk CircularGallery
  const galleryItems = gallery.length > 0 
    ? gallery.map(item => ({
        image: `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.imageUrl}`,
        text: item.title || 'Gallery Image'
      }))
    : null; // Use default images from CircularGallery

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
            <Image className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gallery</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Community Moments
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Explore epic builds, memorable events, and amazing screenshots from our community
          </p>

          {/* Interactive hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 text-sm text-gray-500"
          >
            <MousePointer2 className="w-4 h-4" />
            <span>Drag or scroll to explore</span>
          </motion.div>
        </motion.div>

        {/* Circular Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
          style={{ height: '600px', position: 'relative' }}
        >
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.05}
            font="bold 28px system-ui"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/gallery">
            <GlowingButton variant="secondary">
              <Sparkles className="w-5 h-5" />
              View Full Gallery
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;