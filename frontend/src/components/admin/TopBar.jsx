import { Menu, Bell, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const TopBar = ({ onMenuClick }) => {
  return (
    <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0a0b0f]/90 backdrop-blur-md">
      <div className="px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={onMenuClick}
                className="border-white/10 bg-transparent hover:bg-white/5 text-gray-400"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/10 transition-colors w-56">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 w-full"
              />
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-arcane/10 border border-arcane/20">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>

            <button className="relative p-2 rounded-lg hover:bg-white/[0.05] transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;





