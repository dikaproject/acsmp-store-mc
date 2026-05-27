import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play, Zap, Shield, Crown } from "lucide-react";
import backgroundImage from "../../assets/background-mc.jpg";
import { useEffect, useMemo, useState } from "react";

const MCSTATUS_API = 'https://api.mcsrvstat.us/bedrock/3/';
const SERVER_IP = 'amazingcraft.org';
const SERVER_PORT = 19132;

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [playersOnline, setPlayersOnline] = useState(892);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Preload images
  useEffect(() => {
    const images = [backgroundImage, '/logo.png'];
    let loadedCount = 0;

    images.forEach(src => {
      const img = new Image();
      img.src = src;
      
      if (img.complete) {
        loadedCount++;
      } else {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setIsLoaded(true);
            setTimeout(() => setShowContent(true), 50);
          }
        };
      }
    });

    if (loadedCount === images.length) {
      setIsLoaded(true);
      setShowContent(true);
    }
  }, []);

  // Fetch live player count from mcsrvstat.us
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`${MCSTATUS_API}${SERVER_IP}`);
        const data = await response.json();
        
        if (data.online) {
          setIsServerOnline(true);
          setPlayersOnline(data.players?.online || 0);
        } else {
          setIsServerOnline(false);
          setPlayersOnline(0);
        }
      } catch (error) {
        setIsServerOnline(false);
        setPlayersOnline(0);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0
      }
    }
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }), [shouldReduceMotion]);

  const logoVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }), [shouldReduceMotion]);

  if (!isLoaded) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-ink">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border border-ink-border rounded-full" />
            <div
              className="absolute inset-0 border border-transparent border-t-arcane animate-spin rounded-full"
              style={{ animationDuration: "1.2s" }}
            />
          </div>
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 border border-arcane/30 bg-arcane/5">
              <p className="text-arcane text-xs uppercase tracking-widest">Loading</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Optimized Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={backgroundImage}
          alt="Minecraft Background"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/90 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(116,80,163,0.14),transparent_55%)]" />
      </motion.div>

      {/* Main Content */}
      {showContent && (
        <div className="container mx-auto px-6 relative z-20 pt-32 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <motion.div 
                className="space-y-7"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{}}
              >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                  <div
                    className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-arcane" />
                    <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">Premium Indonesian Server</span>
                    <div className="w-px h-3 bg-arcane/30" />
                    <div className="w-1.5 h-1.5 bg-arcane" />
                  </div>
                </motion.div>

                {/* Title - Better Font */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.02] text-left text-bone">
                    <span className="block text-white drop-shadow-2xl mb-2">
                      AMAZING
                    </span>
                    <span className="block italic text-arcane">
                      CRAFT
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-gray-300 leading-relaxed text-left max-w-lg font-medium">
                    Next-gen Minecraft survival with{" "}
                    <span className="text-arcane">custom features</span> and{" "}
                    <span className="text-arcane">epic gameplay</span>
                  </p>
                </motion.div>

                {/* Info Cards - Optimized */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { icon: Zap, label: "Online", value: playersOnline },
                    { icon: Shield, label: "Uptime", value: "99.9%" },
                    { icon: Crown, label: "Support", value: "24/7" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-4 bg-ink-elevated border border-ink-border hover:border-arcane/40 transition-colors duration-200"
                    >
                      <item.icon className="w-4 h-4 text-arcane mb-2" />
                      <div className="text-[10px] text-bone-subtle uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="font-mono text-lg text-bone">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons - Custom Styled */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <a href={`minecraft://?addExternalServer=${encodeURIComponent('AmazingCraft')}|${SERVER_IP}:${SERVER_PORT}`}>
                    <button
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-arcane text-bone font-medium text-sm uppercase tracking-widest hover:bg-arcane-glow transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Playing</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </a>

                  <Link to="/shop">
                    <button
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent text-bone font-medium text-sm uppercase tracking-widest border border-ink-border hover:border-arcane hover:text-arcane transition-colors"
                    >
                      <span>Explore Shop</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </motion.div>

                {/* Server Status */}
                <motion.div variants={itemVariants}>
                  <div className={`inline-flex items-center gap-3 px-4 py-2 border ${
                    isServerOnline
                      ? 'bg-arcane/8 border-arcane/30'
                      : 'bg-[hsl(var(--danger))]/5 border-[hsl(var(--danger))]/30'
                  }`}>
                    <div className={`w-1.5 h-1.5 ${
                      isServerOnline ? 'bg-arcane' : 'bg-[hsl(var(--danger))]'
                    }`} />
                    <span className="text-[11px] font-medium text-bone uppercase tracking-widest">
                      {isServerOnline ? 'Online' : 'Offline'}
                    </span>
                    <div className="h-3 w-px bg-ink-border" />
                    <span className="text-xs font-mono text-bone-muted">
                      {SERVER_IP}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Logo */}
              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-arcane/8 blur-3xl" />
                <div className="relative z-10 p-12 bg-ink-elevated/40 border border-arcane/20">
                  <img
                    src="/logo.png"
                    alt="Server Logo"
                    className="w-full h-auto max-w-md"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-ink via-ink/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;