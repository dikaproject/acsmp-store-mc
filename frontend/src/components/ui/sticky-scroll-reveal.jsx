"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
  content,
  contentClassName
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  // Improved image preloading
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const preloadPromises = content.map((item) => {
          if (item.content && item.content.props?.src) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.src = item.content.props.src;
              img.onload = resolve;
              img.onerror = reject;
            });
          }
          return Promise.resolve();
        });
        
        await Promise.all(preloadPromises);
        setImagesLoaded(true);
        console.log("All images preloaded successfully");
      } catch (error) {
        console.error("Error preloading images:", error);
        // Still set as loaded even if there's an error to prevent blocking the UI
        setImagesLoaded(true);
      }
    };
    
    preloadImages();
  }, [content]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index;
      }
      return acc;
    }, 0);
    
    if (activeCard !== closestBreakpointIndex) {
      setActiveCard(closestBreakpointIndex);
    }
  });

  // Parallax transforms for Framer-like effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <motion.div
      className="relative flex h-[50rem] md:h-[40rem] justify-center space-x-6 md:space-x-16 overflow-y-auto rounded-2xl p-6 md:p-16"
      ref={ref}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
      {/* Left Content */}
      <div className="relative flex items-start px-4 md:px-8">
        <div className="max-w-3xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-24 md:my-32 first:mt-0">
              {item.icon && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                  style={{ y: yOffset }}
                >
                  {item.icon}
                </motion.div>
              )}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-100 mt-6"
                style={{ scale, y: yOffset }}
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                className="text-lg md:text-xl mt-8 max-w-2xl text-slate-300 leading-relaxed"
                style={{ y: yOffset }}
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-60" />
        </div>
      </div>

      {/* Right Sticky Content - Fixed version with better transitions */}
      <div
        className={cn(
          "sticky top-10 hidden h-[200px] md:h-[300px] lg:h-[400px] w-[600px] rounded-2xl lg:block",
          contentClassName
        )}>
        {/* Loading state */}
        {!imagesLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-black/40 rounded-2xl border border-white/10">
            <div className="w-8 h-8 border-t-2 border-emerald-400 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Image transition container */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="crossfade">
            {content.map((item, index) => (
              activeCard === index && (
                <motion.div
                  key={`image-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  }}
                  exit={{ 
                    opacity: 0,
                    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                  }}
                  className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                  style={{
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    transform: "translate3d(0, 0, 0)"
                  }}
                >
                  {item.content}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};