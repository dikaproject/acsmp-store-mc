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
  Link2,
  Terminal,
  Ticket
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
      icon: Terminal, 
      label: "RCON Config", 
      path: "/admin/rcon",
      description: "Manage RCON servers"
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
      icon: Image, 
      label: "Gallery", 
      path: "/admin/gallery",
      description: "Kelola foto gallery"
    },
    { 
      icon: BookOpen, 
      label: "Panduan", 
      path: "/admin/guides",
      description: "Kelola panduan & tutorial"
    },
    { 
      icon: Ticket, 
      label: "Vouchers", 
      path: "/admin/vouchers",
      description: "Kode promo & diskon"
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
      className={`fixed left-0 top-0 h-screen w-64 bg-[#0d0e13] border-r border-white/[0.06] z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 group"
            onClick={() => onClose && onClose()}
          >
            <div className="w-9 h-9 rounded-lg bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-4 h-4 text-arcane" />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-white">Amazing Craft</h1>
              <p className="text-[11px] text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full group"
              >
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "bg-arcane/10 text-arcane"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-arcane rounded-r-full" />
                  )}
                  
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium block">{item.label}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-arcane/20 border border-arcane/30 flex items-center justify-center text-arcane text-sm font-semibold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            className="w-full bg-transparent hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/[0.06] hover:border-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;





