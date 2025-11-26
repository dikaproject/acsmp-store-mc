import { useState, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  CheckCircle2,
  Loader2,
  Info,
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Home as HomeIcon
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../assets/logo.png";

// Simplified background - no animations
const StaticBackground = memo(() => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
    <div className="absolute inset-0 opacity-[0.02]">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
        backgroundSize: '100px 100px'
      }} />
    </div>
  </>
));

StaticBackground.displayName = 'StaticBackground';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuthStore();
  
  const [minecraftName, setMinecraftName] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!minecraftName.trim()) {
      toast.error("Masukkan Minecraft name Anda");
      return;
    }

    const minecraftRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!minecraftRegex.test(minecraftName)) {
      toast.error("Format Minecraft name tidak valid (3-16 karakter, alphanumeric & underscore)");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/player`,
        { minecraftName: minecraftName.trim() }
      );

      const { token, minecraftName: verifiedName, verification } = response.data.data;
      
      localStorage.setItem('token', token);
      loginUser(verifiedName, token);
      
      toast.success(
        <div>
          <p className="font-semibold">Selamat datang, {verifiedName}!</p>
          <p className="text-xs text-gray-400 mt-1">
            {verification.message}
          </p>
        </div>,
        { duration: 4000 }
      );
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response?.status === 404) {
        toast.error(
          <div>
            <p className="font-semibold">Player tidak ditemukan!</p>
            <p className="text-xs text-gray-400 mt-1">
              {error.response.data.message}
            </p>
          </div>,
          { duration: 5000, icon: <AlertCircle className="w-5 h-5 text-red-400" /> }
        );
      } else {
        toast.error(error.response?.data?.message || "Login gagal, coba lagi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      <StaticBackground />

      <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 backdrop-blur-xl mb-4">
              <img src="/logo.png" alt="Amazing Craft" className="w-12 h-12 object-contain" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 mb-2" style={{ fontFamily: "'Orbitron', 'Rajdhani', sans-serif" }}>
              AMAZING CRAFT
            </h1>
            
            <p className="text-sm text-gray-400 mb-4">
              Premium Minecraft Server
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Player Login
              </span>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
          </motion.div>

          {/* Login Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative"
          >
            {/* Top accent line */}
            <div className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-t-2xl" />
            
            <div className="bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 md:p-8">
              
              {/* Form Title */}
              <div className="mb-6">
                <h2 className="text-xl font-black text-white mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Sign In
                </h2>
                <p className="text-sm text-gray-400">
                  Masukkan Minecraft username Anda
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Minecraft Username
                  </label>
                  
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Contoh: Steve123"
                      value={minecraftName}
                      onChange={(e) => setMinecraftName(e.target.value)}
                      className="bg-black/60 border-purple-500/30 focus:border-purple-500/50 h-12 text-base rounded-xl transition-colors text-white placeholder:text-gray-500"
                      maxLength={16}
                      required
                      autoFocus
                    />
                    
                    {minecraftName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-2 py-1">
                          {minecraftName.length}/16
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    3-16 karakter (huruf, angka, underscore)
                  </p>
                </div>

                {/* Bedrock Info */}
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <span className="font-semibold text-blue-400">Bedrock Player:</span> Tambahkan titik (.) di depan username
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Contoh: <span className="font-mono text-blue-400">.Steve123</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-purple-400 mb-1">Penting!</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Username harus pernah join server minimal 1x dan data akan tersinkronisasi otomatis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 disabled:from-purple-600/50 disabled:via-violet-600/50 disabled:to-purple-600/50 shadow-lg shadow-purple-500/20 h-12 text-base font-bold rounded-xl transition-all border border-purple-400/30"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>VERIFYING...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>SIGN IN</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                {/* Features */}
                <div className="flex items-center justify-center gap-3 pt-3">
                  {[
                    { icon: "⚡", label: "Instant" },
                    { icon: "🔒", label: "Secure" },
                    { icon: "✓", label: "Verified" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                      <span className="text-sm">{feature.icon}</span>
                      <span className="text-xs font-semibold text-purple-400">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-purple-400 transition-colors font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center mt-6"
          >
            <p className="text-xs text-gray-600">
              © 2024 Amazing Craft. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);