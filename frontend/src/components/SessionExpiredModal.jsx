import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogIn, X } from "lucide-react";

/**
 * Global session-expired modal.
 * Controlled via the custom event "session:expired" dispatched from api.js.
 * Usage: place <SessionExpiredModal /> once inside App.jsx.
 */
const SessionExpiredModal = ({ isOpen, onClose, isAdmin }) => {
  const handleLogin = () => {
    onClose();
    window.location.href = isAdmin ? "/admin/login" : "/login";
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-sm bg-black/95 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden"
            >
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />

              <div className="p-6">
                {/* Icon + close */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <h2 className="text-xl font-black text-white mb-2">
                  Sesi Kamu Berakhir
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Token login kamu sudah <span className="text-yellow-400 font-semibold">expired</span> atau tidak valid.
                  Silakan <span className="text-white font-semibold">login kembali</span> untuk melanjutkan.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={handleLogin}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
                  >
                    <LogIn className="w-4 h-4" />
                    Login Ulang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiredModal;
