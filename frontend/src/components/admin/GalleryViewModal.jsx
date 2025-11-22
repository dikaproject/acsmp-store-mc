import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Download,
  Calendar,
  Hash,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";

const GalleryViewModal = ({ isOpen, onClose, gallery }) => {
  if (!isOpen || !gallery) return null;

  const handleDownload = async () => {
    try {
      const imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${gallery.imageUrl}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${gallery.title.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Gagal download image");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto"
        >
          <Card className="border-gray-800/50 bg-[#13151a] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{gallery.title}</h2>
                  <Badge className={`${
                    gallery.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}>
                    {gallery.isActive ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </>
                    )}
                  </Badge>
                </div>
                {gallery.description && (
                  <p className="text-sm text-gray-400">{gallery.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="p-6">
              <div className="relative rounded-xl overflow-hidden bg-gray-800/50 mb-6">
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${gallery.imageUrl}`}
                  alt={gallery.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-400">Display Order</p>
                  </div>
                  <p className="text-lg font-bold text-white">#{gallery.order}</p>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-400">Created</p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {new Date(gallery.createdAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-400">Last Updated</p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {new Date(gallery.updatedAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800/50">
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800"
              >
                Close
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GalleryViewModal;