import React, { useState, useEffect, FormEvent } from 'react';
import { Lock, User, Shield, AlertCircle, Terminal as TerminalIcon, RefreshCcw, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BruteForceLabProps {
  onIntercept?: (request: any) => Promise<any>;
}

export default function BruteForceLab({ onIntercept }: BruteForceLabProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' | 'info' } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'proxy'>('login');

  // Vulnerable logic: admin/password123
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage(null);

    let finalUsername = username;
    let finalPassword = password;

    // Intercept request if proxy is enabled
    if (onIntercept) {
      const intercepted = await onIntercept({
        url: '/api/login',
        method: 'POST',
        body: { username, password }
      });
      
      if (!intercepted) {
        setMessage({ text: '[ERROR] Request dropped by proxy.', type: 'error' });
        setIsLoggingIn(false);
        return;
      }
      
      finalUsername = intercepted.body.username;
      finalPassword = intercepted.body.password;
    }

    await new Promise(r => setTimeout(r, 800));

    if (rateLimitEnabled && attempts >= 5) {
      setIsLocked(true);
      setMessage({ text: 'Account locked due to too many failed attempts. Try again in 30s.', type: 'error' });
      setTimeout(() => setIsLocked(false), 30000);
      setIsLoggingIn(false);
      return;
    }

    if (finalUsername === 'admin' && finalPassword === 'password123') {
      setMessage({ text: '[SUCCESS] Access Granted. Welcome, Administrator.', type: 'success' });
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setMessage({ text: '[ERROR] Invalid credentials. Access Denied.', type: 'error' });
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="h-full flex flex-col bg-black/40">
      <div className="p-6 border-b border-hacker-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-hacker-green/10 rounded text-hacker-green">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Authentication Panel</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Target: /admin/login</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 rounded border border-hacker-border p-1">
            <button 
              onClick={() => setActiveTab('login')}
              className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${activeTab === 'login' ? 'bg-hacker-green text-black' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('proxy')}
              className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${activeTab === 'proxy' ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Proxy Info
            </button>
          </div>
          <div className="h-6 w-px bg-hacker-border" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 uppercase font-bold">Rate Limiting</span>
            <button 
              onClick={() => setRateLimitEnabled(!rateLimitEnabled)}
              className={`w-8 h-4 rounded-full transition-colors relative ${rateLimitEnabled ? 'bg-hacker-green' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${rateLimitEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex items-center justify-center p-8"
            >
              <div className="w-full max-w-md space-y-6">
                <div className="glass-card p-8 border-t-2 border-t-hacker-green bg-black/60 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-hacker-green/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-hacker-green/30">
                      <Shield size={32} className="text-hacker-green" />
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Secure Login</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase">Internal Corporate Access Only</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Username</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full neon-input pl-10 py-2.5 text-xs"
                          placeholder="Enter username"
                          disabled={isLocked}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Password</label>
                      <div className="relative">
                        <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full neon-input pl-10 py-2.5 text-xs"
                          placeholder="Enter password"
                          disabled={isLocked}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoggingIn || isLocked}
                      className="w-full neon-button py-3 text-xs font-bold uppercase tracking-widest mt-4 disabled:opacity-50"
                    >
                      {isLoggingIn ? 'Authenticating...' : 'Sign In'}
                    </button>
                  </form>

                  <AnimatePresence>
                    {message && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mt-6 p-3 rounded border text-[11px] flex items-center gap-3 ${
                          message.type === 'success' ? 'bg-hacker-green/10 border-hacker-green/30 text-hacker-green' : 
                          message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}
                      >
                        <AlertCircle size={14} />
                        {message.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="glass-card p-4 bg-black/40 border border-hacker-border">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold mb-2">
                    <span>Security Metrics</span>
                    <span className={attempts > 3 ? 'text-red-500' : 'text-gray-500'}>Failed Attempts: {attempts}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${attempts > 3 ? 'bg-red-500' : 'bg-hacker-green'}`} 
                      style={{ width: `${Math.min((attempts / 5) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="proxy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 p-8 overflow-y-auto custom-scrollbar"
            >
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="glass-card p-6 border-l-4 border-l-orange-500 bg-orange-500/5">
                  <h3 className="text-lg font-bold text-orange-400 uppercase mb-2">Proxy Configuration</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    This application is configured to route traffic through an internal proxy (Burp Suite). 
                    When "Intercept" is enabled in Burp Suite, login requests will be held until you manually forward them.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 border border-hacker-border">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Proxy Settings</h4>
                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Host:</span>
                        <span className="text-gray-300">127.0.0.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Port:</span>
                        <span className="text-gray-300">8080</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-hacker-green">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4 border border-hacker-border">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Attack Vector</h4>
                    <p className="text-[10px] text-gray-500 italic">
                      "Use Burp Suite to intercept the login request. Modify the username or password fields to test for vulnerabilities like SQLi or Brute Force bypass."
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-black/60 border border-hacker-border rounded space-y-2">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">How to use:</div>
                  <ol className="text-[11px] text-gray-400 space-y-2 list-decimal ml-4">
                    <li>Open <span className="text-orange-400 font-bold">Burp Suite</span> from the desktop.</li>
                    <li>Go to the <span className="text-orange-400 font-bold">Proxy</span> tab and turn <span className="text-orange-400 font-bold">Intercept ON</span>.</li>
                    <li>Return to the <span className="text-hacker-green font-bold">Login</span> tab and click "Sign In".</li>
                    <li>The request will appear in Burp Suite. Modify it and click <span className="text-orange-400 font-bold">Forward</span>.</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
