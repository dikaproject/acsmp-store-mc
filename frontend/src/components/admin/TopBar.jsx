import { Menu, Bell, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const TopBar = ({ onMenuClick }) => {
  return (
    <div className="sticky top-0 z-30 border-b border-gray-800/50 bg-[#0a0b0f]/80 backdrop-blur-xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={onMenuClick}
                className="border-gray-800 hover:bg-gray-900"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-gray-600 transition-all w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
              />
            </div>
          </div>
          
          {/* Right Section - Status & Notifications */}
          <div className="flex items-center gap-3">
            {/* Online Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-xs font-medium text-emerald-400">Online</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-800/50 transition-all group">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <Badge 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-[#0a0b0f]"
              >
                3
              </Badge>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;