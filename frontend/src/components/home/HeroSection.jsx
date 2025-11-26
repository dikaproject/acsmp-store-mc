import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play, Zap, Shield, Crown } from "lucide-react";
import backgroundImage from "../../assets/background-mc.jpg";
import { GlowingButton } from "../ui/GlowingButton";
import { GridPattern } from "../ui/GridPattern";
import { useEffect, useMemo, useState } from "react";

const MCSRVSTAT_API = 'https://api.mcsrvstat.us/3/';
const SERVER_IP = 'play.acsmp.xyz';
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

  // Fetch live player count
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`${MCSRVSTAT_API}${SERVER_IP}:${SERVER_PORT}`);
        const data = await response.json();
        
        if (data.online) {
          setIsServerOnline(true);
          setPlayersOnline(data.players?.online || 0);
        } else {
          setIsServerOnline(false);
        }
      } catch (error) {
        console.error('Error fetching server status:', error);
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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-950/50">
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-violet-400"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-300 border-l-violet-300"
            />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 blur-md" />
            <div className="absolute inset-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-400" />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <p className="text-purple-400 font-bold text-sm tracking-wider" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
                LOADING...
              </p>
            </div>
          </motion.div>
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-violet-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent_50%)]" />
        <GridPattern />
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
                style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
              >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-purple-500/10 border border-purple-500/30 backdrop-blur-sm relative overflow-hidden group"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-400 relative z-10" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest relative z-10">
                      Premium Server
                    </span>
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse relative z-10" />
                  </motion.div>
                </motion.div>

                {/* Title - Better Font */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] text-left" style={{ fontFamily: "'Orbitron', 'Rajdhani', 'Inter', sans-serif" }}>
                    <span className="block text-white drop-shadow-2xl mb-2">
                      AMAZING
                    </span>
                    <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      CRAFT
                    </span>
                  </h1>

                  <p className="text-base md:text-lg text-gray-300 leading-relaxed text-left max-w-lg font-medium">
                    Next-gen Minecraft survival with{" "}
                    <span className="text-purple-400 font-bold">custom features</span> and{" "}
                    <span className="text-violet-400 font-bold">epic gameplay</span>
                  </p>
                </motion.div>

                {/* Info Cards - Optimized */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { icon: Zap, label: "Online", value: playersOnline, color: "purple" },
                    { icon: Shield, label: "Uptime", value: "99.9%", color: "violet" },
                    { icon: Crown, label: "Support", value: "24/7", color: "fuchsia" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`px-3 py-3 rounded-xl bg-${item.color}-500/5 backdrop-blur-sm border border-${item.color}-500/20 hover:border-${item.color}-400/40 transition-colors duration-200`}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className={`w-4 h-4 text-${item.color}-400 mb-1.5`} />
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{item.label}</div>
                      <div className={`text-lg font-black text-${item.color}-400`} style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}>
                        {item.value}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons - Custom Styled */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <a href={`minecraft://?addExternalServer=${encodeURIComponent('AmazingCraft')}|${SERVER_IP}:${SERVER_PORT}`}>
                    <motion.button
                      className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white font-black text-base uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-500/30 border border-purple-400/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}
                    >
                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Button content */}
                      <Play className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                      <span className="relative z-10">START PLAYING</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-xl" />
                    </motion.button>
                  </a>

                  <Link to="/shop">
                    <motion.button
                      className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-transparent text-white font-black text-base uppercase tracking-wider overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}
                    >
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-violet-600/20 to-purple-600/20"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <span className="relative z-10 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all">
                        EXPLORE SHOP
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Server Status */}
                <motion.div variants={itemVariants}>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border ${
                    isServerOnline 
                      ? 'bg-purple-500/5 border-purple-500/20' 
                      : 'bg-red-500/5 border-red-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isServerOnline ? 'bg-purple-400 animate-pulse' : 'bg-red-400'
                    }`} />
                    <span className="text-xs font-black text-white uppercase tracking-widest" style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}>
                      {isServerOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                    <div className="h-3 w-px bg-white/20" />
                    <span className="text-xs font-mono font-bold text-gray-300">
                      {SERVER_IP}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Optimized Logo */}
              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                className="relative hidden lg:flex items-center justify-center"
              >
                {/* Simplified glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl rounded-full"
                  animate={shouldReduceMotion ? {} : {
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Logo container */}
                <div className="relative z-10 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20">
                  <motion.img
                    src="/logo.png"
                    alt="Server Logo"
                    className="w-full h-auto max-w-md drop-shadow-2xl"
                    animate={shouldReduceMotion ? {} : {
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                {/* Minimal particles */}
                {!shouldReduceMotion && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full ${
                          i === 0 ? 'bg-purple-400/40' : i === 1 ? 'bg-violet-400/40' : 'bg-fuchsia-400/40'
                        } blur-sm`}
                        style={{
                          top: `${30 + i * 20}%`,
                          [i % 2 === 0 ? 'left' : 'right']: `${10 + i * 10}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.5
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Single rotating ring */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute inset-0 border border-purple-400/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>

            </div>
          </div>
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;