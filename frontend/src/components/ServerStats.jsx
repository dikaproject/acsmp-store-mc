import { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Users, Wifi, Activity, Copy, Check, Zap, Globe, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useServerStatus } from '../hooks/useServerStatus';
import { SERVER_IP, SERVER_PORT } from '../lib/serverStatus';

export default function ServerStats() {
  const { serverData, responseTime, loading, error, online, statusLabel } = useServerStatus();
  const [copied, setCopied] = useState(false);

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

  const isOnline = online === true;
  const statusUnknown = online === undefined || Boolean(error);
  const playersOnline = serverData?.players?.online ?? (online === false ? 0 : null);
  const maxPlayers = serverData?.players?.max ?? null;
  const version = 'Java & Bedrock Supported';
  const motdRaw = serverData?.motd?.clean;
  const motd = Array.isArray(motdRaw) ? motdRaw : (typeof motdRaw === 'string' ? motdRaw.split('\n') : ['MOTD unavailable']);
  const progressPercentage = playersOnline !== null && maxPlayers > 0
    ? (playersOnline / maxPlayers) * 100 : null;

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
            statusUnknown ? 'bg-ink-elevated border-ink-border' : isOnline
              ? 'bg-ink-elevated border-arcane/30'
              : 'bg-ink-elevated border-[hsl(var(--danger))]/30'
          }`}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <Wifi className={`w-5 h-5 ${statusUnknown ? 'text-bone-muted' : isOnline ? 'text-arcane' : 'text-[hsl(var(--danger))]'}`} strokeWidth={1.75} />
              {isOnline && !statusUnknown && (
                <div className="w-1.5 h-1.5 bg-arcane" />
              )}
            </div>
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">Server Status</h3>
            <p className={`font-mono text-2xl ${statusUnknown ? 'text-bone-muted' : isOnline ? 'text-arcane' : 'text-[hsl(var(--danger))]'}`}>
              {statusLabel}
            </p>
            <p className="text-xs text-bone-subtle mt-2" role={error ? 'status' : undefined}>
              {error ? (serverData ? 'Refresh failed; showing last successful check' : 'Status API unavailable; retrying automatically') : `Server is ${isOnline ? 'running' : 'down'}`}
            </p>
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
                {playersOnline ?? 'N/A'}
              </span>
              <span className="text-sm text-bone-subtle">/ {maxPlayers ?? 'N/A'}</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3 bg-ink h-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage ?? 0, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-arcane"
              />
            </div>
            <p className="text-xs text-bone-subtle mt-2">
              {progressPercentage === null ? 'Capacity unavailable' : `${progressPercentage.toFixed(1)}% capacity${error ? ' (last known)' : ''}`}
            </p>
          </div>
        </motion.div>

        {/* API Response Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative overflow-hidden bg-ink-elevated border border-ink-border p-6"
        >
          <div className="relative z-10">
            <Zap className="w-5 h-5 text-arcane mb-3" strokeWidth={1.75} />
            <h3 className="text-[10px] text-bone-subtle uppercase tracking-widest mb-2">API Response</h3>
            <p className="font-mono text-2xl text-bone">
              {error || responseTime === null ? 'N/A' : `${responseTime}ms`}
            </p>
            <p className="text-xs text-bone-subtle mt-2">
              Status API request time
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
        <div className="flex flex-col sm:flex-row items-start gap-6">
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
          <div className="w-full min-w-0 flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-arcane" strokeWidth={1.75} />
                <h3 className="text-[11px] font-medium text-arcane uppercase tracking-widest">Message of the Day</h3>
              </div>
              <div className="space-y-1">
                {motd.map((line, index) => (
                  <p key={index} className="break-words text-bone text-base leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Server IP with Copy Button */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-ink border border-ink-border">
              <Server className="w-4 h-4 text-arcane flex-shrink-0" strokeWidth={1.75} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-bone-subtle uppercase tracking-widest mb-1">Server Address</p>
                <p className="break-all font-mono text-sm text-bone">{SERVER_IP}:{SERVER_PORT}</p>
              </div>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-shrink-0 items-center gap-2 px-4 py-2 bg-arcane/10 hover:bg-arcane/20 border border-arcane/30 text-arcane font-medium text-xs uppercase tracking-widest transition-colors"
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
