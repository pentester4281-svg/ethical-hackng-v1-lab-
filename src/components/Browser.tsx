import React, { useState, useEffect } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Search, Shield, Lock, AlertCircle, Terminal as TerminalIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Endpoint {
  path: string;
  method: string;
  description: string;
  vulnerability?: string;
  status: number;
}

const mockEndpoints: Record<string, Endpoint[]> = {
  'internal-corp.local': [
    { path: '/', method: 'GET', description: 'Main landing page', status: 200 },
    { path: '/admin/login', method: 'POST', description: 'Administrative login portal', vulnerability: 'Brute Force', status: 200 },
    { path: '/api/search', method: 'GET', description: 'User search endpoint', vulnerability: 'SQL Injection', status: 200 },
    { path: '/comments', method: 'POST', description: 'Public comment feed', vulnerability: 'Stored XSS', status: 200 },
    { path: '/robots.txt', method: 'GET', description: 'Search engine instructions', status: 200 },
    { path: '/backup', method: 'GET', description: 'System backups (Internal only)', status: 403 },
  ],
  'dev-test.local': [
    { path: '/debug', method: 'GET', description: 'Debug information', status: 200 },
    { path: '/config', method: 'GET', description: 'Environment configuration', status: 401 },
  ]
};

export default function Browser() {
  const [url, setUrl] = useState('internal-corp.local');
  const [currentUrl, setCurrentUrl] = useState('internal-corp.local');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['internal-corp.local']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (newUrl: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentUrl(newUrl);
      setUrl(newUrl);
      setIsLoading(false);
      if (newUrl !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 600);
  };

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(url);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prevUrl);
      setUrl(prevUrl);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(nextUrl);
      setUrl(nextUrl);
    }
  };

  const endpoints = mockEndpoints[currentUrl] || [];

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] text-gray-300">
      {/* Browser Toolbar */}
      <div className="bg-[#2d2d2d] p-2 flex items-center gap-2 border-b border-black/40 shadow-md">
        <div className="flex items-center gap-1 mr-2">
          <button 
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1.5 hover:bg-white/5 rounded disabled:opacity-30 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 hover:bg-white/5 rounded disabled:opacity-30 transition-colors"
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => navigate(currentUrl)}
            className="p-1.5 hover:bg-white/5 rounded transition-colors"
          >
            <RotateCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <form onSubmit={handleGo} className="flex-1 flex items-center bg-black/40 rounded-full border border-white/10 px-4 py-1.5 gap-2 group focus-within:border-hacker-green/50 transition-all">
          <Shield size={14} className="text-hacker-green opacity-50" />
          <input 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200"
            placeholder="Enter target URL..."
          />
          <Lock size={12} className="text-gray-600" />
        </form>

        <div className="flex items-center gap-1 ml-2">
          <button className="p-2 hover:bg-white/5 rounded text-gray-500">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f0f0f] relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-hacker-green/20 border-t-hacker-green rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-hacker-green uppercase tracking-widest">Resolving Target...</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="p-8 max-w-4xl mx-auto">
          {endpoints.length > 0 ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-hacker-border pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Globe className="text-hacker-green" /> {currentUrl}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">Target Analysis: {endpoints.length} endpoints discovered</p>
                </div>
                <div className="px-3 py-1 bg-hacker-green/10 border border-hacker-green/30 rounded-full text-[10px] font-bold text-hacker-green uppercase">
                  Secure Connection
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {endpoints.map((ep, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 border border-hacker-border hover:border-hacker-green/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-sm font-mono text-gray-200">{ep.path}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono ${ep.status === 200 ? 'text-hacker-green' : ep.status === 403 ? 'text-red-500' : 'text-yellow-500'}`}>
                          HTTP {ep.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-gray-500">{ep.description}</p>
                      {ep.vulnerability && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase bg-red-400/5 px-2 py-1 rounded border border-red-400/20">
                          <AlertCircle size={12} /> {ep.vulnerability} Potential
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 bg-black/40 border border-hacker-border rounded-lg space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <TerminalIcon size={14} /> Security Researcher Notes
                </h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  The target <span className="text-hacker-green">{currentUrl}</span> appears to be an internal development environment. 
                  Several endpoints show signs of common web vulnerabilities. Use the Recon Lab to perform deeper scanning 
                  and the specialized labs to exploit discovered flaws.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Target Not Found</h2>
                <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
                  The requested URL <span className="text-red-400 font-mono">{currentUrl}</span> could not be resolved by the internal DNS.
                </p>
              </div>
              <button 
                onClick={() => navigate('internal-corp.local')}
                className="neon-button px-6 py-2 text-[10px] font-bold uppercase"
              >
                Return to Internal Corp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Browser Footer */}
      <div className="bg-[#2d2d2d] border-t border-black/40 px-4 py-1 flex items-center justify-between text-[9px] text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Shield size={10} className="text-hacker-green" /> Protected Mode</span>
          <span>Proxy: 127.0.0.1:8080</span>
        </div>
        <div className="flex items-center gap-1">
          <ExternalLink size={10} /> vimal-browser v1.0.2
        </div>
      </div>
    </div>
  );
}
