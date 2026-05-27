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
            className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30 mb-6"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-3.5 h-3.5 text-arcane" strokeWidth={1.75} />
            <span className="text-[11px] text-arcane font-medium uppercase tracking-widest">Support the Server</span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl text-bone mb-4">
            Vote & get rewards
          </h2>
          <p className="text-bone-muted max-w-2xl mx-auto leading-relaxed">
            Help us grow and claim instant rewards. Vote every 24 hours.
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
                className="!rounded-none"
                spotlightColor="rgba(212, 165, 116, 0.08)"
              >
                <div className="relative p-8 bg-ink-elevated border border-ink-border overflow-hidden group">
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="font-display text-2xl text-bone mb-3">
                          {link.name}
                        </h3>
                        <div className="flex items-center gap-4 text-[10px] text-bone-subtle uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Every 24h
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-arcane" />
                            +1 Point
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-5 h-5 text-arcane" strokeWidth={1.75} />
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
                        <Button className="w-full bg-arcane text-bone hover:bg-arcane-glow text-sm py-5 font-medium uppercase tracking-widest transition-colors">
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