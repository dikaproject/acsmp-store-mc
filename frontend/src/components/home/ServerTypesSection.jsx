import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  Server,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { HoverBorderGradient } from "../ui/HoverBorderGradient";

const ServerTypesSection = ({ serverTypes = [] }) => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);

  // Enhanced fallback data with CSS variables for gradients
  const defaultServers = [
    {
      id: 1,
      name: "Survival",
      description:
        "Experience the ultimate survival gameplay with custom features, economy system, and land protection. Build your empire from scratch.",
      imageUrl: null,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      gradientColors: {
        "--gradient-color-1": "#10b981",
        "--gradient-color-2": "#06b6d4",
      },
      icon: "⚔️",
    },
    {
      id: 2,
      name: "Skyblock",
      description:
        "Start with nothing on a floating island. Build, trade, and compete with unique challenges and custom island features.",
      imageUrl: null,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      gradientColors: {
        "--gradient-color-1": "#3b82f6",
        "--gradient-color-2": "#a855f7",
      },
      icon: "☁️",
    },
    {
      id: 3,
      name: "Creative",
      description:
        "Unlimited resources and creative freedom. Build anything you imagine with WorldEdit support and plot protection.",
      imageUrl: null,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      gradientColors: {
        "--gradient-color-1": "#a855f7",
        "--gradient-color-2": "#ec4899",
      },
      icon: "🎨",
    },
  ];

  const servers = serverTypes.length > 0 ? serverTypes : defaultServers;

  // Auto-rotation with smooth animation
  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % servers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoplay, servers.length]);

  // Drag animation
  useEffect(() => {
    const controls = animate(x, 0, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });

    return controls.stop;
  }, [x]);

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % servers.length);
    setAutoplay(false);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + servers.length) % servers.length);
    setAutoplay(false);
  };

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

      {/* Minimal grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
            <Server className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Server Types
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-gray-400 text-lg">Swipe through our game modes</p>
        </motion.div>

        {/* Main Content - Testimonial Style with Drag */}
        <div className="max-w-6xl mx-auto" ref={constraintsRef}>
          <motion.div
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ x }}
          >
            {/* Left: Image/Icon */}
            <div className="relative cursor-grab active:cursor-grabbing">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-square rounded-3xl overflow-hidden"
                >
                  {servers[active].imageUrl ? (
                    <>
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL?.replace("/api", "") ||
                          "http://localhost:5000"
                        }${servers[active].imageUrl}`}
                        alt={servers[active].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${servers[active].gradient} flex items-center justify-center relative`}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-9xl relative z-10"
                      >
                        {servers[active].icon}
                      </motion.span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Content */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  {/* Server name */}
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
                      {servers[active].name}
                    </h3>
                    <motion.div
                      className={`h-1 w-16 bg-gradient-to-r ${servers[active].gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: 64 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                  </div>

                  {/* Quote-style description */}
                  <blockquote className="relative">
                    <div className="absolute -left-2 -top-2 text-6xl text-white/5 font-serif">
                      "
                    </div>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed relative z-10 mb-6">
                      {servers[active].description}
                    </p>
                  </blockquote>

                  {/* Enhanced CTA with HoverBorderGradient + Better Padding */}
                  <Link to={`/shop?server=${servers[active].id}`}>
                    <HoverBorderGradient
                      as="div"
                      containerClassName="inline-block cursor-pointer"
                      className="px-6 py-3"
                      duration={2}
                    >
                      <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                        <span className="text-base font-semibold text-white">
                          Explore {servers[active].name}
                        </span>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </motion.div>
                    </HoverBorderGradient>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-8">
                {/* Prev/Next buttons */}
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Previous server"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Next server"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Dots indicator */}
                <div className="flex gap-2 ml-4">
                  {servers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActive(index);
                        setAutoplay(false);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        index === active
                          ? "w-8 bg-white"
                          : "w-1.5 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to ${servers[index].name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServerTypesSection;
