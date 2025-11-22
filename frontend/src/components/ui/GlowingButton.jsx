import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const GlowingButton = ({ 
  children, 
  className = "", 
  variant = "primary",
  onClick,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]",
    outline: "border-2 border-emerald-500/50 hover:border-emerald-400 text-emerald-400 hover:bg-emerald-500/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all duration-300",
        variants[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

