import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BookOpen,
  Image,
  Server,
  LogOut,
  ChevronRight,
  Link2
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/admin/dashboard",
      description: "Overview & analytics"
    },
    { 
      icon: Server, 
      label: "Server Types", 
      path: "/admin/server-types",
      description: "Manage server types"
    },
    { 
      icon: Package, 
      label: "Products", 
      path: "/admin/products",
      description: "Manage products"
    },
    { 
      icon: ShoppingCart, 
      label: "Orders", 
      path: "/admin/orders",
      description: "View all orders"
    },
    { 
      icon: Users, 
      label: "Users", 
      path: "/admin/users",
      description: "User management"
    },
    { 
      icon: Link2, 
      label: "Linktree", 
      path: "/admin/linktree",
      description: "Manage link page"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/admin/settings",
      description: "System settings"
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-[#13151a] border-r border-gray-800/50 z-40 backdrop-blur-xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800/50">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 group"
            onClick={() => onClose && onClose()}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <LayoutDashboard className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Amazing Craft</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full group relative"
              >
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}>
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`} />
                  
                  <div className="flex-1 text-left">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`text-xs transition-opacity duration-200 ${
                      isActive 
                        ? "text-emerald-400/60 opacity-100" 
                        : "text-gray-500 opacity-0 group-hover:opacity-100"
                    }`}>
                      {item.description}
                    </span>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 ${
                    isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-100 group-hover:translate-x-0"
                  }`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="p-4 border-t border-gray-800/50 space-y-3">
          {/* User Profile Card */}
          <div className="group p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#13151a] rounded-full">
                  <div className="w-full h-full bg-emerald-400 rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-white truncate group-hover:text-emerald-400 transition-colors">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 transition-all group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;