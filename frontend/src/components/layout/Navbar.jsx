import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Home, Store, Heart, Package, ChevronDown, Crown, Palette, Trophy, Server, Clock, History, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { minecraftName, isUserLoggedIn, logoutUser, currentRank, serverName } = useAuthStore();

  const rankName = currentRank ? currentRank.split(' ')[0] : null;
  const rankExpiry = currentRank ? currentRank.split(' ').slice(1).join(' ') : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { name: "Home", path: "/", icon: Home },
    { name: "Shop", path: "/shop", icon: Store },
    { name: "Gallery", path: "/gallery", icon: Image },
    { name: "Skin", path: "/skin", icon: Palette },
    { name: "Vote", path: "/vote", icon: Heart },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Track Order", path: "/track", icon: Package },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 right-0 z-50 transition-[top] duration-500 ease-out",
          isScrolled ? "top-4 md:top-5" : "top-0"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-[max-width,padding] duration-500 ease-out",
            isScrolled ? "max-w-6xl px-4" : "max-w-7xl px-0"
          )}
        >
          <div
            className={cn(
              "transition-[background-color,border-color,border-radius,box-shadow] duration-500 ease-out relative border",
              isScrolled
                ? "bg-ink/90 backdrop-blur-md border-ink-border rounded-full shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(116,80,163,0.12)_inset]"
                : "bg-ink/75 backdrop-blur-sm border-transparent border-b-transparent rounded-none"
            )}
          >
            {/* Subtle arcane accent line on scrolled state */}
            {isScrolled && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-arcane/40 to-transparent"
              />
            )}
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                isScrolled
                  ? "px-5 md:px-6"
                  : "mx-auto max-w-7xl px-6 md:px-10"
              )}
            >
            <div
              className={cn(
                "flex items-center justify-between gap-4 md:gap-8 transition-all duration-500 relative",
                isScrolled ? "py-2.5 md:py-3" : "py-4 md:py-5"
              )}
            >
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
                        "font-black tracking-tight text-white transition-all duration-500 ease-in-out whitespace-nowrap",
                        isScrolled
                          ? "text-base md:text-lg opacity-0 w-0 overflow-hidden md:opacity-100 md:w-auto"
                          : "text-lg md:text-xl opacity-100"
                      )}
                    >
                      Amazing Craft
                    </span>
                  </Link>

                  {/* Desktop Navigation - absolutely centered to pill */}
                  <div className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navLinks.map((link) => (
                      <Link key={link.path} to={link.path} className="relative group">
                        <div
                          className={cn(
                            "px-4 py-2 text-sm font-semibold transition-colors duration-200 whitespace-nowrap flex items-center gap-2 relative",
                            isActive(link.path)
                              ? "text-white"
                              : "text-gray-400 hover:text-white"
                          )}
                        >
                          <link.icon className="w-4 h-4" />
                          <span className="relative">{link.name}</span>
                          {/* Underline indicator */}
                          <span
                            aria-hidden
                            className={cn(
                              "pointer-events-none absolute left-4 right-4 -bottom-0.5 h-px bg-arcane origin-center transition-transform duration-300 ease-out",
                              isActive(link.path)
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            )}
                          />
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

                    {/* User Profile Dropdown (desktop) */}
                    {isUserLoggedIn && (
                      <div className="hidden md:block relative" ref={userDropdownRef}>
                        <button
                          onClick={() => setIsUserDropdownOpen(v => !v)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
                            isUserDropdownOpen
                              ? "bg-white/15 border-white/20"
                              : "bg-white/10 border-white/10 hover:bg-white/15"
                          )}
                        >
                          <div className="w-6 h-6 rounded-full bg-arcane flex items-center justify-center flex-shrink-0">
                            <User className="w-3 h-3 text-ink" />
                          </div>
                          <span className="text-sm font-medium text-bone whitespace-nowrap max-w-[120px] truncate">
                            {minecraftName}
                          </span>
                          <ChevronDown className={cn(
                            "w-3.5 h-3.5 text-bone-muted transition-transform duration-200",
                            isUserDropdownOpen && "rotate-180"
                          )} />
                        </button>

                        <AnimatePresence>
                          {isUserDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                            >
                              {/* Header */}
                              <div className="px-4 py-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-arcane flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-ink" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-bone truncate">{minecraftName}</p>
                                    <p className="text-xs text-bone-muted truncate">{serverName || 'Player'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Info rows */}
                              <div className="px-4 py-3 space-y-2">
                                {/* Nametag */}
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                                  <div className="w-7 h-7 rounded-full bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
                                    <User className="w-3.5 h-3.5 text-arcane" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 leading-none mb-0.5">Nametag</p>
                                    <p className="text-sm font-semibold text-white font-mono truncate">{minecraftName}</p>
                                  </div>
                                </div>

                                  {/* Rank */}
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                                  <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                    rankName ? "bg-yellow-500/20" : "bg-gray-700/50"
                                  )}>
                                    <Crown className={cn(
                                      "w-3.5 h-3.5",
                                      rankName ? "text-yellow-400" : "text-gray-500"
                                    )} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 leading-none mb-0.5">Rank Saat Ini</p>
                                    {rankName ? (
                                      <p className="text-sm font-bold text-yellow-400 truncate">{rankName}</p>
                                    ) : (
                                      <p className="text-sm text-gray-500">Belum ada rank</p>
                                    )}
                                  </div>
                                </div>

                                {/* Rank Expiry */}
                                {rankExpiry && (
                                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs text-gray-500 leading-none mb-0.5">Berakhir</p>
                                      <p className="text-xs font-semibold text-blue-300 truncate">{rankExpiry}</p>
                                    </div>
                                  </div>
                                )}

                                {/* My Orders */}
                                <Link
                                  to="/my-orders"
                                  onClick={() => setIsUserDropdownOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  <div className="w-7 h-7 rounded-full bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
                                    <History className="w-3.5 h-3.5 text-arcane" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-gray-500 leading-none mb-0.5">Riwayat</p>
                                    <p className="text-sm font-semibold text-white">Pesanan Saya</p>
                                  </div>
                                </Link>
                              </div>

                              {/* Logout */}
                              <div className="px-4 pb-4">
                                <button
                                  onClick={() => {
                                    setIsUserDropdownOpen(false);
                                    logoutUser();
                                    navigate('/');
                                  }}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-colors"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Logout
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Cart - Simplified animation */}
                    <Link to="/cart">
                      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-white" />
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-arcane text-bone text-xs flex items-center justify-center font-bold rounded-full">
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
              "fixed left-4 right-4 z-40 lg:hidden transition-all duration-500",
              isScrolled ? "top-24 md:top-28" : "top-24 md:top-28"
            )}
          >
<div className="bg-black/95 backdrop-blur rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 md:p-6 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                      isActive(link.path)
                        ? "bg-white text-black"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}

                {/* Mobile User Section */}
                {isUserLoggedIn && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {/* Nametag */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
                      <div className="w-10 h-10 rounded-full bg-arcane flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-ink" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 leading-none mb-0.5">Nametag</p>
                        <p className="text-sm font-bold text-white font-mono truncate">{minecraftName}</p>
                      </div>
                    </div>

                    {/* Server */}
                    {serverName && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
                        <div className="w-10 h-10 rounded-full bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
                          <Server className="w-5 h-5 text-arcane" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500 leading-none mb-0.5">Server</p>
                          <p className="text-sm font-semibold text-white truncate">{serverName}</p>
                        </div>
                      </div>
                    )}

                    {/* Rank */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        rankName ? "bg-yellow-500/20" : "bg-gray-700/50"
                      )}>
                        <Crown className={cn(
                          "w-5 h-5",
                          rankName ? "text-yellow-400" : "text-gray-500"
                        )} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 leading-none mb-0.5">Rank Saat Ini</p>
                        {rankName ? (
                          <div>
                            <p className="text-sm font-bold text-yellow-400 truncate">{rankName}</p>
                            {rankExpiry && (
                              <p className="text-xs text-blue-300 mt-0.5 truncate">{rankExpiry}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Belum ada rank</p>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-arcane/15 border border-arcane/30 flex items-center justify-center flex-shrink-0">
                        <History className="w-5 h-5 text-arcane" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 leading-none mb-0.5">Riwayat</p>
                        <p className="text-sm font-semibold text-white">Pesanan Saya</p>
                      </div>
                    </Link>

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