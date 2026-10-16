import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MessageCircle,
  Instagram, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  Heart,
  Zap,
  Music,
  ShoppingBag,
  Home,
  Package,
  ExternalLink,
  Vote,
  CreditCard
} from "lucide-react";
import axios from "axios";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`
      );
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinksCol1 = [
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: ShoppingBag },
    { name: "Produk Digital", path: "/digital-products", icon: Package },
    { name: "Vote", path: "/vote", icon: Heart },
  ];

  const quickLinksCol2 = [
    { name: "Track Order", path: "/track", icon: Package },
  ];

  // Dynamic social links based on settings
  const socialLinks = [
    { 
      key: 'discord',
      icon: MessageCircle, 
      label: "Discord",
      color: "from-indigo-500 to-blue-500"
    },
    { 
      key: 'youtube',
      icon: Youtube, 
      label: "YouTube",
      color: "from-red-500 to-red-600"
    },
    { 
      key: 'instagram',
      icon: Instagram, 
      label: "Instagram",
      color: "from-pink-500 to-purple-500"
    },
    { 
      key: 'tiktok',
      icon: Music, 
      label: "TikTok",
      color: "from-gray-700 to-gray-900"
    },
  ].filter(social => settings[social.key]);

  return (
    <footer className="relative bg-ink border-t border-ink-border overflow-hidden">
      {/* Enhanced Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-arcane/5 via-ink to-ink" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-arcane/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(116,80,163,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(116,80,163,0.04)_0%,transparent_50%)]" />
        
        {/* Animated mesh grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(116,80,163,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(116,80,163,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Brand & Description - Larger Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Logo - clean, no card wrapper */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Amazing Craft Logo"
                className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h3 className="text-2xl font-display text-bone tracking-tight">
                  Amazing Craft
                </h3>
                <p className="text-xs text-bone-subtle uppercase tracking-widest">Premium Minecraft Server</p>
              </div>
            </Link>

            <p className="text-bone-muted text-sm leading-relaxed max-w-md">
              Join thousands of players in our premium Minecraft server with custom features,
              active community, and unforgettable adventures. Experience next-gen survival gameplay today.
            </p>

            {/* Server Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-arcane/10 border border-arcane/30">
              <div className="w-1.5 h-1.5 bg-arcane" />
              <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">Server Online · 24/7</span>
            </div>
          </motion.div>

          {/* Quick Links - Column 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="text-bone font-medium mb-6 flex items-center gap-3 text-xs uppercase tracking-widest">
              <div className="w-6 h-px bg-arcane" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinksCol1.map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-bone-muted hover:text-arcane transition-colors duration-200 inline-flex items-center gap-2.5 group"
                  >
                    <link.icon className="w-4 h-4 text-bone-subtle group-hover:text-arcane transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform font-medium">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links - Column 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <h3 className="text-bone font-medium mb-6 flex items-center gap-3 text-xs uppercase tracking-widest">
              <div className="w-6 h-px bg-arcane" />
              Services
            </h3>
            <ul className="space-y-3">
              {quickLinksCol2.map((link, index) => (
                <motion.li 
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-bone-muted hover:text-arcane transition-colors duration-200 inline-flex items-center gap-2.5 group"
                  >
                    <link.icon className="w-4 h-4 text-bone-subtle group-hover:text-arcane transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform font-medium">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h3 className="text-bone font-medium mb-6 flex items-center gap-3 text-xs uppercase tracking-widest">
              <div className="w-6 h-px bg-arcane" />
              Contact Us
            </h3>
            
            <div className="space-y-4">
              {/* Contact Items */}
              {settings.location && (
                <motion.div 
                  className="flex items-start gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-arcane/10 flex items-center justify-center border border-arcane/20 flex-shrink-0 group-hover:border-arcane/40 transition-colors">
                    <MapPin className="w-5 h-5 text-arcane" />
                  </div>
                  <div>
                    <p className="text-xs text-bone-subtle mb-1 uppercase tracking-widest">Location</p>
                    <p className="text-sm text-bone-muted leading-relaxed">{settings.location}</p>
                  </div>
                </motion.div>
              )}
              
              {settings.email && (
                <motion.div 
                  className="flex items-start gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-arcane/10 flex items-center justify-center border border-arcane/20 flex-shrink-0 group-hover:border-arcane/40 transition-colors">
                    <Mail className="w-5 h-5 text-arcane" />
                  </div>
                  <div>
                    <p className="text-xs text-bone-subtle mb-1 uppercase tracking-widest">Email</p>
                    <a 
                      href={`mailto:${settings.email}`}
                      className="text-sm text-bone-muted hover:text-arcane transition-colors break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </motion.div>
              )}
              
              {settings.whatsapp && (
                <motion.div 
                  className="flex items-start gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 bg-arcane/10 flex items-center justify-center border border-arcane/20 flex-shrink-0 group-hover:border-arcane/40 transition-colors">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-bone-subtle mb-1 uppercase tracking-widest">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-bone-muted hover:text-arcane transition-colors"
                    >
                      {settings.whatsapp}
                    </a>
                  </div>
                </motion.div>
              )}

              {loading && (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Social Links */}
            {!loading && socialLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-bone-subtle mb-4 uppercase tracking-widest">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.key}
                      href={settings[social.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                      aria-label={social.label}
                    >
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-100 absolute inset-0 blur-lg transition-opacity`} />
                      <div className="h-11 w-11 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all relative border border-white/10 group-hover:border-white/20 backdrop-blur-sm">
                        <social.icon className="h-5 w-5 text-bone-muted group-hover:text-arcane transition-colors" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="text-sm text-bone-muted">
                © {currentYear} <span className="text-bone font-medium">Amazing Craft</span>. All rights reserved.
              </p>
              <p className="text-xs text-bone-subtle mt-1">
                Made with <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block text-red-500"
                >❤️</motion.span> for Minecraft Community
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <a
                href="https://nexuscloud.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="relative">
                  <div className="relative flex items-center gap-2 px-5 py-2.5 bg-ink-elevated border border-ink-border group-hover:border-arcane/50 transition-colors">
                    <span className="text-xs text-bone-muted font-medium">Powered by</span>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-arcane" />
                      <span className="font-medium text-arcane">
                        NexusCloud
                      </span>
                      <ExternalLink className="w-3 h-3 text-arcane opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
