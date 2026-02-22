import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Key, 
  Database, 
  Code, 
  Search, 
  Trophy, 
  Brain, 
  LogOut,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'brute-force', label: 'Brute Force', icon: Key },
  { id: 'sql-injection', label: 'SQL Injection', icon: Database },
  { id: 'xss', label: 'XSS Lab', icon: Code },
  { id: 'recon', label: 'Recon Lab', icon: Search },
  { id: 'security-tools', label: 'Security Tools', icon: Shield },
  { id: 'challenge', label: 'Challenge Arena', icon: Trophy },
  { id: 'thought', label: 'Thought Process', icon: Brain },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <div className="w-64 h-screen bg-black border-r border-hacker-border flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-hacker-border">
        <div className="flex items-center gap-2 text-hacker-green">
          <div className="w-8 h-8 bg-hacker-green/10 rounded flex items-center justify-center border border-hacker-green/30">
            <span className="font-bold">CS</span>
          </div>
          <span className="font-bold text-xs tracking-tighter uppercase">Simulation Lab</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-hacker-green/10 text-hacker-green border-r-2 border-hacker-green' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'text-hacker-green' : 'group-hover:text-gray-300'} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-hacker-border">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded transition-all"
        >
          <LogOut size={18} />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
}
