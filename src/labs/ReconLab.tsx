import { useState, useEffect } from 'react';
import { Search, Globe, Terminal as TerminalIcon, Shield, AlertCircle, ChevronRight, FileCode, Server, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiscoveryItem {
  id: string;
  type: 'dir' | 'subdomain' | 'tech' | 'api';
  name: string;
  status: number;
  details: string;
  vulnerability?: string;
}

export default function ReconLab() {
  const [target, setTarget] = useState('internal-corp.local');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [discovered, setDiscovered] = useState<DiscoveryItem[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const runScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setDiscovered([]);
    setLogs(['[INFO] Initializing scan on ' + target]);

    const steps = [
      { msg: '[INFO] Resolving subdomains...', item: { id: '1', type: 'subdomain', name: 'dev.internal-corp.local', status: 200, details: 'Development environment detected.', vulnerability: 'Exposed Debugging' } },
      { msg: '[INFO] Fingerprinting tech stack...', item: { id: '2', type: 'tech', name: 'Apache/2.4.41 (Ubuntu)', status: 200, details: 'PHP 7.4.3, jQuery 3.4.1', vulnerability: 'Outdated PHP Version' } },
      { msg: '[INFO] Brute-forcing directories...', item: { id: '3', type: 'dir', name: '/admin/login', status: 200, details: 'Administrative login panel found.', vulnerability: 'Brute Force Target' } },
      { msg: '[INFO] Searching for API endpoints...', item: { id: '4', type: 'api', name: '/api/v1/users', status: 403, details: 'User management API.', vulnerability: 'Potential IDOR' } },
      { msg: '[INFO] Checking robots.txt...', item: { id: '5', type: 'dir', name: '/backup/db.sql', status: 200, details: 'Database backup file exposed.', vulnerability: 'Information Disclosure' } },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 1500));
      setProgress(((i + 1) / steps.length) * 100);
      setLogs(prev => [...prev, steps[i].msg]);
      setDiscovered(prev => [...prev, steps[i].item as DiscoveryItem]);
    }

    setLogs(prev => [...prev, '[SUCCESS] Scan complete. 5 potential entry points identified.']);
    setIsScanning(false);
  };

  return (
    <div className="h-full flex flex-col bg-black/40">
      <div className="p-6 border-b border-hacker-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/10 rounded text-blue-400">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Reconnaissance Engine</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Target: {target}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="neon-input text-xs py-1.5 px-3 w-48"
            placeholder="Target domain..."
          />
          <button 
            onClick={runScan}
            disabled={isScanning}
            className="neon-button px-4 py-1.5 text-[10px] disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Start Discovery'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Discovered Items */}
        <div className="w-1/2 border-r border-hacker-border overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 flex items-center gap-2">
            <Globe size={12} /> Discovered Assets
          </div>
          
          <AnimatePresence>
            {discovered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-3 border-l-2 border-l-blue-500 bg-blue-500/5 group hover:bg-blue-500/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'dir' && <FolderIcon size={14} className="text-blue-400" />}
                    {item.type === 'subdomain' && <Globe size={14} className="text-purple-400" />}
                    {item.type === 'tech' && <Server size={14} className="text-green-400" />}
                    {item.type === 'api' && <Database size={14} className="text-yellow-400" />}
                    <span className="text-xs font-mono font-bold text-gray-200">{item.name}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1 rounded ${item.status === 200 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">{item.details}</p>
                {item.vulnerability && (
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-red-400 uppercase bg-red-400/5 p-1 rounded">
                    <AlertCircle size={10} /> {item.vulnerability}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {discovered.length === 0 && !isScanning && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <Search size={48} className="mb-4" />
              <p className="text-xs uppercase font-bold">No assets discovered yet</p>
            </div>
          )}
        </div>

        {/* Right: Terminal Logs */}
        <div className="w-1/2 flex flex-col bg-black/40">
          <div className="p-2 border-b border-hacker-border bg-black/20 text-[9px] text-gray-500 uppercase font-bold flex items-center gap-2">
            <TerminalIcon size={12} /> Scan Output
          </div>
          <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={log.startsWith('[SUCCESS]') ? 'text-hacker-green' : log.startsWith('[ERROR]') ? 'text-red-500' : 'text-gray-400'}>
                {log}
              </div>
            ))}
            {isScanning && (
              <div className="text-hacker-green animate-pulse">
                [SCANNING] {progress.toFixed(0)}% complete...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FolderIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  );
}
