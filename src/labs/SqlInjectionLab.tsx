import { useState, useEffect } from 'react';
import { Database, Shield, ShieldAlert, Search, Terminal as TerminalIcon, AlertCircle, ChevronRight, Code, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SqlInjectionLabProps {
  onIntercept?: (request: any) => Promise<any>;
}

export default function SqlInjectionLab({ onIntercept }: SqlInjectionLabProps) {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [isSecure, setIsSecure] = useState(false);

  // Mock database
  const users = [
    { id: 1, username: 'admin', role: 'Administrator', email: 'admin@corp.local' },
    { id: 2, username: 'vimal', role: 'Security Lead', email: 'vimal@corp.local' },
    { id: 3, username: 'guest', role: 'Guest', email: 'guest@corp.local' },
  ];

  const secrets = [
    { id: 1, key: 'DB_PASSWORD', value: 'S3cur3P@ssw0rd!' },
    { id: 2, key: 'API_KEY', value: 'sk_live_51N...' },
    { id: 3, key: 'FLAG', value: 'VIMAL{SQL_INJECTION_MASTER}' },
  ];

  const handleExecute = async () => {
    setIsExecuting(true);
    setResults(null);
    setError(null);
    const start = performance.now();

    let finalQuery = query;

    if (onIntercept) {
      const intercepted = await onIntercept({
        url: '/api/search',
        method: 'POST',
        body: { query }
      });
      if (!intercepted) {
        setError('Request dropped by proxy.');
        setIsExecuting(false);
        return;
      }
      finalQuery = intercepted.body.query;
    }

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    if (isSecure) {
      // Secure logic: parameterized query simulation
      const found = users.filter(u => u.username === finalQuery);
      setResults(found.length > 0 ? found : []);
    } else {
      // Vulnerable logic
      const q = finalQuery.toLowerCase();

      // Time-based simulation
      if (q.includes('sleep(')) {
        const seconds = parseInt(q.match(/sleep\((\d+)\)/)?.[1] || '2');
        await new Promise(r => setTimeout(r, seconds * 1000));
      }

      // Auth Bypass / Boolean Based
      if (q.includes("' or '1'='1") || q.includes("' or 1=1")) {
        setResults(users);
      } 
      // Union Based / Hidden Data Retrieval
      else if (q.includes('union select')) {
        if (q.includes('secrets')) {
          setResults([...users, ...secrets.map(s => ({ id: s.id, username: s.key, role: 'SECRET', email: s.value }))]);
        } else {
          setResults(users);
        }
      }
      // Simple search
      else {
        const found = users.filter(u => u.username.toLowerCase().includes(q));
        setResults(found);
      }
    }

    setExecutionTime(performance.now() - start);
    setIsExecuting(false);
  };

  return (
    <div className="h-full flex flex-col bg-black/40">
      <div className="p-6 border-b border-hacker-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-yellow-500/10 rounded text-yellow-500">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">SQL Injection Lab</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Target: User Search API</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Prepared Statements</span>
          <button 
            onClick={() => setIsSecure(!isSecure)}
            className={`w-8 h-4 rounded-full transition-colors relative ${isSecure ? 'bg-hacker-green' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isSecure ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Query Input */}
        <div className="w-1/3 border-r border-hacker-border p-6 space-y-6 bg-black/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Search Query</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setQuery("' OR '1'='1")}
                  className="text-[9px] text-blue-400 hover:underline uppercase font-bold"
                >
                  Auth Bypass
                </button>
                <button 
                  onClick={() => setQuery("' UNION SELECT * FROM secrets--")}
                  className="text-[9px] text-purple-400 hover:underline uppercase font-bold"
                >
                  Union
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-500" />
              <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full neon-input pl-10 py-3 text-xs h-32 font-mono resize-none"
                placeholder="SELECT * FROM users WHERE username = '...'"
              />
            </div>
            <button 
              onClick={handleExecute}
              disabled={isExecuting || !query.trim()}
              className="w-full neon-button py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isExecuting ? 'Executing...' : 'Run Query'}
            </button>
          </div>

          <div className="glass-card p-4 border-l-4 border-l-blue-500 bg-blue-500/5">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
              <Info size={12} /> Lab Objectives
            </h4>
            <ul className="text-[10px] text-gray-500 space-y-2">
              <li>1. Bypass login using <code className="text-blue-300">' OR '1'='1</code></li>
              <li>2. Retrieve hidden data from <code className="text-purple-300">secrets</code> table</li>
              <li>3. Test time-based injection with <code className="text-yellow-300">SLEEP(5)</code></li>
            </ul>
          </div>
        </div>

        {/* Right: Results & Analysis */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-hacker-border bg-black/20 flex justify-between items-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
              <TerminalIcon size={12} /> Query Results
            </div>
            {executionTime > 0 && (
              <div className="text-[9px] text-gray-500 font-mono">
                Execution time: <span className={executionTime > 2000 ? 'text-yellow-500' : 'text-hacker-green'}>{executionTime.toFixed(2)}ms</span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {results.length > 0 ? (
                    <div className="overflow-hidden border border-hacker-border rounded">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-white/5 text-gray-500 uppercase text-[9px]">
                          <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Username</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Email / Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((row, i) => (
                            <tr key={i} className="border-t border-hacker-border hover:bg-white/5">
                              <td className="p-3 text-gray-500">{row.id}</td>
                              <td className="p-3 font-bold text-gray-300">{row.username}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${row.role === 'SECRET' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                  {row.role}
                                </span>
                              </td>
                              <td className="p-3 text-gray-500 font-mono">{row.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-600 italic text-sm">
                      No records found for the given query.
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Database size={48} className="mb-4" />
                  <p className="text-sm uppercase font-bold">Execute a query to see results</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Vulnerability Analysis */}
          <div className="h-48 border-t border-hacker-border bg-black/60 p-4 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 flex items-center gap-2">
              <ShieldAlert size={12} className="text-red-500" /> Vulnerability Analysis
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-500/10 rounded text-red-500 mt-0.5">
                  <Code size={12} />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-gray-300 uppercase">Impact of Current Query</h5>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {query.toLowerCase().includes('union') ? 'UNION-based SQLi detected. This allows an attacker to combine results from multiple tables, potentially leaking sensitive data like passwords or API keys.' : 
                     query.toLowerCase().includes('or 1=1') ? 'Authentication Bypass detected. The "OR 1=1" condition always evaluates to true, causing the database to return all records regardless of the original filter.' :
                     query.toLowerCase().includes('sleep') ? 'Time-based Blind SQLi detected. The database is forced to wait, allowing an attacker to infer data based on response times.' :
                     'Enter a payload to analyze its security impact.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
