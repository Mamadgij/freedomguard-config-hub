import React from 'react';
import { useConfigStore } from '@/store/configStore';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export function ConfigActions() {
  const configs = useConfigStore(state => state.configs);
  const status = useConfigStore(state => state.status);
  const fetchConfigs = useConfigStore(state => state.fetchConfigs);
  const clearConfigs = useConfigStore(state => state.clearConfigs);
  const handleCopyAll = () => {
    if (configs.length === 0) {
      toast.error('No configurations to copy.');
      return;
    }
    const allConfigsString = configs.join('\n');
    navigator.clipboard.writeText(allConfigsString)
      .then(() => {
        toast.success(`Copied ${configs.length} configurations!`, {
          description: 'Open v2rayNG and import from clipboard.',
        });
      })
      .catch(err => {
        toast.error('Failed to copy to clipboard.');
        console.error('Copy failed:', err);
      });
  };
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Button
        variant="outline"
        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200"
        onClick={handleCopyAll}
        disabled={configs.length === 0 || status === 'SCANNING'}
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy All ({configs.length})
      </Button>
      <Button
        variant="outline"
        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-200"
        onClick={() => fetchConfigs()}
        disabled={status === 'SCANNING'}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${status === 'SCANNING' ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      <Button
        variant="destructive"
        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
        onClick={clearConfigs}
        disabled={configs.length === 0 || status === 'SCANNING'}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear Cache
      </Button>
    </div>
  );
}