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
    <div className="absolute inset-0 bg-ink" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,165,116,0.04)_0%,transparent_60%)]" />
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
    axios.get(`${import.meta.env.VITE_API_URL}/server-types?isActive=true`)
      .then(res => {
        const list = res.data?.data || [];
        setServerTypes(list);
        // No auto-select — user must pick a server
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

      const { token, minecraftName: verifiedName, verification, currentRank } = response.data.data;
      
      const selectedServer = serverTypes.find(s => String(s.id) === String(serverTypeId));
      const serverName = selectedServer?.name || null;

      localStorage.setItem('token', token);
      loginUser(verifiedName, token, serverTypeId, currentRank || null, serverName);
      
      toast.success(
        <div>
          <p className="font-semibold">Selamat datang, {verifiedName}!</p>
          {currentRank && (
            <p className="text-xs text-arcane mt-0.5">
              Rank aktif: <span className="font-medium">{currentRank}</span>
            </p>
          )}
          <p className="text-xs text-bone-muted mt-1">
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
            <p className="text-xs text-bone-muted mt-1">
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
    <div className="min-h-screen relative overflow-hidden bg-ink">
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-arcane/10 border border-arcane/30 mb-6">
              <img src="/logo.png" alt="Amazing Craft" className="w-10 h-10 object-contain" />
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl text-bone mb-2">
              Amazing Craft
            </h1>

            <p className="text-sm text-bone-muted mb-6">
              Premium Minecraft Server
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30">
              <div className="w-1.5 h-1.5 bg-arcane" />
              <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
                Player Login
              </span>
              <Sparkles className="w-3.5 h-3.5 text-arcane" />
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
            <div className="absolute -top-px left-0 right-0 h-px bg-arcane" />

            <div className="bg-ink-elevated border border-ink-border p-6 md:p-8">

              {/* Form Title */}
              <div className="mb-6">
                <h2 className="font-display text-3xl text-bone mb-1">
                  Sign in
                </h2>
                <p className="text-sm text-bone-muted">
                  Pilih platform dan masukkan username
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Server Type Selection */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-medium text-bone-muted uppercase tracking-widest mb-3">
                    <Server className="w-3.5 h-3.5 text-arcane" />
                    Pilih Server
                  </label>
                  {serverTypesLoading ? (
                    <div className="flex items-center gap-2 text-bone-subtle text-sm py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memuat server...</span>
                    </div>
                  ) : serverTypes.length === 0 ? (
                    <p className="text-sm text-bone-subtle">Tidak ada server tersedia.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {serverTypes.map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setServerTypeId(st.id)}
                          className={`relative p-3 border transition-colors text-left ${
                            serverTypeId === st.id
                              ? 'border-arcane bg-arcane/10'
                              : 'border-ink-border bg-ink hover:border-bone-subtle'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {st.image ? (
                              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/servers/${st.image}`}
                                alt={st.name} className="w-8 h-8 object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                                serverTypeId === st.id ? 'bg-arcane/20' : 'bg-ink-elevated'
                              }`}>
                                <Server className={`w-4 h-4 ${serverTypeId === st.id ? 'text-arcane' : 'text-bone-subtle'}`} strokeWidth={1.75} />
                              </div>
                            )}
                            <span className={`text-sm truncate ${
                              serverTypeId === st.id ? 'text-arcane' : 'text-bone-muted'
                            }`}>{st.name}</span>
                          </div>
                          {serverTypeId === st.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-arcane" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-medium text-bone-muted uppercase tracking-widest mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-arcane" />
                    Pilih Platform
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Java Button */}
                    <button
                      type="button"
                      onClick={() => setPlatform('java')}
                      className={`relative p-4 border transition-colors ${
                        platform === 'java'
                          ? 'border-arcane bg-arcane/10'
                          : 'border-ink-border bg-ink hover:border-bone-subtle'
                      }`}
                    >
                      <div className="relative flex flex-col items-center gap-2">
                        <div className={`p-2 ${platform === 'java' ? 'bg-arcane/20' : 'bg-ink-elevated'}`}>
                          <Monitor className={`w-5 h-5 ${platform === 'java' ? 'text-arcane' : 'text-bone-subtle'}`} strokeWidth={1.75} />
                        </div>
                        <span className={`text-sm ${platform === 'java' ? 'text-arcane' : 'text-bone-muted'}`}>
                          Java Edition
                        </span>
                        <span className="text-[10px] text-bone-subtle uppercase tracking-widest">PC / Mac</span>
                      </div>
                      {platform === 'java' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-arcane" />
                        </div>
                      )}
                    </button>

                    {/* Bedrock Button */}
                    <button
                      type="button"
                      onClick={() => setPlatform('bedrock')}
                      className={`relative p-4 border transition-colors ${
                        platform === 'bedrock'
                          ? 'border-arcane bg-arcane/10'
                          : 'border-ink-border bg-ink hover:border-bone-subtle'
                      }`}
                    >
                      <div className="relative flex flex-col items-center gap-2">
                        <div className={`p-2 ${platform === 'bedrock' ? 'bg-arcane/20' : 'bg-ink-elevated'}`}>
                          <Smartphone className={`w-5 h-5 ${platform === 'bedrock' ? 'text-arcane' : 'text-bone-subtle'}`} strokeWidth={1.75} />
                        </div>
                        <span className={`text-sm ${platform === 'bedrock' ? 'text-arcane' : 'text-bone-muted'}`}>
                          Bedrock Edition
                        </span>
                        <span className="text-[10px] text-bone-subtle uppercase tracking-widest">Mobile / Console</span>
                      </div>
                      {platform === 'bedrock' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-arcane" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Username Input */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-medium text-bone-muted uppercase tracking-widest mb-2">
                    <User className="w-3.5 h-3.5 text-arcane" />
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
                          <span className="text-arcane font-mono font-medium text-lg">_</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <Input
                      type="text"
                      placeholder={platform === 'java' ? 'Contoh: Steve123' : 'Contoh: Steve123'}
                      value={minecraftName}
                      onChange={(e) => setMinecraftName(e.target.value)}
                      className={`bg-ink border-ink-border focus:border-arcane h-12 text-base transition-colors text-bone placeholder:text-bone-subtle ${
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
                            ? 'bg-arcane/15 text-arcane border-arcane/30'
                            : 'bg-arcane/15 text-arcane border-arcane/30'
                        } text-xs px-2 py-1`}>
                          {minecraftName.length}/16
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-bone-subtle mt-2 flex items-center gap-1.5">
                    <Info className="w-3 h-3" />
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
                      className={`p-3 border ${
                        platform === 'java'
                          ? 'bg-arcane/5 border-arcane/30'
                          : 'bg-arcane/5 border-arcane/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-bone-muted">Username yang akan digunakan:</span>
                        <span className="font-mono text-arcane">
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
                    className="p-4 bg-arcane/5 border border-arcane/30"
                  >
                    <div className="flex items-start gap-3">
                      {platform === 'java' ? (
                        <>
                          <Monitor className="w-4 h-4 text-arcane flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                          <div>
                            <h4 className="text-[11px] font-medium text-arcane mb-1 uppercase tracking-widest">Java Edition</h4>
                            <p className="text-xs text-bone-muted leading-relaxed">
                              Masukkan username Minecraft Java Anda seperti biasa.
                              Username harus pernah join server minimal 1x.
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4 text-arcane flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                          <div>
                            <h4 className="text-[11px] font-medium text-arcane mb-1 uppercase tracking-widest">Bedrock Edition</h4>
                            <p className="text-xs text-bone-muted leading-relaxed">
                              Masukkan Gamertag Xbox/PlayStation Anda <span className="text-arcane">tanpa underscore</span>.
                              Sistem akan otomatis menambahkan prefix <code className="text-arcane font-mono bg-arcane/10 px-1">_</code> untuk Bedrock player.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Info Alert */}
                <div className="p-4 bg-arcane/5 border border-arcane/30">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-arcane flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                    <div>
                      <h4 className="text-[11px] font-medium text-arcane mb-1 uppercase tracking-widest">Penting</h4>
                      <p className="text-xs text-bone-muted leading-relaxed">
                        Username harus pernah join server minimal 1x dan data akan tersinkronisasi otomatis.
                        Login juga akan membaca{" "}
                        <span className="text-arcane">rank aktif kamu</span>{" "}
                        untuk menampilkan harga upgrade rank yang sesuai secara otomatis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-sm font-medium uppercase tracking-widest transition-colors bg-arcane text-bone hover:bg-arcane-glow disabled:opacity-50"
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
                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-arcane/5 border border-arcane/30">
                      <span className="text-sm">{feature.icon}</span>
                      <span className="text-[10px] font-medium text-arcane uppercase tracking-widest">
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-6 pt-6 border-t border-ink-border text-center">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex items-center gap-2 text-xs text-bone-subtle hover:text-arcane transition-colors"
                >
                  <Shield className="w-3 h-3" />
                  <span className="uppercase tracking-widest">Admin Portal</span>
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
            <p className="text-xs text-bone-subtle">
              © 2024 Amazing Craft. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);