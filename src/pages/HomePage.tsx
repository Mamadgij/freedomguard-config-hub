import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ShieldOff, Loader } from 'lucide-react';
import { useConfigStore, Status } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { StatusLog } from '@/components/StatusLog';
import { ConfigActions } from '@/components/ConfigActions';
import { Header } from '@/components/Header';
const statusConfig: Record<Status, {
  text: string;
  icon: React.ElementType;
  glowColor: string;
  textColor: string;
  buttonText: string;
}> = {
  IDLE: {
    text: 'Offline',
    icon: ShieldOff,
    glowColor: 'from-slate-500/50 to-slate-950',
    textColor: 'text-slate-400',
    buttonText: 'Activate',
  },
  SCANNING: {
    text: 'Scanning...',
    icon: Loader,
    glowColor: 'from-cyan-500/60 to-slate-950',
    textColor: 'text-cyan-300',
    buttonText: 'Scanning',
  },
  SUCCESS: {
    text: 'Ready',
    icon: ShieldCheck,
    glowColor: 'from-emerald-500/60 to-slate-950',
    textColor: 'text-emerald-400',
    buttonText: 'Activated',
  },
  ERROR: {
    text: 'Error',
    icon: ShieldOff,
    glowColor: 'from-red-500/60 to-slate-950',
    textColor: 'text-red-400',
    buttonText: 'Retry',
  },
};
export function HomePage() {
  const status = useConfigStore(state => state.status);
  const fetchConfigs = useConfigStore(state => state.fetchConfigs);
  const currentStatus = statusConfig[status];
  const Icon = currentStatus.icon;
  const handleButtonClick = () => {
    if (status !== 'SCANNING') {
      fetchConfigs();
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col pt-16 overflow-hidden relative font-sans">
      <Header />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2032%2032%22%20width=%2232%22%20height=%2232%22%20fill=%22none%22%20stroke=%22rgb(30%2041%2059)%22%3E%3Cpath%20d=%22M0%20.5%20L32%20.5%20M.5%200%20L.5%2032%22/%3E%3C/svg%3E')]" />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full mx-auto flex flex-col items-center justify-center space-y-8 z-10 animate-fade-in">
          <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8" />
              FreedomGuard
            </h1>
            <p className="text-slate-400 mt-2">Resilient Configuration Hub</p>
          </header>
          <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-t blur-2xl',
                currentStatus.glowColor
              )}
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <button
              onClick={handleButtonClick}
              disabled={status === 'SCANNING'}
              className="relative w-full h-full rounded-full bg-slate-900/80 border-2 border-slate-700/50 flex flex-col items-center justify-center text-slate-300 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed"
            >
              <Icon className={cn('w-16 h-16 mb-2 transition-colors', currentStatus.textColor, { 'animate-spin': status === 'SCANNING' })} />
              <span className="text-2xl font-medium">{currentStatus.buttonText}</span>
              <span className={cn('text-sm', currentStatus.textColor)}>
                Status: {currentStatus.text}
              </span>
            </button>
          </div>
          <div className="w-full space-y-4">
            <StatusLog />
            <ConfigActions />
          </div>
          <div className="text-center text-xs text-slate-500 pt-4">
            <p>1. Click Activate/Refresh → 2. Click Copy All → 3. Import from clipboard in v2rayNG.</p>
            <p className="mt-2">Built with ❤️ at Cloudflare</p>
          </div>
        </div>
      </main>
    </div>
  );
}