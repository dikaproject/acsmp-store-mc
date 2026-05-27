import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Zap, Shield, Trophy, Star, Play } from "lucide-react";

const MCSTATUS_API = 'https://api.mcsrvstat.us/bedrock/3/';
const SERVER_IP = 'amazingcraft.org';
const SERVER_PORT = 19132;

const CTASection = () => {
  const [serverData, setServerData] = useState(null);
  const [playersOnline, setPlayersOnline] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch server status from mcsrvstat.us
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`${MCSTATUS_API}${SERVER_IP}`);
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
    { icon: Zap, label: "Instant Delivery" },
    { icon: Shield, label: "Secure Payment" },
    { icon: Trophy, label: "Best Prices" },
    { icon: Star, label: "24/7 Support" }
  ];

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-ink" style={{ minHeight: '600px' }}>
      {/* Editorial atmospheric background */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(116,80,163,0.10)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(116,80,163,0.06)_0%,transparent_50%)]" />
      </div>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-ink/30" />

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
            className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30 mb-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
            <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
              Join Amazing Craft Today
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl text-bone mb-6 leading-[1.05]"
          >
            Ready to start your
            <span className="block mt-2 italic text-arcane">
              Epic Adventure?
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-bone-muted mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Join thousands of players in the ultimate Minecraft survival experience.
            <span className="block mt-2 text-bone">
              No registration required. Start playing now.
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
              <button
                className="group inline-flex items-center gap-3 px-12 py-5 bg-arcane text-bone font-medium text-sm uppercase tracking-widest hover:bg-arcane-glow transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Playing Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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
                  <div className="p-5 bg-ink-elevated border border-ink-border hover:border-arcane/40 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-arcane mx-auto mb-3" strokeWidth={1.75} />
                    <p className="text-xs text-bone uppercase tracking-widest text-center">
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
            className="mt-12 inline-flex items-center gap-3 px-5 py-2.5 bg-ink-elevated border border-ink-border"
          >
            <div className={`w-1.5 h-1.5 ${isOnline ? 'bg-arcane' : 'bg-[hsl(var(--danger))]'}`} />
            <span className="text-bone text-sm">
              {isOnline ? 'Server Online' : 'Server Offline'} ·
              <span className="ml-1 font-mono">
                {playersOnline} Players
              </span> · <span className="font-mono">{SERVER_IP}</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;