import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-6 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-white border border-gray-800/50 hover:border-emerald-500/50 justify-between flex flex-col space-y-4 overflow-hidden relative",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 group-hover/bento:from-emerald-500/10 group-hover/bento:to-cyan-500/10 transition-all duration-500" />
      
      <div className="relative z-10">
        {header}
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          {icon}
          <div className="font-bold text-neutral-200 mb-2 mt-2">
            {title}
          </div>
          <div className="font-normal text-neutral-400 text-sm">
            {description}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

