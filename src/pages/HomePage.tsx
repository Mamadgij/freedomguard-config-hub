import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ShieldOff, Loader, Wifi, ArrowRightLeft } from 'lucide-react';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { StatusLog } from '@/components/StatusLog';
import { ConfigActions } from '@/components/ConfigActions';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
function NotificationBar() {
  const isConnected = useConfigStore(state => state.isConnected);
  const mockBytesTransferred = useConfigStore(state => state.mockBytesTransferred);
  const incrementBytes = useConfigStore(state => state.incrementBytesTransferred);
  const disconnectVPN = useConfigStore(state => state.disconnectVPN);
  const [mockPing, setMockPing] = useState(0);
  useEffect(() => {
    if (!isConnected) return;
    const pingInterval = setInterval(() => {
      setMockPing(Math.floor(Math.random() * (100 - 20 + 1) + 20));
    }, 2000);
    const bytesInterval = setInterval(() => {
      incrementBytes(Math.random() * 10 * 1024);
    }, 1000);
    return () => {
      clearInterval(pingInterval);
      clearInterval(bytesInterval);
    };
  }, [isConnected, incrementBytes]);
  if (!isConnected) return null;
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full bg-emerald-950/50 backdrop-blur-lg border border-emerald-400/20 py-3 px-6 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in"
    >
      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
        <ShieldCheck className="w-5 h-5" />
        <span>VPN ACTIVE</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-1.5"><Wifi className="w-4 h-4 text-cyan-400" /> Ping: {mockPing}ms</div>
        <div className="flex items-center gap-1.5"><ArrowRightLeft className="w-4 h-4 text-cyan-400" /> Transferred: {formatBytes(mockBytesTransferred)}</div>
      </div>
      <Button size="sm" variant="destructive" onClick={disconnectVPN} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50">
        Disconnect
      </Button>
    </motion.div>
  );
}
export function HomePage() {
  const status = useConfigStore(state => state.status);
  const isConnected = useConfigStore(state => state.isConnected);
  const connectVPN = useConfigStore(state => state.connectVPN);
  const disconnectVPN = useConfigStore(state => state.disconnectVPN);
  const handleToggle = async () => {
    if (isConnected) {
      disconnectVPN();
      toast.info('VPN has been disconnected.');
    } else {
      const connected = await connectVPN();
      if (connected) {
        toast.success('VPN Active - All traffic routed, DNS secured');
      } else {
        toast.error('Connection Failed', { description: 'Could not find any working configurations.' });
      }
    }
  };
  const isLoading = status === 'SCANNING';
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative font-sans">
      <Header />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%2...svg%3E')]" />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <div className="max-w-2xl w-full mx-auto flex flex-col items-center justify-center space-y-8 z-10 animate-fade-in">
            <header className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8" />
                FreedomGuard
              </h1>
              <p className="text-slate-400 mt-2">Resilient Configuration Hub</p>
            </header>
            <NotificationBar />
            <div className="relative flex items-center justify-center w-full">
              <motion.div
                className={cn(
                  'absolute -inset-4 rounded-full bg-gradient-to-t blur-2xl',
                  isConnected ? 'from-emerald-500/60 to-slate-950' : 'from-cyan-500/60 to-slate-950'
                )}
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Button
                onClick={handleToggle}
                disabled={isLoading}
                size="lg"
                className={cn(
                  "relative h-24 w-full max-w-sm rounded-2xl text-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-950",
                  isConnected
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 focus:ring-emerald-400'
                    : 'bg-slate-900 text-cyan-300 border-2 border-cyan-500/50 hover:bg-slate-800 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 focus:ring-cyan-400',
                  isLoading && 'cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-center gap-4">
                  {isLoading ? <Loader className="w-8 h-8 animate-spin" /> : isConnected ? <ShieldCheck className="w-8 h-8" /> : <ShieldOff className="w-8 h-8" />}
                  <span>{isLoading ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}</span>
                </div>
              </Button>
            </div>
            <div className="w-full space-y-4">
              <StatusLog />
              <ConfigActions />
            </div>
            <div className="text-center text-xs text-slate-500 pt-4">
              <p>1. Click Connect → 2. Click Copy All → 3. Import from clipboard in v2rayNG.</p>
              <p className="mt-2">Built with ❤️ at Cloudflare</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}