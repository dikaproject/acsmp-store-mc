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

const SERVER_IP = 'amazingcraft.org';
const SERVER_PORT = 19132;

const AboutSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: "1K+", label: "Active Players" },
    { icon: Trophy, value: "156", label: "Events Held" },
    { icon: Shield, value: "99.9%", label: "Uptime" },
    { icon: Star, value: "4.9", label: "Rating" }
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
      className="relative py-24 md:py-32 bg-ink overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.04)_0%,transparent_60%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(212,165,116,0.2) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(212,165,116,0.2) 1px, transparent 1px)`,
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
            className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30"
          >
            <div className="w-1.5 h-1.5 bg-arcane" />
            <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
              About Us
            </span>
            <Sparkles className="w-3.5 h-3.5 text-arcane" />
          </motion.div>

          {/* Title */}
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
            <span className="block text-bone mb-2">
              The ultimate Minecraft
            </span>
            <span className="block italic text-arcane">
              gaming experience
            </span>
          </h2>

          <p className="text-base md:text-lg text-bone-muted max-w-2xl mx-auto leading-relaxed">
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
              <div className="absolute inset-0 bg-arcane/10 blur-3xl" />
              
              <div className="relative p-8 bg-ink-elevated border border-ink-border">
                <img
                  src="/logo.png"
                  alt="Amazing Craft Logo"
                  className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 bg-ink-elevated border border-ink-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-arcane" />
                <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">Our Story</span>
              </div>
              <p className="text-bone-muted leading-relaxed">
                Founded in 2020, Amazing Craft has grown into one of the most beloved Minecraft communities.
                We started with a simple vision: create a server where creativity meets competition,
                and every player feels at home.
              </p>
              <p className="text-bone-muted leading-relaxed">
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
                  <div
                    key={index}
                    className="relative group p-6 bg-ink-elevated border border-ink-border hover:border-arcane/40 transition-colors duration-200"
                  >
                    <Icon className="w-6 h-6 text-arcane mb-3" strokeWidth={1.75} />
                    <div className="font-mono text-3xl text-bone mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-bone-subtle uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-arcane" />
                <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">Core Values</span>
              </div>

              <div className="space-y-3">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-ink-elevated border border-ink-border hover:border-arcane/40 transition-colors duration-200 group"
                    >
                      <div className="p-2.5 bg-arcane/15 border border-arcane/30 flex-shrink-0">
                        <Icon className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-display text-lg text-bone mb-1">
                          {value.title}
                        </h4>
                        <p className="text-sm text-bone-muted leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
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
          <div className="inline-block p-10 bg-ink-elevated border border-ink-border">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-arcane" strokeWidth={1.75} />
              <h3 className="font-display text-3xl text-bone">
                Ready to join the adventure?
              </h3>
            </div>

            <p className="text-bone-muted mb-8 max-w-2xl mx-auto leading-relaxed">
              Be part of our growing community and experience Minecraft like never before
            </p>

            <a href={`minecraft://?addExternalServer=${encodeURIComponent('Amazing Craft')}|${SERVER_IP}:${SERVER_PORT}`}>
              <button
                className="group inline-flex items-center gap-3 px-10 py-4 bg-arcane text-bone font-medium text-sm uppercase tracking-widest hover:bg-arcane-glow transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
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