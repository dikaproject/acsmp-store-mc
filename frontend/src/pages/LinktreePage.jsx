import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  MessageCircle,
  Youtube,
  Instagram,
  Music,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { getIconComponent } from "../lib/iconResolver";
import { getImageUrl } from "../lib/utils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Gradient presets mapping
const gradientPresets = {
  "from-purple-500 to-violet-600": "bg-gradient-to-r from-purple-500 to-violet-600",
  "from-blue-500 to-cyan-500": "bg-gradient-to-r from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500": "bg-gradient-to-r from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500": "bg-gradient-to-r from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500": "bg-gradient-to-r from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-500": "bg-gradient-to-r from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-purple-500": "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  "from-cyan-500 to-blue-500": "bg-gradient-to-r from-cyan-500 to-blue-500",
  "from-amber-500 to-yellow-500": "bg-gradient-to-r from-amber-500 to-yellow-500",
  "from-red-500 to-rose-500": "bg-gradient-to-r from-red-500 to-rose-500",
};

const getGradientClass = (bg) => {
  if (!bg) return "bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20";
  if (gradientPresets[bg]) return gradientPresets[bg];
  return `bg-gradient-to-r ${bg}`;
};

const getGlowColor = (bg) => {
  if (!bg) return "shadow-purple-500/20";
  if (bg.includes("purple") || bg.includes("violet") || bg.includes("fuchsia")) return "shadow-purple-500/25";
  if (bg.includes("blue") || bg.includes("indigo") || bg.includes("cyan")) return "shadow-blue-500/25";
  if (bg.includes("emerald") || bg.includes("teal")) return "shadow-emerald-500/25";
  if (bg.includes("orange") || bg.includes("amber") || bg.includes("yellow")) return "shadow-amber-500/25";
  if (bg.includes("rose") || bg.includes("pink") || bg.includes("red")) return "shadow-rose-500/25";
  return "shadow-purple-500/20";
};

const LinktreePage = () => {
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, settingsRes] = await Promise.all([
        axios.get(`${API_URL}/linktree`),
        axios.get(`${API_URL}/settings`),
      ]);
      setLinks(linksRes.data.data || []);
      setSettings(settingsRes.data.data || {});
    } catch (error) {
      console.error("Error fetching linktree data:", error);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { key: "discord", icon: MessageCircle, label: "Discord", color: "hover:text-indigo-400" },
    { key: "youtube", icon: Youtube, label: "YouTube", color: "hover:text-red-400" },
    { key: "instagram", icon: Instagram, label: "Instagram", color: "hover:text-pink-400" },
    { key: "tiktok", icon: Music, label: "TikTok", color: "hover:text-cyan-400" },
    { key: "email", icon: Mail, label: "Email", color: "hover:text-emerald-400", prefix: "mailto:" },
    { key: "whatsapp", icon: Phone, label: "WhatsApp", color: "hover:text-green-400", prefix: "https://wa.me/" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const profileVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050507" }}>
        <div className="text-center">
          <motion.div
            className="relative w-14 h-14 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-[3px] border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-[3px] border-purple-500 border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-500 text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  const title = settings.linktreeTitle || settings.serverName || "My Links";
  const bio = settings.linktreeBio || "";
  const avatarUrl = settings.linktreeAvatar || "";
  const bgColor = settings.linktreeBgColor || "#050507";
  const bgImage = settings.linktreeBgImage || "";

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Background Image */}
      {bgImage && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <img
            src={getImageUrl(bgImage)}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/[0.04] blur-[100px]" />
        
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12 md:py-16">
        {/* Profile Section */}
        <motion.div
          variants={profileVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-10 max-w-sm"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-full blur-md opacity-60" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/10 bg-[#13151a]">
              {avatarUrl ? (
                <img
                  src={getImageUrl(avatarUrl)}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-[3px] border-[#050507] rounded-full">
              <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75" />
            </div>
          </div>

          {/* Name */}
          <h1
            className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {title}
          </h1>

          {/* Bio */}
          {bio && (
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
              {bio}
            </p>
          )}

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {socialLinks.map((social) => {
              const value = settings[social.key];
              if (!value) return null;
              const href = social.prefix
                ? `${social.prefix}${value}`
                : value.startsWith("http")
                ? value
                : `https://${value}`;
              return (
                <motion.a
                  key={social.key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:bg-white/[0.1] hover:border-white/[0.15] hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-3"
        >
          {links.map((link) => {
            const IconComponent = getIconComponent(link.icon);
            const hasBg = !!link.backgroundColor;
            const gradientClass = getGradientClass(link.backgroundColor);
            const glowClass = getGlowColor(link.backgroundColor);

            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative block w-full rounded-2xl p-[1px] transition-shadow duration-300 hover:shadow-xl ${glowClass}`}
              >
                {/* Card inner */}
                <div
                  className={`relative rounded-2xl px-5 py-4 flex items-center gap-4 overflow-hidden ${
                    hasBg
                      ? `${gradientClass} text-white`
                      : "bg-[#0f1015] border border-white/[0.06] text-white hover:border-purple-500/20"
                  }`}
                >
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" 
                    style={{ transition: "transform 0.8s ease, opacity 0.3s ease" }}
                  />

                  {/* Icon */}
                  <div
                    className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      hasBg
                        ? "bg-white/20"
                        : "bg-purple-500/10 border border-purple-500/20"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${hasBg ? "text-white" : "text-purple-400"}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[15px] truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className={`text-xs truncate mt-0.5 ${hasBg ? "text-white/70" : "text-gray-500"}`}>
                        {link.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      hasBg ? "bg-white/10" : "bg-white/[0.03]"
                    }`}
                  >
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                        hasBg ? "text-white/80" : "text-gray-500 group-hover:text-purple-400"
                      }`}
                    />
                  </div>
                </div>
              </motion.a>
            );
          })}

          {/* Empty state */}
          {links.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <p className="text-gray-500 text-sm">No links available yet</p>
            </motion.div>
          )}
        </motion.div>

        {/* Footer branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-xs tracking-widest uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {settings.serverName || title}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LinktreePage;
