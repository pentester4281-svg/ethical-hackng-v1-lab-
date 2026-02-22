import { useState } from 'react';
import { Brain, Search, Shield, ShieldAlert, Info, Target, MousePointer2, Eye, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SurfacePoint {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  type: 'input' | 'auth' | 'api' | 'config';
}

const surfacePoints: SurfacePoint[] = [
  { id: 'login_form', x: 45, y: 40, title: 'Authentication Form', description: 'Primary entry point. Susceptible to Brute Force and Credential Stuffing.', type: 'auth' },
  { id: 'search_bar', x: 20, y: 15, title: 'Search Input', description: 'Reflected input. Check for XSS and SQL Injection vulnerabilities.', type: 'input' },
  { id: 'user_profile', x: 80, y: 20, title: 'User Profile API', description: 'Potential IDOR vulnerability. Check if user ID can be manipulated in requests.', type: 'api' },
  { id: 'footer_links', x: 50, y: 90, title: 'Hidden Config', description: 'Check for robots.txt or sensitive directory links in source code.', type: 'config' },
];

export default function ThoughtProcessMode() {
  const [selectedPoint, setSelectedPoint] = useState<SurfacePoint | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      title: '1. Attack Surface Mapping', 
      content: 'Identify all possible entry points where a user can interact with the application.',
      icon: Target
    },
    { 
      title: '2. Input Analysis', 
      content: 'Analyze how inputs are handled. Are they sanitized? Are they used in database queries?',
      icon: Search
    },
    { 
      title: '3. Auth & Session Review', 
      content: 'Examine the login process, session management, and cookie security flags.',
      icon: Shield
    },
    { 
      title: '4. Vulnerability Prioritization', 
      content: 'Rank identified risks based on impact and exploitability.',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 border-t-2 border-t-purple-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2 uppercase tracking-tight">
              <Brain size={20} /> Interactive Attack Surface
            </h2>
            <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
              <MousePointer2 size={12} /> Click highlights to analyze
            </div>
          </div>

          <div className="relative aspect-video bg-black/60 rounded border border-hacker-border overflow-hidden group">
            {/* Mock Website Screenshot */}
            <div className="absolute inset-0 p-8 flex flex-col gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
              <div className="h-12 bg-white/5 rounded flex items-center px-4 justify-between">
                <div className="w-24 h-4 bg-white/10 rounded" />
                <div className="flex gap-4">
                  <div className="w-12 h-4 bg-white/10 rounded" />
                  <div className="w-12 h-4 bg-white/10 rounded" />
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-64 h-48 bg-white/5 rounded-lg border border-white/10 flex flex-col p-6 gap-4">
                  <div className="w-full h-8 bg-white/10 rounded" />
                  <div className="w-full h-8 bg-white/10 rounded" />
                  <div className="w-full h-10 bg-purple-500/20 rounded" />
                </div>
              </div>
              <div className="h-8 bg-white/5 rounded" />
            </div>

            {/* Interactive Points */}
            {surfacePoints.map((point) => (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedPoint?.id === point.id 
                    ? 'bg-purple-500 border-white scale-125 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                    : 'bg-purple-500/20 border-purple-500 hover:scale-110'
                }`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </button>
            ))}

            <AnimatePresence>
              {selectedPoint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 glass-card p-4 border-l-4 border-l-purple-500 bg-black/90"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-purple-400 uppercase">{selectedPoint.title}</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-purple-500/10 rounded text-purple-300 uppercase">{selectedPoint.type}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{selectedPoint.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass-card p-6 border-t-2 border-t-blue-500">
          <h3 className="text-sm font-bold text-blue-400 uppercase mb-6 flex items-center gap-2">
            <Eye size={16} /> Structured Analysis Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`text-left p-4 rounded border transition-all ${
                  activeStep === i 
                    ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-black/40 border-hacker-border hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded ${activeStep === i ? 'bg-blue-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                    <step.icon size={14} />
                  </div>
                  <span className={`text-xs font-bold uppercase ${activeStep === i ? 'text-blue-400' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{step.content}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <h3 className="text-sm font-bold text-purple-400 uppercase mb-4 flex items-center gap-2">
            <Info size={16} /> Methodology
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <CheckCircle size={14} className="text-purple-500" /> Recon First
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Never start attacking without a full map of the target. Use tools to find hidden files and subdomains.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <CheckCircle size={14} className="text-purple-500" /> Test Inputs
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Every input field is a potential vulnerability. Test for SQLi, XSS, and Command Injection.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-2">
                <CheckCircle size={14} className="text-purple-500" /> Chain Exploits
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                One small bug might not be enough. Combine multiple low-severity issues to achieve a high-impact exploit.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 bg-purple-500/5 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Shield size={16} />
            <span className="text-xs font-bold uppercase">Think Like an Attacker</span>
          </div>
          <p className="text-[11px] text-gray-400 italic">
            "Security is not a product, it's a process. To defend a system, you must first understand how to break it."
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number, className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
