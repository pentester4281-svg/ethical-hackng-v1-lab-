import { useState, useEffect } from 'react';
import { Shield, Key, Cookie, Database, Eye, EyeOff, RefreshCcw, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SecurityTools() {
  const [activeTab, setActiveTab] = useState<'jwt' | 'cookies' | 'storage'>('jwt');
  const [jwtInput, setJwtInput] = useState('');
  const [jwtDecoded, setJwtDecoded] = useState<any>(null);
  const [cookies, setCookies] = useState<any[]>([]);
  const [storage, setStorage] = useState<any[]>([]);

  // Mock JWT for demo
  const mockJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MTU2MTYwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // In a real app we'd use document.cookie and localStorage
    // For simulation, we'll use mock data that feels real
    setCookies([
      { name: 'sessionId', value: 'abc123xyz789', httpOnly: false, secure: true, sameSite: 'Lax' },
      { name: 'user_pref', value: 'dark_mode', httpOnly: false, secure: false, sameSite: 'None' },
      { name: 'auth_token', value: 'eyJhbGciOiJIUzI1Ni...', httpOnly: true, secure: true, sameSite: 'Strict' }
    ]);

    setStorage([
      { key: 'theme', value: 'hacker-dark' },
      { key: 'last_login', value: new Date().toISOString() },
      { key: 'debug_mode', value: 'true' }
    ]);
  };

  const decodeJwt = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const payload = JSON.parse(atob(parts[1]));
      const header = JSON.parse(atob(parts[0]));
      setJwtDecoded({ header, payload });
    } catch (e) {
      setJwtDecoded({ error: 'Failed to decode JWT. Ensure it is a valid Base64 encoded token.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="glass-card p-6 border-t-2 border-t-hacker-green">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-hacker-green/10 rounded-full text-hacker-green">
            <Shield size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Advanced Security Tools</h2>
            <p className="text-xs text-gray-500 uppercase">Inspect and Analyze Session Data</p>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-hacker-border w-fit mb-8">
          {[
            { id: 'jwt', name: 'JWT Decoder', icon: Key },
            { id: 'cookies', name: 'Cookie Inspector', icon: Cookie },
            { id: 'storage', name: 'Session Storage', icon: Database }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-hacker-green text-black' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon size={14} />
              {tab.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'jwt' && (
            <motion.div 
              key="jwt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 uppercase font-bold">Encoded JWT Token</label>
                <div className="flex gap-2">
                  <textarea 
                    value={jwtInput}
                    onChange={(e) => setJwtInput(e.target.value)}
                    placeholder="Paste your JWT here..."
                    className="flex-1 neon-input font-mono text-xs h-24 resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => decodeJwt(jwtInput)}
                      className="neon-button px-4 py-2 text-[10px] h-fit"
                    >
                      Decode
                    </button>
                    <button 
                      onClick={() => { setJwtInput(mockJwt); decodeJwt(mockJwt); }}
                      className="text-[10px] text-gray-500 hover:text-hacker-green transition-colors uppercase font-bold"
                    >
                      Load Mock
                    </button>
                  </div>
                </div>
              </div>

              {jwtDecoded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Header</div>
                    <pre className="bg-black/60 p-4 rounded border border-hacker-border text-[11px] text-blue-400 font-mono overflow-x-auto">
                      {JSON.stringify(jwtDecoded.header || {}, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] text-gray-500 uppercase font-bold">Payload</div>
                    <pre className="bg-black/60 p-4 rounded border border-hacker-border text-[11px] text-purple-400 font-mono overflow-x-auto">
                      {jwtDecoded.error ? (
                        <span className="text-red-500">{jwtDecoded.error}</span>
                      ) : (
                        JSON.stringify(jwtDecoded.payload || {}, null, 2)
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'cookies' && (
            <motion.div 
              key="cookies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Active Browser Cookies</div>
                <button onClick={refreshData} className="text-hacker-green hover:rotate-180 transition-transform duration-500">
                  <RefreshCcw size={14} />
                </button>
              </div>
              <div className="overflow-hidden border border-hacker-border rounded">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-white/5 text-gray-500 uppercase text-[9px]">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Value</th>
                      <th className="p-3 text-center">HttpOnly</th>
                      <th className="p-3 text-center">Secure</th>
                      <th className="p-3">SameSite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.map((cookie, i) => (
                      <tr key={i} className="border-t border-hacker-border hover:bg-white/5">
                        <td className="p-3 font-bold text-gray-300">{cookie.name}</td>
                        <td className="p-3 text-gray-500 font-mono truncate max-w-[150px]">{cookie.value}</td>
                        <td className="p-3 text-center">
                          {cookie.httpOnly ? <Shield size={12} className="mx-auto text-hacker-green" /> : <Shield size={12} className="mx-auto text-red-500 opacity-30" />}
                        </td>
                        <td className="p-3 text-center">
                          {cookie.secure ? <Shield size={12} className="mx-auto text-hacker-green" /> : <Shield size={12} className="mx-auto text-red-500 opacity-30" />}
                        </td>
                        <td className="p-3 text-gray-500">{cookie.sameSite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded flex gap-3 items-start">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  <span className="font-bold text-red-500 uppercase">Security Risk:</span> Cookies missing the <code className="text-red-400">HttpOnly</code> flag can be stolen via XSS attacks. Always set this flag for session identifiers.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'storage' && (
            <motion.div 
              key="storage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Local Storage Data</div>
                <div className="flex gap-4">
                  <button onClick={refreshData} className="text-hacker-green hover:rotate-180 transition-transform duration-500">
                    <RefreshCcw size={14} />
                  </button>
                  <button className="text-red-500 hover:scale-110 transition-transform">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {storage.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-hacker-border rounded group hover:border-hacker-green/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Database size={14} className="text-blue-400" />
                      <span className="text-xs font-bold text-gray-300">{item.key}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="glass-card p-6 border-l-4 border-l-blue-500 bg-blue-500/5">
        <h3 className="text-sm font-bold text-blue-400 uppercase mb-4 flex items-center gap-2">
          <Eye size={16} /> Why use these tools?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-300 uppercase">JWT Analysis</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Attackers decode JWTs to find sensitive information in the payload or identify weak signing algorithms (like "none").
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-300 uppercase">Cookie Hijacking</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              If a session cookie isn't protected, an attacker can steal it via XSS and impersonate the user without a password.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-gray-300 uppercase">Storage Leaks</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Developers often store sensitive data in LocalStorage, which is accessible to any script running on the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
