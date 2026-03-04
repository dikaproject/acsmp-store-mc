import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ZoomIn,
  X,
  Grid3x3,
  Eye
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { GlowingButton } from "../components/ui/GlowingButton";
import { AnimatedGradientText } from "../components/ui/AnimatedGradientText";
import { GridPattern } from "../components/ui/GridPattern";
import axios from "axios";
import { getImageUrl } from "../lib/utils";

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gallery`
      );
      const activeGalleries = response.data.data
        .filter(g => g.isActive)
        .sort((a, b) => a.order - b.order);
      setGalleries(activeGalleries);
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(galleries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGalleries = galleries.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-20">
        <div className="text-center">
          <motion.div 
            className="relative w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20 bg-black">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
          <GridPattern />
        </div>

        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full mb-6 backdrop-blur-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <Grid3x3 className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Gallery</span>
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-white"
              >
                Server Gallery
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <AnimatedGradientText 
                  gradient="from-purple-400 via-pink-400 to-purple-400"
                  className="drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                >
                  Showcase
                </AnimatedGradientText>
              </motion.span>
            </h1>

            <motion.p 
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Explore our community moments, epic builds, and server events
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-purple-400 font-bold text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  {galleries.length} Photos
                </span>
              </motion.div>
              <motion.div 
                className="px-6 py-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-full backdrop-blur-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-pink-400 font-bold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {totalPages} Pages
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {galleries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                No photos yet
              </h3>
              <p className="text-sm text-gray-500">
                Check back later for amazing screenshots and moments!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Enhanced Grid with staggered animation */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                <AnimatePresence mode="wait">
                  {currentGalleries.map((gallery, index) => (
                    <motion.div
                      key={gallery.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => setSelectedImage(gallery)}
                    >
                      {/* Image */}
                      <img
                        src={getImageUrl(gallery.imageUrl)}
                        alt={gallery.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      
                      {/* Hover overlay with glassmorphism */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {/* Zoom icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50"
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ZoomIn className="w-7 h-7 text-white" />
                          </motion.div>
                        </div>
                        
                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">
                            {gallery.title}
                          </h3>
                          {gallery.description && (
                            <p className="text-gray-300 text-xs line-clamp-2">
                              {gallery.description}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Border glow on hover */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-500/50 transition-all duration-300" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center items-center gap-2"
                >
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="icon"
                    className="border-purple-700/50 hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);

                      const showEllipsis = 
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2);

                      if (!showPage && !showEllipsis) return null;

                      if (showEllipsis) {
                        return (
                          <div key={page} className="px-3 py-2 text-gray-500">
                            ...
                          </div>
                        );
                      }

                      return (
                        <motion.div key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => goToPage(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={
                              currentPage === page
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50"
                                : "border-purple-700/50 hover:bg-purple-800/50"
                            }
                          >
                            {page}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="icon"
                    className="border-purple-700/50 hover:bg-purple-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* Page Info */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-
                  {Math.min(endIndex, galleries.length)} of {galleries.length} photos
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform shadow-lg shadow-purple-500/50 z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full"
            >
              {/* Image container with glow */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20">
                <img
                  src={getImageUrl(selectedImage.imageUrl)}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
                
                {/* Glowing border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 pointer-events-none" />
              </div>

              {/* Info card with glassmorphism */}
              <motion.div 
                className="mt-6 p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-300">
                    {selectedImage.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
