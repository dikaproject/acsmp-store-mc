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
  },
  {
    id: 2,
    title: "Active Community",
    description: "Join 15K+ players with weekly events and competitive guild systems",
    icon: Users,
    image: communityImg,
  },
  {
    id: 3,
    title: "Ranked System",
    description: "Compete globally with seasonal rewards and exclusive leaderboards",
    icon: Trophy,
    image: rankedImg,
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

  const SERVER_IP = 'amazingcraft.org';
  const SERVER_PORT = 19132;

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-32 overflow-hidden bg-black"
      style={{}}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(116,80,163,0.06)_0%,transparent_60%)]" />
      
      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(116,80,163,0.15) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(116,80,163,0.15) 1px, transparent 1px)`,
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
            className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30"
          >
            <div className="w-1.5 h-1.5 bg-arcane" />
            <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
              Premium Features
            </span>
            <Sparkles className="w-3.5 h-3.5 text-arcane" />
          </motion.div>

          {/* Main Title */}
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
            <span className="block text-bone mb-2">
              Experience features
            </span>
            <span className="block italic text-arcane">
              that set us apart
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-bone-muted max-w-2xl mx-auto leading-relaxed">
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
                  className="!p-0 !rounded-none !border-ink-border !bg-ink-elevated h-full"
                  spotlightColor="rgba(116, 80, 163, 0.1)"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="p-3 bg-arcane/15 border border-arcane/30 transition-all duration-300">
                        <Icon className="w-5 h-5 text-arcane" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-2xl text-bone leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-bone-muted leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="pt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-px bg-arcane w-8" />
                      <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
                        Explore
                      </span>
                    </div>
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
          <p className="text-bone-muted mb-8">
            Ready to elevate your gaming experience?
          </p>
          <a href={`minecraft://?addExternalServer=${encodeURIComponent('Amazing Craft')}|${SERVER_IP}:${SERVER_PORT}`}>
            <button
              className="inline-flex items-center gap-3 px-10 py-4 bg-arcane text-bone font-medium text-sm uppercase tracking-widest hover:bg-arcane-glow transition-colors"
            >
              <span>Start Playing Now</span>
            </button>
          </a>
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