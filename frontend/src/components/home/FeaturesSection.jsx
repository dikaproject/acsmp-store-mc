import React, { useState, useRef } from "react";
import { Shield, Users, Trophy, Zap, Headphones, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";
import panelImg from "../../assets/panel.png";
import communityImg from "/foto-highlight.webp";
import rankedImg from "../../assets/ranked.png";
import customPluginImg from "../../assets/costum-plugin.png";
import support from "../../assets/support-dc.png";

const features = [
  {
    id: 1,
    title: "Anti-Lag System",
    description: "Premium hardware with maximum optimization for ultra-smooth gameplay experience",
    icon: Shield,
    image: panelImg,
    glowColor: "from-purple-400 to-violet-400",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400"
  },
  {
    id: 2,
    title: "Active Community",
    description: "Join 15K+ players with weekly events and competitive guild systems",
    icon: Users,
    image: communityImg,
    glowColor: "from-violet-400 to-purple-400",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400"
  },
  {
    id: 3,
    title: "Ranked System",
    description: "Compete globally with seasonal rewards and exclusive leaderboards",
    icon: Trophy,
    image: rankedImg,
    glowColor: "from-fuchsia-400 to-purple-400",
    iconBg: "bg-fuchsia-500/20",
    iconColor: "text-fuchsia-400"
  },
  
];

export function FeaturesSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 overflow-hidden bg-black"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      {/* Deep Dark Purple Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.05)_0%,transparent_50%)]" />
      
      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 space-y-6"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/30"
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            </div>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 uppercase tracking-widest">
              Premium Features
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "'Orbitron', 'Rajdhani', 'Inter', sans-serif" }}>
            <span className="block text-white mb-3">
              Experience Features
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 animate-gradient">
              That Set Us Apart
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 font-medium max-w-3xl mx-auto">
            Powered by cutting-edge technology with exclusive features designed for the ultimate gaming experience
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                className="group relative"
              >
                <SpotlightCard 
                  className="!p-0 !rounded-2xl !border-purple-500/20 !bg-black/60 backdrop-blur-xl h-full"
                  spotlightColor={
                    feature.id === 1 ? "rgba(168, 85, 247, 0.1)" :
                    feature.id === 2 ? "rgba(139, 92, 246, 0.1)" :
                    feature.id === 3 ? "rgba(217, 70, 239, 0.1)" :
                    feature.id === 4 ? "rgba(168, 85, 247, 0.1)" :
                    "rgba(139, 92, 246, 0.1)"
                  }
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-purple-950/30 to-violet-950/30 rounded-t-2xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 group-hover:via-black/50" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`p-3 rounded-xl ${feature.iconBg} backdrop-blur-md border border-purple-500/30 shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <Icon className={`w-6 h-6 ${feature.iconColor} transition-transform duration-300 group-hover:rotate-12`} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl md:text-2xl font-black text-white transition-all duration-300 group-hover:translate-x-1" style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                      {feature.description}
                    </p>

                    {/* Hover Indicator */}
                    <div className="pt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                      <div className={`h-[2px] bg-gradient-to-r ${feature.glowColor} transition-all duration-300 w-0 group-hover:w-8`} />
                      <span className={`text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r ${feature.glowColor}`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                        EXPLORE
                      </span>
                    </div>
                  </div>

                  {/* Subtle Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-gray-400 mb-6">
            Ready to elevate your gaming experience?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white font-black text-base uppercase tracking-wider overflow-hidden group shadow-lg shadow-purple-500/30 border border-purple-400/30"
            style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}
          >
            <span className="relative z-10">Start Playing Now</span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Custom CSS */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}