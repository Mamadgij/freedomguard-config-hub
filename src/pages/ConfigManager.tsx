import React, { useState } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, QrCode, ServerCrash } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
export function ConfigManager() {
  const configs = useConfigStore(state => state.configs);
  const handleCopy = (config: string) => {
    navigator.clipboard.writeText(config)
      .then(() => toast.success('Configuration copied to clipboard!'))
      .catch(() => toast.error('Failed to copy configuration.'));
  };
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-cyan-400">Configuration Manager</h1>
            <p className="text-slate-400">
              Found {configs.length} configurations. Inspect, copy, or generate QR codes for individual keys.
            </p>
          </div>
          {configs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-900/50 rounded-lg border border-slate-800">
              <ServerCrash className="w-16 h-16 text-slate-500 mb-4" />
              <h2 className="text-2xl font-semibold text-slate-300">No Configurations Found</h2>
              <p className="text-slate-400 mt-2 mb-6">Your configuration list is empty. Go to the dashboard to fetch them.</p>
              <Button asChild className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Link to="/">Go to Dashboard</Link>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
                {configs.map((config, index) => (
                  <Card key={index} className="bg-slate-900 border-slate-800 text-slate-300 flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-cyan-400 text-lg truncate">
                        Config #{index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <Textarea
                        readOnly
                        value={config}
                        className="font-mono text-xs h-32 flex-1 bg-slate-950 border-slate-700 resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                          onClick={() => handleCopy(config)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-800 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-cyan-400">QR Code - Config #{index + 1}</DialogTitle>
                            </DialogHeader>
                            <div className="p-4 bg-white rounded-md flex items-center justify-center">
                              <QRCode value={config} size={256} viewBox={`0 0 256 256`} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
}