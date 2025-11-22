import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { minecraftName, isUserLoggedIn, logoutUser } = useAuthStore();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Vote", path: "/vote" },
    { name: "Track Order", path: "/track" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div 
          className={cn(
            "transition-all duration-700 ease-in-out",
            isScrolled 
              ? "py-3 px-4 md:py-4 md:px-6" 
              : "py-0 px-0"
          )}
        >
          <div
            className={cn(
              "relative w-full transition-all duration-700 ease-in-out",
              isScrolled
                ? "mx-auto max-w-6xl"
                : "mx-0 max-w-none"
            )}
          >
            <div
              className={cn(
                "relative w-full overflow-hidden transition-all duration-700 ease-in-out",
                isScrolled
                  ? "rounded-full bg-black/80 backdrop-blur-2xl shadow-2xl shadow-emerald-500/10 border border-white/10"
                  : "rounded-none bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-none"
              )}
              style={{
                transform: isScrolled ? 'scale(1)' : 'scale(1)',
              }}
            >
              <div 
                className={cn(
                  "transition-all duration-700 ease-in-out",
                  isScrolled 
                    ? "px-4 py-2 md:px-6 md:py-3" 
                    : "px-6 py-4 md:px-12 md:py-5"
                )}
              >
                <div className="flex items-center justify-between gap-4 md:gap-8">
                  {/* Logo - Smooth scale animation */}
                  <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="relative">
                      <img
                        src="/logo.png"
                        alt="Nexus SMP"
                        className={cn(
                          "w-auto relative z-10 transition-all duration-700 ease-in-out hover:scale-105",
                          isScrolled ? "h-7 md:h-8" : "h-8 md:h-10"
                        )}
                      />
                    </div>
                    <span 
                      className={cn(
                        "font-black tracking-tight text-white transition-all duration-700 ease-in-out",
                        isScrolled ? "text-base md:text-lg" : "text-lg md:text-xl"
                      )}
                    >
                      Amazing Craft
                    </span>
                  </Link>

                  {/* Desktop Navigation - Simplified animation */}
                  <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
                    {navLinks.map((link) => (
                      <Link key={link.path} to={link.path} className="relative group">
                        <div
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 relative overflow-hidden whitespace-nowrap",
                            isActive(link.path)
                              ? "text-black bg-white"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span className="relative z-10">{link.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Login - No animation */}
                    {!isUserLoggedIn && (
                      <Link to="/login" className="hidden md:block">
                        <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
                          Login
                        </button>
                      </Link>
                    )}

                    {/* User Profile - No animation */}
                    {isUserLoggedIn && (
                      <div className="hidden md:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-black" />
                          </div>
                          <span className="text-sm font-semibold text-white whitespace-nowrap">
                            {minecraftName}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            logoutUser();
                            navigate("/");
                          }}
                          className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Cart - Simplified animation */}
                    <Link to="/cart">
                      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-black text-xs flex items-center justify-center font-bold">
                            {totalItems}
                          </span>
                        )}
                      </button>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {isMobileMenuOpen ? (
                        <X className="w-5 h-5 text-white" />
                      ) : (
                        <Menu className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Adjusted position based on navbar state */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "fixed left-4 right-4 z-40 lg:hidden transition-all duration-700",
              isScrolled ? "top-20 md:top-24" : "top-24 md:top-28"
            )}
          >
            <div className="bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 md:p-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                      isActive(link.path)
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile User Section */}
                {isUserLoggedIn && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {minecraftName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logoutUser();
                        navigate("/");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}

                {/* Mobile Login */}
                {!isUserLoggedIn && (
                  <div className="pt-4 border-t border-white/10">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors">
                        Login
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;