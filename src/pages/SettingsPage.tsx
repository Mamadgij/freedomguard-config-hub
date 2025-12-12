import React from 'react';
import { useConfigStore, SOURCES } from '@/store/configStore';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
export function SettingsPage() {
  const enabledSources = useConfigStore(state => state.enabledSources);
  const toggleSource = useConfigStore(state => state.toggleSource);
  const resetSources = useConfigStore(state => state.resetSources);
  const handleReset = () => {
    resetSources();
    toast.info('Subscription sources have been reset to default.');
  };
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-cyan-400">Settings</h1>
            <p className="text-slate-400">
              Manage your subscription sources. Enabled sources will be used when fetching configurations.
            </p>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-cyan-400">Subscription Sources</CardTitle>
              <CardDescription className="text-slate-500">
                You have {enabledSources.length} of {SOURCES.length} sources enabled.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {SOURCES.map(source => (
                  <div
                    key={source.url}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex flex-col">
                      <Label htmlFor={source.url} className="font-medium text-slate-200">
                        {source.name}
                      </Label>
                      <span className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                        {source.url}
                      </span>
                    </div>
                    <Switch
                      id={source.url}
                      checked={enabledSources.includes(source.url)}
                      onCheckedChange={() => toggleSource(source.url)}
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}