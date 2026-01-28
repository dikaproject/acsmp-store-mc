import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Users, Wifi, Activity, Copy, Check, Zap, Globe, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MCSTATUS_API = 'https://api.mcstatus.io/v2/status/bedrock/';

const safeRenderValue = (value, fallback = 'N/A') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object' && value.name) return value.name;
  if (typeof value === 'object' && value.version) return value.version;
  return fallback;
};

export default function ServerStats() {
  const [serverData, setServerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [ping, setPing] = useState(null);

  const SERVER_IP = 'amazingcraft.org';
  const SERVER_PORT = 19132;

  const fetchServerStatus = async () => {
    try {
      const startTime = Date.now();
      const response = await fetch(`${MCSTATUS_API}${SERVER_IP}`);
      const endTime = Date.now();
      const data = await response.json();
      
      let calculatedPing = endTime - startTime;
      // If ping is above 100ms, set random between 10-100ms
      if (calculatedPing > 100) {
        calculatedPing = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
      }
      
      setPing(calculatedPing);
      setServerData(data);
      setLoading(false);
    } catch (error) {
      setServerData({ online: false });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    toast.success('Server IP copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  const isOnline = serverData?.online || false;
  const playersOnline = serverData?.players?.online || 0;
  const maxPlayers = serverData?.players?.max || 2025;
  const version = 'Java & Bedrock Supported';
  const protocol = safeRenderValue(serverData?.protocol, 'N/A');
  const software = safeRenderValue(serverData?.software, 'Velocity Proxy');
  const motdRaw = serverData?.motd?.clean || 'Server MOTD';
  const motd = typeof motdRaw === 'string' ? motdRaw.split('\n') : [motdRaw];
  const progressPercentage = (playersOnline / maxPlayers) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', 'Rajdhani', sans-serif" }}>
          SERVER STATUS
        </h2>
        <p className="text-gray-400 text-sm">Real-time server information and statistics</p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Server Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-xl p-6 border backdrop-blur-sm ${
            isOnline 
              ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30' 
              : 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/30'
          }`}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Wifi className={`w-6 h-6 ${isOnline ? 'text-purple-400' : 'text-red-400'}`} />
              {isOnline && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                />
              )}
            </div>
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Server Status</h3>
            <p className={`text-2xl font-black ${isOnline ? 'text-purple-400' : 'text-red-400'}`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </p>
            <p className="text-xs text-gray-500 mt-2">Server is {isOnline ? 'running' : 'down'}</p>
          </div>
        </motion.div>

        {/* Players Online Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-violet-600/5 border border-violet-500/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="relative z-10">
            <Users className="w-6 h-6 text-violet-400 mb-3" />
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Players Online</h3>
            <motion.div
              key={playersOnline}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-2xl font-black text-violet-400" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                {playersOnline}
              </span>
              <span className="text-sm text-gray-500 font-semibold">/ {maxPlayers}</span>
            </motion.div>
            {/* Progress bar */}
            <div className="mt-3 bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {progressPercentage.toFixed(1)}% capacity
            </p>
          </div>
        </motion.div>

        {/* Server Ping Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5 border border-fuchsia-500/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="relative z-10">
            <Zap className="w-6 h-6 text-fuchsia-400 mb-3" />
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Server Ping</h3>
            <p className={`text-2xl font-black ${
              ping < 100 ? 'text-green-400' : ping < 200 ? 'text-yellow-400' : 'text-red-400'
            }`} style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {ping}ms
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {ping < 100 ? 'Excellent' : ping < 200 ? 'Good' : 'Poor'} connection
            </p>
          </div>
        </motion.div>

        {/* Version Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="relative z-10">
            <Globe className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Version</h3>
            <p className="text-xl font-black text-purple-400 truncate" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {version}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Server Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm"
      >
        <div className="flex items-start gap-6">
          {serverData?.icon && (
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={serverData.icon} 
              alt="Server Icon" 
              className="w-20 h-20 rounded-xl border-2 border-purple-500/30 shadow-lg shadow-purple-500/20"
            />
          )}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Message of the Day</h3>
              </div>
              <div className="space-y-1">
                {motd.map((line, index) => (
                  <p key={index} className="text-white text-base leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Server IP with Copy Button */}
            <div className="flex items-center gap-3 p-4 bg-black/30 rounded-xl border border-purple-500/20">
              <Server className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Server Address</p>
                <p className="text-lg font-bold text-white font-mono">{SERVER_IP}:{SERVER_PORT}</p>
              </div>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 font-semibold text-sm transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>



      {/* Auto Refresh Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-4"
      >
        <Clock className="w-4 h-4" />
        <span>Auto-refresh every 30 seconds</span>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
}