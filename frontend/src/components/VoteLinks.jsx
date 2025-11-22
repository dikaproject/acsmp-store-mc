import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, Heart, Gift, Clock, Zap, Star, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { SpotlightCard } from "./ui/SpotlightCard";
import axios from "axios";

const VoteLinks = () => {
  const [voteLinks, setVoteLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVoteLinks();
  }, []);

  const fetchVoteLinks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`
      );
      const links = response.data.data.voteLinks 
        ? JSON.parse(response.data.data.voteLinks) 
        : [];
      setVoteLinks(links);
    } catch (error) {
      console.error("Error fetching vote links:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || voteLinks.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.03),transparent_70%)]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-full mb-6 backdrop-blur-xl"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
          >
            <Heart className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Support the Server</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Vote & Get Rewards
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Help us grow and claim instant rewards! Vote every 24 hours.
          </p>
        </motion.div>

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
              <SpotlightCard 
                className="rounded-2xl"
                spotlightColor="rgba(139, 92, 246, 0.2)"
              >
                <div className="relative p-8 bg-gradient-to-br from-[#0f1015] via-[#0a0b0f] to-black rounded-2xl border border-purple-500/20 backdrop-blur-xl overflow-hidden group shadow-2xl shadow-purple-500/10">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
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
                            Every 24h
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-purple-400" />
                            +1 Point
                          </span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-purple-500/40">
                        <ExternalLink className="w-7 h-7 text-white" />
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
                        <Button
                          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-purple-500/30 text-base py-6 font-semibold transition-all duration-300"
                        >
                          <Heart className="w-5 h-5 mr-2 fill-current" />
                          Vote Now
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoteLinks;