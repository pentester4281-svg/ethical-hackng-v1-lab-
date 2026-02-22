import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  Shield, 
  Search, 
  Trophy, 
  Brain, 
  LogOut, 
  Monitor, 
  Folder, 
  Globe, 
  Lock,
  Cpu,
  Settings,
  Activity
} from 'lucide-react';
import UnlockGate from './components/UnlockGate';
import FloatingWindow from './components/FloatingWindow';
import Terminal from './components/Terminal';
import BurpSuite from './components/BurpSuite';
import Browser from './components/Browser';
import Dashboard from './pages/Dashboard';
import BruteForceLab from './labs/BruteForceLab';
import SqlInjectionLab from './labs/SqlInjectionLab';
import XssLab from './labs/XssLab';
import ReconLab from './labs/ReconLab';
import ChallengeArena from './labs/ChallengeArena';
import ThoughtProcessMode from './labs/ThoughtProcessMode';
import SecurityTools from './labs/SecurityTools';

interface WindowState {
  id: string;
  title: string;
  type: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  icon: any;
  zIndex: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [terminalLogs, setLogs] = useState<string[]>([]);
  const [topZIndex, setTopZIndex] = useState(10);
  
  // Proxy / Interception State
  const [interceptedRequest, setInterceptedRequest] = useState<any>(null);
  const [isProxyEnabled, setIsProxyEnabled] = useState(true);
  const [isInterceptOn, setIsInterceptOn] = useState(false);
  const [forwardRequest, setForwardRequest] = useState<((data: any) => void) | null>(null);

  const handleUnlock = () => {
    setIsAuthenticated(true);
    // Open terminal by default
    openWindow('terminal', 'System Terminal', 'terminal', TerminalIcon);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setWindows([]);
  };

  const openWindow = (id: string, title: string, type: string, icon: any) => {
    const existing = windows.find(w => w.id === id);
    if (existing) {
      // If already open, just bring to front and unminimize
      setWindows(prev => prev.map(w => 
        w.id === id ? { ...w, isMinimized: false, zIndex: topZIndex + 1 } : w
      ));
      setTopZIndex(prev => prev + 1);
      return;
    }
    const newZ = topZIndex + 1;
    setWindows(prev => [...prev, { 
      id, 
      title, 
      type, 
      isOpen: true, 
      isMinimized: false, 
      isMaximized: false, 
      icon,
      zIndex: newZ
    }]);
    setTopZIndex(newZ);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const focusWindow = (id: string) => {
    const newZ = topZIndex + 1;
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w
    ));
    setTopZIndex(newZ);
  };

  const handleCommand = (cmd: string) => {
    setLogs(prev => [...prev, `> ${cmd}`]);
    const args = cmd.trim().toLowerCase().split(' ');
    const command = args[0];

    if (!command) return;

    switch (command) {
      case 'help':
        setLogs(prev => [...prev, 
          'Available commands:',
          '  help          - Show this help',
          '  clear         - Clear terminal',
          '  recon         - Open Recon Lab',
          '  brute         - Open Brute Force Lab',
          '  sqli          - Open SQL Injection Lab',
          '  xss           - Open XSS Lab',
          '  burp          - Open Burp Suite',
          '  browser       - Open Inbuilt Browser',
          '  challenges    - Open Challenge Arena',
          '  whoami        - Show current user',
          '  ls            - List available modules',
          '  cat [file]    - Read file content',
          '  date          - Show system date',
          '  uname         - Show system info',
          '  ifconfig      - Show network config',
          '  exit          - Logout from system'
        ]);
        break;
      case 'clear':
        setLogs([]);
        break;
      case 'whoami':
        setLogs(prev => [...prev, 'root@hacker-lab']);
        break;
      case 'ls':
        setLogs(prev => [...prev, 'recon  brute  sqli  xss  challenges  burp  browser  notes.txt']);
        break;
      case 'cat':
        if (args[1] === 'notes.txt') {
          setLogs(prev => [...prev, 
            '--- SECURITY RESEARCH NOTES ---',
            'Target: internal-corp.local',
            'Vulnerabilities identified:',
            '1. /admin/login - Potential for Brute Force',
            '2. /api/search - Potential for SQL Injection',
            '3. /comments - Potential for Stored XSS',
            '-------------------------------'
          ]);
        } else {
          setLogs(prev => [...prev, `cat: ${args[1] || ''}: No such file or directory`]);
        }
        break;
      case 'date':
        setLogs(prev => [...prev, new Date().toString()]);
        break;
      case 'uname':
        setLogs(prev => [...prev, 'Linux hacker-lab 5.15.0-101-generic #111-Ubuntu SMP x86_64']);
        break;
      case 'ifconfig':
        setLogs(prev => [...prev, 
          'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
          '        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255',
          '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>',
          '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)',
          '        RX packets 124  bytes 12456 (12.4 KB)',
          '        TX packets 89  bytes 8942 (8.9 KB)'
        ]);
        break;
      case 'recon':
        openWindow('recon', 'Recon Lab', 'recon', Search);
        break;
      case 'brute':
        openWindow('brute', 'Brute Force Lab', 'brute', Lock);
        break;
      case 'sqli':
        openWindow('sqli', 'SQL Injection Lab', 'sqli', Shield);
        break;
      case 'xss':
        openWindow('xss', 'XSS Lab', 'xss', Cpu);
        break;
      case 'burp':
        openWindow('burp', 'Burp Suite Pro', 'burp', Activity);
        break;
      case 'browser':
        openWindow('browser', 'Inbuilt Browser', 'browser', Globe);
        break;
      case 'challenges':
        openWindow('challenge', 'Challenge Arena', 'challenge', Trophy);
        break;
      case 'exit':
        handleLogout();
        break;
      default:
        setLogs(prev => [...prev, `[ERROR] Command not found: ${command}`]);
    }
  };

  const renderWindowContent = (window: WindowState) => {
    const handleProxyIntercept = async (request: any) => {
      if (!isProxyEnabled) return request;
      if (!isInterceptOn) return request;

      // Open Burp if not open
      openWindow('burp', 'Burp Suite Pro', 'burp', Activity);
      
      return new Promise((resolve) => {
        setInterceptedRequest(request);
        setForwardRequest(() => (modifiedData: any) => {
          setInterceptedRequest(null);
          setForwardRequest(null);
          resolve(modifiedData);
        });
      });
    };

    switch (window.type) {
      case 'terminal':
        return <Terminal onCommand={handleCommand} logs={terminalLogs} />;
      case 'browser':
        return <Browser />;
      case 'burp':
        return (
          <BurpSuite 
            interceptedRequest={interceptedRequest}
            isInterceptOn={isInterceptOn}
            setIsInterceptOn={setIsInterceptOn}
            onForward={(data) => forwardRequest?.(data)}
            onDrop={() => forwardRequest?.(null)}
          />
        );
      case 'dashboard':
        return <Dashboard />;
      case 'brute':
        return <BruteForceLab onIntercept={handleProxyIntercept} />;
      case 'sqli':
        return <SqlInjectionLab onIntercept={handleProxyIntercept} />;
      case 'xss':
        return <XssLab onIntercept={handleProxyIntercept} />;
      case 'recon':
        return <ReconLab />;
      case 'challenge':
        return <ChallengeArena />;
      case 'thought':
        return <ThoughtProcessMode />;
      case 'security-tools':
        return <SecurityTools />;
      default:
        return <div className="p-4">Window content for {window.type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 selection:bg-hacker-green selection:text-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="unlock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UnlockGate onUnlock={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen w-screen relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-hacker-green/5 via-transparent to-transparent"
          >
            {/* Desktop Icons */}
            <div className="p-8 grid grid-cols-1 gap-8 w-fit">
              {[
                { id: 'terminal', label: 'Terminal', icon: TerminalIcon, type: 'terminal' },
                { id: 'browser', label: 'Browser', icon: Globe, type: 'browser' },
                { id: 'burp', label: 'Burp Suite', icon: Activity, type: 'burp' },
                { id: 'recon', label: 'Recon Lab', icon: Search, type: 'recon' },
                { id: 'brute', label: 'Brute Force', icon: Lock, type: 'brute' },
                { id: 'sqli', label: 'SQL Injection', icon: Shield, type: 'sqli' },
                { id: 'xss', label: 'XSS Lab', icon: Cpu, type: 'xss' },
                { id: 'challenge', label: 'Challenges', icon: Trophy, type: 'challenge' },
              ].map((item) => (
                <button
                  key={item.id}
                  onDoubleClick={() => openWindow(item.id, item.label, item.type, item.icon)}
                  className="flex flex-col items-center gap-2 group w-20"
                >
                  <div className="w-12 h-12 bg-black/40 border border-hacker-border rounded-lg flex items-center justify-center group-hover:bg-hacker-green/10 group-hover:border-hacker-green/50 transition-all">
                    <item.icon size={24} className="text-gray-400 group-hover:text-hacker-green" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Windows */}
            <AnimatePresence>
              {windows.map((win, index) => (
                <FloatingWindow
                  key={win.id}
                  id={win.id}
                  title={win.title}
                  icon={<win.icon size={14} />}
                  onClose={closeWindow}
                  onMinimize={toggleMinimize}
                  onMaximize={toggleMaximize}
                  onFocus={focusWindow}
                  isMinimized={win.isMinimized}
                  isMaximized={win.isMaximized}
                  zIndex={win.zIndex}
                  initialX={150 + (index * 30)}
                  initialY={50 + (index * 30)}
                  width={win.type === 'burp' ? '900px' : win.type === 'terminal' ? '700px' : '850px'}
                  height={win.type === 'burp' ? '600px' : win.type === 'terminal' ? '450px' : '550px'}
                >
                  {renderWindowContent(win)}
                </FloatingWindow>
              ))}
            </AnimatePresence>

            {/* Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/80 border-t border-hacker-border flex items-center px-4 gap-4 z-[100]">
              <button className="p-2 bg-hacker-green/10 border border-hacker-green/30 rounded text-hacker-green hover:bg-hacker-green hover:text-black transition-all">
                <Monitor size={20} />
              </button>
              
              <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
                {windows.map(win => (
                  <button 
                    key={win.id}
                    onClick={() => focusWindow(win.id)}
                    className={`px-4 py-1.5 border rounded text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${
                      win.isMinimized 
                        ? 'bg-black/40 border-hacker-border text-gray-600' 
                        : 'bg-white/5 border-hacker-green/30 text-gray-300 shadow-[0_0_10px_rgba(0,255,65,0.1)]'
                    }`}
                  >
                    <win.icon size={12} />
                    {win.title}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" />
                  SYSTEM ONLINE
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
