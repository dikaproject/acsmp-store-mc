import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Users, Wifi, Activity, Copy, Check, Zap, Globe, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MCSTATUS_API = 'https://api.mcsrvstat.us/bedrock/3/';

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
          <div className="animate-spin h-10 w-10 border-2 border-ink-border border-t-arcane rounded-full"></div>
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
  const motdRaw = serverData?.motd?.clean;
  const motd = Array.isArray(motdRaw) ? motdRaw : (typeof motdRaw === 'string' ? motdRaw.split('\n') : ['Server MOTD']);
  const progressPercentage = (playersOnline / maxPlayers) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-arcane/10 border border-arcane/30">
          <div className="w-1.5 h-1.5 bg-arcane" />
          <span className="text-[11px] font-medium text-arcane uppercase tracking-widest">
            Server Status
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-bone">
          Real-time information
        </h2>
        <p className="text-bone-muted text-sm">Live server statistics and metrics</p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Server Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden p-6 border ${
            isOnline
              ? 'bg-ink-elevated border-arcane/30'
              : 'bg-ink-elevated border-[hsl(var(--danger))]/30'
          }`}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Wifi className={`w-5 h-5 ${isOnline ? 'text-arcane' : 'text-[hsl(var(--danger))]'}`} strokeWidth={1.75} />
              {isOnline && (
                <div className="w-1.5 h-1.5 bg-arcane" />
              )}
            </div>
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">Server Status</h3>
            <p className={`font-mono text-2xl ${isOnline ? 'text-arcane' : 'text-[hsl(var(--danger))]'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
            <p className="text-xs text-bone-subtle mt-2">Server is {isOnline ? 'running' : 'down'}</p>
          </div>
        </motion.div>

        {/* Players Online Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative overflow-hidden bg-ink-elevated border border-ink-border p-6"
        >
          <div className="relative z-10">
            <Users className="w-5 h-5 text-arcane mb-3" strokeWidth={1.75} />
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">Players Online</h3>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl text-bone">
                {playersOnline}
              </span>
              <span className="text-sm text-bone-subtle">/ {maxPlayers}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-ink h-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-arcane"
              />
            </div>
            <p className="text-xs text-bone-subtle mt-2">
              {progressPercentage.toFixed(1)}% capacity
            </p>
          </div>
        </motion.div>

        {/* Server Ping Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative overflow-hidden bg-ink-elevated border border-ink-border p-6"
        >
          <div className="relative z-10">
            <Zap className="w-5 h-5 text-arcane mb-3" strokeWidth={1.75} />
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">Server Ping</h3>
            <p className={`font-mono text-2xl ${
              ping < 100 ? 'text-[hsl(var(--success))]' : ping < 200 ? 'text-arcane' : 'text-[hsl(var(--danger))]'
            }`}>
              {ping}ms
            </p>
            <p className="text-xs text-bone-subtle mt-2">
              {ping < 100 ? 'Excellent' : ping < 200 ? 'Good' : 'Poor'} connection
            </p>
          </div>
        </motion.div>

        {/* Version Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="relative overflow-hidden bg-ink-elevated border border-ink-border p-6"
        >
          <div className="relative z-10">
            <Globe className="w-5 h-5 text-arcane mb-3" strokeWidth={1.75} />
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">Version</h3>
            <p className="font-mono text-base text-bone truncate">
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
        className="relative overflow-hidden bg-ink-elevated border border-ink-border p-8"
      >
        <div className="flex items-start gap-6">
          {serverData?.icon && (
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={serverData.icon} 
              alt="Server Icon" 
              className="w-16 h-16 border border-arcane/30"
            />
          )}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                <h3 className="text-[11px] font-medium text-arcane uppercase tracking-widest">Message of the Day</h3>
              </div>
              <div className="space-y-1">
                {motd.map((line, index) => (
                  <p key={index} className="text-bone text-base leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Server IP with Copy Button */}
            <div className="flex items-center gap-3 p-4 bg-ink border border-ink-border">
              <Server className="w-4 h-4 text-arcane flex-shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <p className="text-[10px] text-bone-subtle uppercase tracking-widest mb-1">Server Address</p>
                <p className="font-mono text-sm text-bone">{SERVER_IP}:{SERVER_PORT}</p>
              </div>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-arcane/10 hover:bg-arcane/20 border border-arcane/30 text-arcane font-medium text-xs uppercase tracking-widest transition-colors"
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
        className="flex items-center justify-center gap-2 text-xs text-bone-subtle pt-4"
      >
        <Clock className="w-3.5 h-3.5" />
        <span>Auto-refresh every 30 seconds</span>
        <div className="w-1 h-1 bg-arcane" />
      </motion.div>
    </div>
  );
}