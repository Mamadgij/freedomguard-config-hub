import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeBase64Decode, parseConfig } from '@/lib/crypto-utils';
export type Status = 'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR';
export interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}
interface ConfigStoreState {
  status: Status;
  configs: string[];
  logs: LogEntry[];
  lastUpdated: Date | null;
  setStatus: (status: Status) => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  clearConfigs: () => void;
  fetchConfigs: () => Promise<void>;
}
const SUBSCRIPTION_URLS = [
  "https://raw.githubusercontent.com/voidr3aper-anon/GFW-slayer/main/configs/regional/iran/serverless-iran-friendly.json",
  "https://raw.githubusercontent.com/mahdibland/V2RayAggregator/master/Eternity",
  "https://raw.githubusercontent.com/yebekhe/TVC/main/subscriptions/xray/normal/mix",
  "https://raw.githubusercontent.com/voidr3aper-anon/GFW-slayer/main/configs/general/serverless-v2ray.json",
];
export const useConfigStore = create<ConfigStoreState>()(
  persist(
    (set, get) => ({
      status: 'IDLE',
      configs: [],
      logs: [],
      lastUpdated: null,
      setStatus: (status) => set({ status }),
      addLog: (message, type = 'info') => {
        set((state) => ({
          logs: [...state.logs, { id: Date.now(), message, type }],
        }));
      },
      clearLogs: () => set({ logs: [] }),
      clearConfigs: () => {
        get().addLog('Configuration cache cleared.', 'info');
        set({ configs: [], lastUpdated: null, status: 'IDLE' });
      },
      fetchConfigs: async () => {
        const { setStatus, addLog, clearLogs } = get();
        setStatus('SCANNING');
        clearLogs();
        addLog('Initializing FreedomGuard sequence...');
        let allConfigs: Set<string> = new Set();
        for (const url of SUBSCRIPTION_URLS) {
          try {
            const sourceName = new URL(url).hostname;
            addLog(`Pinging source: ${sourceName}...`);
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            addLog(`Response received from ${sourceName}. Parsing...`, 'info');
            let decodedContent = content;
            // Attempt to detect if it's Base64 encoded
            if (!content.includes('://') && content.length > 20) {
                const decoded = safeBase64Decode(content);
                if (decoded) {
                    decodedContent = decoded;
                    addLog('Base64 content detected and decoded.', 'info');
                }
            }
            const parsed = parseConfig(decodedContent);
            if (parsed.length > 0) {
              addLog(`Found ${parsed.length} configs from ${sourceName}.`, 'success');
              parsed.forEach(config => allConfigs.add(config));
            } else {
              addLog(`No valid configs found in ${sourceName}.`, 'info');
            }
          } catch (error) {
            const sourceName = new URL(url).hostname;
            addLog(`Failed to fetch from ${sourceName}.`, 'error');
            console.error(`Error fetching ${url}:`, error);
          }
        }
        const uniqueConfigs = Array.from(allConfigs);
        if (uniqueConfigs.length > 0) {
          set({ configs: uniqueConfigs, status: 'SUCCESS', lastUpdated: new Date() });
          addLog(`Scan complete. Total unique configs found: ${uniqueConfigs.length}`, 'success');
        } else {
          set({ status: 'ERROR' });
          addLog('Scan failed. No configurations found. Check network or try again later.', 'error');
        }
      },
    }),
    {
      name: 'freedom-guard-config-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configs: state.configs,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);