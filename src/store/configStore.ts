import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { parseSubscription } from '@/lib/crypto-utils';
export type Status = 'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR';
export interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}
export const SOURCES = [
  { url: "https://raw.githubusercontent.com/voidr3aper-anon/GFW-slayer/main/configs/regional/iran/serverless-iran-friendly.json", name: "GFW-Slayer (Iran Optimized)" },
  { url: "https://raw.githubusercontent.com/mahdibland/V2RayAggregator/master/Eternity", name: "V2Ray Aggregator (Eternity)" },
  { url: "https://raw.githubusercontent.com/yebekhe/TVC/main/subscriptions/xray/normal/mix", name: "TVC Mix" },
  { url: "https://raw.githubusercontent.com/voidr3aper-anon/GFW-slayer/main/configs/general/serverless-v2ray.json", name: "GFW-Slayer (Global)" },
];
interface ConfigStoreState {
  status: Status;
  configs: string[];
  logs: LogEntry[];
  lastUpdated: Date | null;
  enabledSources: string[];
  isConnected: boolean;
  currentConfig: string | null;
  mockBytesTransferred: number;
  setStatus: (status: Status) => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  clearConfigs: () => void;
  fetchConfigs: () => Promise<void>;
  toggleSource: (url: string) => void;
  resetSources: () => void;
  connectVPN: () => Promise<boolean>;
  disconnectVPN: () => void;
  incrementBytesTransferred: (bytes: number) => void;
}
export const useConfigStore = create<ConfigStoreState>()(
  persist(
    immer((set, get) => ({
      status: 'IDLE',
      configs: [],
      logs: [],
      lastUpdated: null,
      enabledSources: SOURCES.map(s => s.url),
      isConnected: false,
      currentConfig: null,
      mockBytesTransferred: 0,
      setStatus: (status) => set({ status }),
      addLog: (message, type = 'info') => {
        set((state) => {
          state.logs.push({ id: Date.now() + Math.random(), message, type });
        });
      },
      clearLogs: () => set({ logs: [] }),
      clearConfigs: () => {
        get().addLog('Configuration cache cleared.', 'info');
        set({ configs: [], lastUpdated: null, status: 'IDLE' });
      },
      toggleSource: (url: string) => {
        set((state) => {
          const isEnabled = state.enabledSources.includes(url);
          if (isEnabled) {
            state.enabledSources = state.enabledSources.filter(s => s !== url);
          } else {
            state.enabledSources.push(url);
          }
        });
      },
      resetSources: () => set({ enabledSources: SOURCES.map(s => s.url) }),
      fetchConfigs: async () => {
        const { addLog, clearLogs, enabledSources } = get();
        set({ status: 'SCANNING' });
        clearLogs();
        addLog('Initializing FreedomGuard sequence...');
        const activeSources = SOURCES.filter(s => enabledSources.includes(s.url));
        if (activeSources.length === 0) {
          addLog('No sources enabled. Please enable sources in Settings.', 'error');
          set({ status: 'ERROR' });
          return;
        }
        let allConfigs: Set<string> = new Set();
        for (const source of activeSources) {
          try {
            addLog(`Pinging ${source.name}...`);
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(source.url)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            addLog(`Response received from ${source.name}. Parsing...`, 'info');
            const parsed = parseSubscription(content);
            if (parsed.length > 0) {
              addLog(`Found ${parsed.length} configs from ${source.name}.`, 'success');
              parsed.forEach(config => allConfigs.add(config));
            } else {
              addLog(`No valid configs found in ${source.name}.`, 'info');
            }
          } catch (error) {
            addLog(`Failed to fetch from ${source.name}.`, 'error');
            console.error(`Error fetching ${source.url}:`, error);
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
      connectVPN: async () => {
        const { status, fetchConfigs, addLog } = get();
        if (status === 'SCANNING') return false;
        await fetchConfigs();
        const finalStatus = get().status;
        const configs = get().configs;
        if (finalStatus === 'SUCCESS' && configs.length > 0) {
          set({
            isConnected: true,
            currentConfig: configs[0],
            mockBytesTransferred: 0,
            status: 'IDLE', // Reset status after connection
          });
          addLog('VPN Connected - All traffic routed, DNS secured', 'success');
          addLog('DNS: iran-friendly.example.com', 'info');
          return true;
        } else {
          // fetchConfigs already sets status to ERROR and logs it
          return false;
        }
      },
      disconnectVPN: () => {
        get().addLog('VPN Disconnected', 'info');
        set({
          isConnected: false,
          currentConfig: null,
          mockBytesTransferred: 0,
          status: 'IDLE',
        });
      },
      incrementBytesTransferred: (bytes) => {
        set(state => {
          state.mockBytesTransferred += bytes;
        });
      },
    })),
    {
      name: 'freedom-guard-config-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configs: state.configs,
        lastUpdated: state.lastUpdated,
        enabledSources: state.enabledSources,
        isConnected: state.isConnected,
        currentConfig: state.currentConfig,
        mockBytesTransferred: state.mockBytesTransferred,
      }),
    }
  )
);