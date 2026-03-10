import { useState, memo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  CheckCircle2,
  Loader2,
  Info,
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Server
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";

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
  const [platform, setPlatform] = useState("java"); // java or bedrock
  const [serverTypeId, setServerTypeId] = useState("");
  const [serverTypes, setServerTypes] = useState([]);
  const [serverTypesLoading, setServerTypesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/shop';

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/server-types`)
      .then(res => {
        const list = res.data?.data || [];
        setServerTypes(list);
        if (list.length > 0) setServerTypeId(list[0].id);
      })
      .catch(() => {})
      .finally(() => setServerTypesLoading(false));
  }, []);

  // Get the actual username to send (with underscore prefix for bedrock)
  const getActualUsername = () => {
    if (platform === 'bedrock') {
      return `_${minecraftName.trim()}`;
    }
    return minecraftName.trim();
  };

  // Validate username based on platform
  const validateUsername = () => {
    const username = minecraftName.trim();
    
    if (!username) {
      toast.error("Masukkan Minecraft name Anda");
      return false;
    }

    if (platform === 'java') {
      // Java: 3-16 characters, alphanumeric & underscore
      const javaRegex = /^[a-zA-Z0-9_]{3,16}$/;
      if (!javaRegex.test(username)) {
        toast.error("Format Java username tidak valid (3-16 karakter, huruf, angka, underscore)");
        return false;
      }
    } else {
      // Bedrock: 3-16 characters, can include spaces and special chars
      // We'll add underscore prefix automatically
      if (username.length < 3 || username.length > 16) {
        toast.error("Username Bedrock harus 3-16 karakter");
        return false;
      }
      // Check if user accidentally added underscore
      if (username.startsWith('_')) {
        toast.error("Tidak perlu menambahkan underscore (_) di awal. Sistem akan menambahkannya otomatis.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUsername()) return;

    if (!serverTypeId) {
      toast.error("Pilih server yang ingin kamu masuki");
      return;
    }

    setLoading(true);

    try {
      const actualUsername = getActualUsername();
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/player`,
        { minecraftName: actualUsername, serverTypeId }
      );

      const { token, minecraftName: verifiedName, verification } = response.data.data;
      
      localStorage.setItem('token', token);
      loginUser(verifiedName, token, serverTypeId);
      
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
                  Pilih platform dan masukkan username
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Server Type Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Server className="w-4 h-4 text-purple-400" />
                    Pilih Server
                  </label>
                  {serverTypesLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memuat server...</span>
                    </div>
                  ) : serverTypes.length === 0 ? (
                    <p className="text-sm text-gray-500">Tidak ada server tersedia.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {serverTypes.map(st => (
                        <motion.button
                          key={st.id}
                          type="button"
                          onClick={() => setServerTypeId(st.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                            serverTypeId === st.id
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {st.image ? (
                              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/servers/${st.image}`}
                                alt={st.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                serverTypeId === st.id ? 'bg-purple-500/20' : 'bg-gray-700/50'
                              }`}>
                                <Server className={`w-4 h-4 ${serverTypeId === st.id ? 'text-purple-400' : 'text-gray-400'}`} />
                              </div>
                            )}
                            <span className={`font-semibold text-sm truncate ${
                              serverTypeId === st.id ? 'text-purple-300' : 'text-gray-300'
                            }`}>{st.name}</span>
                          </div>
                          {serverTypeId === st.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Pilih Platform
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Java Button */}
                    <motion.button
                      type="button"
                      onClick={() => setPlatform('java')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        platform === 'java'
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      {platform === 'java' && (
                        <motion.div
                          layoutId="platform-indicator"
                          className="absolute inset-0 border-2 border-emerald-500 rounded-xl"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="relative flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg ${platform === 'java' ? 'bg-emerald-500/20' : 'bg-gray-700/50'}`}>
                          <Monitor className={`w-6 h-6 ${platform === 'java' ? 'text-emerald-400' : 'text-gray-400'}`} />
                        </div>
                        <span className={`font-bold text-sm ${platform === 'java' ? 'text-emerald-400' : 'text-gray-400'}`}>
                          Java Edition
                        </span>
                        <span className="text-xs text-gray-500">PC / Mac</span>
                      </div>
                      {platform === 'java' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </motion.button>

                    {/* Bedrock Button */}
                    <motion.button
                      type="button"
                      onClick={() => setPlatform('bedrock')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        platform === 'bedrock'
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      {platform === 'bedrock' && (
                        <motion.div
                          layoutId="platform-indicator"
                          className="absolute inset-0 border-2 border-orange-500 rounded-xl"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <div className="relative flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-lg ${platform === 'bedrock' ? 'bg-orange-500/20' : 'bg-gray-700/50'}`}>
                          <Smartphone className={`w-6 h-6 ${platform === 'bedrock' ? 'text-orange-400' : 'text-gray-400'}`} />
                        </div>
                        <span className={`font-bold text-sm ${platform === 'bedrock' ? 'text-orange-400' : 'text-gray-400'}`}>
                          Bedrock Edition
                        </span>
                        <span className="text-xs text-gray-500">Mobile / Console</span>
                      </div>
                      {platform === 'bedrock' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-400" />
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <User className="w-4 h-4 text-purple-400" />
                    {platform === 'java' ? 'Java Username' : 'Bedrock Gamertag'}
                  </label>
                  
                  <div className="relative">
                    {/* Bedrock Prefix Indicator */}
                    <AnimatePresence>
                      {platform === 'bedrock' && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                        >
                          <span className="text-orange-400 font-mono font-bold text-lg">_</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <Input
                      type="text"
                      placeholder={platform === 'java' ? 'Contoh: Steve123' : 'Contoh: Steve123'}
                      value={minecraftName}
                      onChange={(e) => setMinecraftName(e.target.value)}
                      className={`bg-black/60 border-purple-500/30 focus:border-purple-500/50 h-12 text-base rounded-xl transition-all text-white placeholder:text-gray-500 ${
                        platform === 'bedrock' ? 'pl-8' : ''
                      }`}
                      maxLength={16}
                      required
                      autoFocus
                    />
                    
                    {minecraftName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Badge className={`${
                          platform === 'java' 
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                            : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        } text-xs px-2 py-1`}>
                          {minecraftName.length}/16
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    {platform === 'java' 
                      ? '3-16 karakter (huruf, angka, underscore)'
                      : '3-16 karakter, underscore (_) akan ditambahkan otomatis'
                    }
                  </p>
                </div>

                {/* Preview Username */}
                <AnimatePresence mode="wait">
                  {minecraftName && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-3 rounded-xl border ${
                        platform === 'java'
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-orange-500/5 border-orange-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Username yang akan digunakan:</span>
                        <span className={`font-mono font-bold ${
                          platform === 'java' ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {getActualUsername()}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Platform Info */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-xl border ${
                      platform === 'java'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-orange-500/5 border-orange-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {platform === 'java' ? (
                        <>
                          <Monitor className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-emerald-400 mb-1">Java Edition</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              Masukkan username Minecraft Java Anda seperti biasa. 
                              Username harus pernah join server minimal 1x.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-orange-400 mb-1">Bedrock Edition</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              Masukkan Gamertag Xbox/PlayStation Anda <span className="font-semibold text-orange-400">tanpa underscore</span>. 
                              Sistem akan otomatis menambahkan prefix <code className="text-orange-400 font-mono bg-orange-500/10 px-1 rounded">_</code> untuk Bedrock player.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

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
                  className={`w-full h-12 text-base font-bold rounded-xl transition-all border ${
                    platform === 'java'
                      ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:via-green-500 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 border-emerald-400/30'
                      : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:via-amber-500 hover:to-orange-500 shadow-lg shadow-orange-500/20 border-orange-400/30'
                  } disabled:opacity-50`}
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>VERIFYING...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {platform === 'java' ? (
                        <Monitor className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                      <span>SIGN IN AS {platform === 'java' ? 'JAVA' : 'BEDROCK'}</span>
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