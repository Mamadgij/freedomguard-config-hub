import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, List, Settings, ShieldCheck, ShieldOff } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useConfigStore } from '@/store/configStore';
import { motion, AnimatePresence } from 'framer-motion';
const navLinks = [
  { to: '/', text: 'Dashboard', icon: Zap },
  { to: '/configs', text: 'Configs', icon: List },
  { to: '/settings', text: 'Settings', icon: Settings },
];
function VpnStatusIndicator() {
  const isConnected = useConfigStore(state => state.isConnected);
  const hasConfigs = useConfigStore(state => state.configs.length > 0);
  let content = null;
  if (isConnected) {
    content = (
      <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 border border-emerald-400/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Active</span>
      </div>
    );
  } else if (hasConfigs) {
    content = (
      <div className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-medium text-red-400 border border-red-400/20">
        <ShieldOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Offline</span>
      </div>
    );
  }
  return (
    <AnimatePresence>
      {content && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/50 backdrop-blur-lg border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
          <Zap className="w-6 h-6" />
          <span className="font-bold text-lg hidden sm:inline">FreedomGuard</span>
        </NavLink>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navLinks.map(({ to, text, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{text}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <VpnStatusIndicator />
          <ThemeToggle className="relative top-0 right-0" />
        </div>
      </div>
    </header>
  );
}