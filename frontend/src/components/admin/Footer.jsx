import { Heart, Shield, Code } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/\[0.06\] bg-[#13151a]/50 backdrop-blur-xl mt-auto">
      <div className="px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section - Copyright & Credits */}
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>by</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                IntechCode Enterprise
              </span>
              <span className="text-gray-600">×</span>
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                NexusCloud
              </span>
            </div>
          </div>

          {/* Right Section - License Notice */}
          <div className="flex flex-col md:flex-row items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400 font-medium">
                Licensed - Not for Resale
              </span>
            </div>
            <span className="text-gray-500">
              © {currentYear} All rights reserved
            </span>
          </div>
        </div>

        {/* Additional Info - Optional */}
        <div className="mt-4 pt-4 border-t border-gray-800/30">
          <p className="text-xs text-center text-gray-500">
            This admin panel is proprietary software. Unauthorized distribution, modification, or resale is strictly prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





