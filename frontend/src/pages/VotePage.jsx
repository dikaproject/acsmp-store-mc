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
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full" />
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
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </div>

      {/* Subtle animated orb */}
      <motion.div
        className="fixed top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Hero Section with Photo Highlight */}
      <section className="relative pt-24 pb-16">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-full mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400 font-semibold">Support Us</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                <span className="block text-white mb-2">
                  Vote & Get
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400">
                  Amazing Rewards
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Dukung server kami dan dapatkan hadiah eksklusif! Setiap vote sangat berarti untuk perkembangan komunitas.
              </p>

              {/* Stats Mini */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-center p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-purple-500/10"
                    >
                      <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#vote-section"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 px-8 py-6 text-base font-bold">
                    <Heart className="w-5 h-5 mr-2" />
                    Vote Sekarang
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.a>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-purple-500/20 hover:bg-purple-500/5 px-8 py-6 text-base font-semibold text-gray-300">
                    <Trophy className="w-5 h-5 mr-2" />
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
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                
                <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-black/60 backdrop-blur-xl">
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
                      <Badge className="bg-black/60 backdrop-blur-xl border-purple-500/30 text-white px-4 py-2">
                        <Camera className="w-4 h-4 mr-2" />
                        Community Highlight
                      </Badge>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="absolute top-4 right-4"
                    >
                      <Badge className="bg-purple-500/20 backdrop-blur-xl border-purple-500/30 text-purple-400 px-4 py-2">
                        <Users className="w-4 h-4 mr-2" />
                        850+ Players
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Caption */}
                  <div className="p-6 bg-gradient-to-b from-black/80 to-black/95 backdrop-blur-xl border-t border-purple-500/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">
                          Join Our Amazing Community! 🎮
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Ratusan player berkumpul bersama membangun dunia yang luar biasa. Vote dan jadilah bagian dari keluarga besar kami!
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 hover:bg-purple-500/30 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-purple-400" />
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
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
            >
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-semibold">Rewards</span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 px-4">
              Dapatkan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 inline-block">
                Hadiah Menarik
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg px-4">
              Setiap vote memberikan keuntungan langsung untuk karaktermu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {rewards.map((reward, index) => {
              const Icon = reward.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group">
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                    
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${reward.color}-500/20 to-${reward.color}-600/20 border border-${reward.color}-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 text-${reward.color}-400`} />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
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
      <section id="vote-section" className="py-16 pb-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-full mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
            >
              <Heart className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-semibold">Vote Links</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 px-4">
              Dukung{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 inline-block">
                Server Kami
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg px-4">
              Vote setiap 24 jam dan kumpulkan rewards menarik!
            </p>
          </motion.div>

          {voteLinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-center">
                <ExternalLink className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Belum Ada Vote Links
              </h3>
              <p className="text-gray-400">
                Vote links akan segera tersedia
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {voteLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group overflow-hidden">
                    {/* Subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-xl mb-3 group-hover:text-purple-300 transition-colors">
                            {link.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Setiap 24 jam
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-purple-400" />
                              +1 Point
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <ExternalLink className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                      
                      {/* Vote Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg shadow-purple-500/20 py-6 font-bold text-base">
                            <Heart className="w-5 h-5 mr-2" />
                            Vote Sekarang
                            <ChevronRight className="w-5 h-5 ml-2" />
                          </Button>
                        </motion.div>
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