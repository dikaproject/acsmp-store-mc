import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const AnimatedGradientText = ({ 
  children, 
  className = "",
  gradient = "from-emerald-400 via-cyan-400 to-emerald-400"
}) => {
  return (
    <motion.span
      className={cn(
        "inline-block bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        className
      )}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  );
};

