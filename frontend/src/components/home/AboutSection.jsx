import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Users, 
  Trophy, 
  Shield, 
  Zap, 
  Globe, 
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Target
} from "lucide-react";

const SERVER_IP = 'play.acsmp.xyz';
const SERVER_PORT = 19132;

const AboutSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: "1K+", label: "Active Players", color: "purple" },
    { icon: Trophy, value: "156", label: "Events Held", color: "violet" },
    { icon: Shield, value: "99.9%", label: "Uptime", color: "fuchsia" },
    { icon: Star, value: "4.9", label: "Rating", color: "purple" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We prioritize our players and create a welcoming environment for everyone"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly developing unique features and gameplay mechanics"
    },
    {
      icon: Shield,
      title: "Fair Play",
      description: "Anti-cheat systems and dedicated staff ensure fair competition"
    },
    {
      icon: Target,
      title: "Quality",
      description: "Premium hardware and optimized plugins for the best experience"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
      style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
    >
      {/* Deep Dark Purple Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 space-y-6"
        >
          {/* Badge */}
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
              About Us
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "'Orbitron', 'Rajdhani', 'Inter', sans-serif" }}>
            <span className="block text-white mb-3">
              The Ultimate Minecraft
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400">
              Gaming Experience
            </span>
          </h2>

          <p className="text-base md:text-lg text-gray-400 font-medium max-w-3xl mx-auto">
            Join thousands of players in our premium Minecraft server with custom features, 
            active community, and unforgettable adventures
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto mb-20">
          
          {/* Left: Logo & Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Logo Container */}
            <div className="relative">
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl rounded-full"
              />
              
              <div className="relative p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-purple-500/30">
                <motion.img
                  src="/logo.png"
                  alt="Amazing Craft Logo"
                  className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 bg-gradient-to-br from-purple-500/5 to-violet-500/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Our Story
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Founded in 2020, Amazing Craft has grown into one of the most beloved Minecraft communities. 
                We started with a simple vision: create a server where creativity meets competition, 
                and every player feels at home.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Today, we're proud to host thousands of active players, run weekly events, 
                and continuously innovate with custom plugins and features that make your gameplay unique.
              </p>
            </div>
          </motion.div>

          {/* Right: Stats & Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`relative group p-6 rounded-2xl bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 backdrop-blur-xl border border-${stat.color}-500/30 overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-400/10 to-${stat.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <Icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
                    <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-300`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Our Core Values
              </h3>
              
              <div className="space-y-3">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group"
                    >
                      <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-purple-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                          {value.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {value.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-purple-500/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Ready to Join the Adventure?
              </h3>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Be part of our growing community and experience Minecraft like never before
            </p>

            <a href={`minecraft://?addExternalServer=${encodeURIComponent('Amazing Craft')}|${SERVER_IP}:${SERVER_PORT}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white font-black text-base uppercase tracking-wider overflow-hidden shadow-lg shadow-purple-500/30 border border-purple-400/30"
                style={{ fontFamily: "'Rajdhani', 'Inter', sans-serif" }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <Sparkles className="w-5 h-5 relative z-10" />
                <span className="relative z-10">JOIN NOW</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-xl" />
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutSection;