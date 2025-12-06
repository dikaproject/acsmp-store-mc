import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Shield, Trophy, Star, Play } from "lucide-react";
import LiquidEther from "../ui/LiquidEther";

const MCSRVSTAT_API = 'https://api.mcsrvstat.us/3/';
const SERVER_IP = 'amazingcraft.org';
const SERVER_PORT = 25565;

const CTASection = () => {
  const [serverData, setServerData] = useState(null);
  const [playersOnline, setPlayersOnline] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch server status
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`${MCSRVSTAT_API}${SERVER_IP}`);
        const data = await response.json();
        
        if (data.online) {
          setIsOnline(true);
          setPlayersOnline(data.players?.online || 0);
          setServerData(data);
        } else {
          setIsOnline(false);
          setPlayersOnline(0);
        }
      } catch (error) {
        setIsOnline(false);
        setPlayersOnline(0);
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Zap, label: "Instant Delivery", color: "text-purple-400" },
    { icon: Shield, label: "Secure Payment", color: "text-pink-400" },
    { icon: Trophy, label: "Best Prices", color: "text-cyan-400" },
    { icon: Star, label: "24/7 Support", color: "text-emerald-400" }
  ];

  return (
    <section className="relative py-32 md:py-40 overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white uppercase tracking-wider">
              Join Amazing Craft Today
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Orbitron', 'Rajdhani', 'Inter', sans-serif" }}
          >
            Ready to Start Your
            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Epic Adventure?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
          >
            Join thousands of players in the ultimate Minecraft survival experience.
            <span className="block mt-2 text-white font-semibold">
              No registration required. Start playing now!
            </span>
          </motion.p>

          {/* CTA Buttons - Matching Hero Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <a href={`minecraft://?addExternalServer=${encodeURIComponent('Amazing Craft')}|${SERVER_IP}:${SERVER_PORT}`}>
              <motion.button
                className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white font-black text-lg uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-500/30 border border-purple-400/30"
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
                <span className="relative z-10">Start Playing Now</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-xl" />
              </motion.button>
            </a>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group"
                >
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                    <Icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
                    <p className="text-sm text-white font-medium">
                      {feature.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Server info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
            className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
            </div>
            <span className="text-white font-medium">
              {isOnline ? 'Server Online' : 'Server Offline'} • 
              <motion.span
                key={playersOnline}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-1"
              >
                {playersOnline} Players
              </motion.span> • {SERVER_IP}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;