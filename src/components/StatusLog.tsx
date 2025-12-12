import React, { useEffect, useRef } from 'react';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
export function StatusLog() {
  const logs = useConfigStore(state => state.logs);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [logs]);
  return (
    <ScrollArea
      className="h-48 w-full rounded-md border border-cyan-500/20 bg-slate-900/50 p-4 font-mono text-sm shadow-inner"
      ref={scrollAreaRef}
    >
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="flex items-start"
            >
              <span className="text-cyan-400/50 mr-2 select-none">&gt;</span>
              <p
                className={cn('flex-1 break-words', {
                  'text-emerald-400': log.type === 'success',
                  'text-red-400': log.type === 'error',
                  'text-slate-300': log.type === 'info',
                })}
              >
                {log.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}