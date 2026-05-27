import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ExternalLink,
  Heart,
  Trophy,
  Star,
  Users,
  Gift,
  Sparkles,
  ChevronRight,
  Award,
  Zap,
  Clock,
  Camera,
  Play
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import axios from "axios";

const VotePage = () => {
  const [voteLinks, setVoteLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const settingsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`
      );
      const links = settingsRes.data.data.voteLinks 
        ? JSON.parse(settingsRes.data.data.voteLinks) 
        : [];
      setVoteLinks(links);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const rewards = [
    {
      icon: Gift,
      title: "Vote Rewards",
      description: "In-game items setiap vote",
      color: "emerald"
    },
    {
      icon: Trophy,
      title: "Top Voter",
      description: "Hadiah bulanan untuk top voter",
      color: "amber"
    },
    {
      icon: Star,
      title: "Vote Points",
      description: "Kumpulkan poin dari setiap vote",
      color: "blue"
    },
    {
      icon: Award,
      title: "VIP Rank",
      description: "Unlock rank VIP lebih cepat",
      color: "purple"
    }
  ];

  const stats = [
    { label: "Total Votes", value: "12.5K+", icon: Heart },
    { label: "Active Voters", value: "850+", icon: Users },
    { label: "Rewards Given", value: "5.2K+", icon: Gift }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <motion.div 
            className="relative w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-arcane/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-arcane border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-arcane/5 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(116,80,163,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(116,80,163,0.2) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(116,80,163,0.2) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>


      {/* Hero Section with Photo Highlight */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink/80 border border-arcane/30 rounded-full mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full bg-arcane animate-pulse" />
                <TrendingUp className="w-4 h-4 text-arcane" />
                <span className="text-sm text-arcane font-semibold">Support Us</span>
                <Sparkles className="w-4 h-4 text-arcane" />
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight md:leading-[1.2] overflow-visible">
                <span className="block text-white ">
                  Vote & Get
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-arcane via-arcane-glow to-arcane py-2 pb-3">
                  Amazing Rewards
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
                Dukung server kami dan dapatkan hadiah eksklusif! Setiap vote sangat berarti untuk perkembangan komunitas.
              </p>

              {/* Stats Mini */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-center p-3 md:p-4 rounded-xl bg-ink-elevated border border-arcane/20"
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-arcane mx-auto mb-2" />
                      <p className="text-xl md:text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <motion.a
                  href="#vote-section"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-arcane text-bone hover:bg-arcane-glow shadow-lg shadow-arcane/20 px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-bold">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Vote Sekarang
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                  </Button>
                </motion.a>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Lihat Rewards
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Photo Highlight */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Main Photo Card */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-arcane rounded-3xl blur-xl opacity-15 group-hover:opacity-25 transition-opacity" />
                
                <div className="relative overflow-hidden rounded-3xl border border-arcane/30 bg-black/60 backdrop-blur-xl">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src="/foto-highlight.webp"
                      alt="Amazing Craft Community"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                    
                    {/* Floating badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-4 left-4"
                    >
                      <Badge className="bg-black/60 backdrop-blur-xl border-arcane/30 text-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
                        <Camera className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                        Community Highlight
                      </Badge>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="absolute top-4 right-4"
                    >
                      <Badge className="bg-arcane/15 backdrop-blur-xl border-arcane/40 text-arcane px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm">
                        <Users className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                        850+ Players
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 md:p-6 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-xl border-t border-arcane/20">
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-bold text-white mb-2">
                          Join Our Amazing Community! 🎮
                        </h3>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                          Ratusan player berkumpul bersama membangun dunia yang luar biasa. Vote dan jadilah bagian dari keluarga besar kami!
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0 hover:bg-arcane/25 transition-colors"
                      >
                        <Heart className="w-4 h-4 md:w-5 md:h-5 text-arcane" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-arcane/30 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
            >
              <Gift className="w-4 h-4 text-arcane" />
              <span className="text-sm text-arcane font-semibold">Rewards</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 px-4 overflow-visible leading-tight">
              Dapatkan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcane to-arcane-glow inline-block py-1">
                Hadiah Menarik
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4">
              Setiap vote memberikan keuntungan langsung untuk karaktermu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {rewards.map((reward, index) => {
              const Icon = reward.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative p-5 md:p-6 rounded-2xl bg-ink-elevated border border-arcane/20 hover:border-arcane/40 hover:-translate-y-1 transition-all group">
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-arcane/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    
                    <div className="relative">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-${reward.color}-500/20 to-${reward.color}-600/20 border border-${reward.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 md:w-7 md:h-7 text-${reward.color}-400`} />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white mb-2">
                        {reward.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vote Links Section */}
      <section id="vote-section" className="py-12 md:py-16 pb-20 md:pb-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-arcane/30 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
            >
              <Heart className="w-4 h-4 text-arcane" />
              <span className="text-sm text-arcane font-semibold">Vote Links</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 px-4 overflow-visible leading-tight">
              Dukung{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcane to-arcane-glow inline-block py-1">
                Server Kami
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg px-4">
              Vote setiap 24 jam dan kumpulkan rewards menarik!
            </p>
          </motion.div>

          {voteLinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl bg-arcane/10 border border-arcane/30 flex items-center justify-center">
                <ExternalLink className="w-10 h-10 md:w-12 md:h-12 text-gray-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                Belum Ada Vote Links
              </h3>
              <p className="text-sm md:text-base text-gray-400">
                Vote links akan segera tersedia
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
              {voteLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative p-6 md:p-8 rounded-2xl bg-ink-elevated border border-arcane/30 hover:border-arcane/50 hover:-translate-y-1 transition-all group overflow-hidden">
                    {/* Subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-arcane/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg md:text-xl mb-3 group-hover:text-arcane transition-colors">
                            {link.name}
                          </h3>
                          <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Setiap 24 jam
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-arcane" />
                              +1 Point
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-arcane" />
                        </div>
                      </div>
                      
                      {/* Vote Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div>
                          <Button className="w-full bg-arcane text-bone hover:bg-arcane-glow shadow-lg shadow-arcane/20 py-5 md:py-6 font-bold text-sm md:text-base">
                            <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                            Vote Sekarang
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                          </Button>
                        </div>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VotePage;