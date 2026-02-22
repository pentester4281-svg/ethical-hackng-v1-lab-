import { Activity, Shield, Cpu, Globe, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const stats = [
    { label: 'Active Sessions', value: '1,284', icon: Users, color: 'text-blue-400' },
    { label: 'System Load', value: '14%', icon: Activity, color: 'text-hacker-green' },
    { label: 'Threat Level', value: 'Elevated', icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Uptime', value: '99.9%', icon: Zap, color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">
            System <span className="text-hacker-green">Overview</span>
          </h1>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">
            CyberSecurity Workshop Simulation Lab v2.4
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Workshop Lead</div>
            <div className="text-sm font-bold text-hacker-green uppercase">Vimal Ethical Hacking</div>
          </div>
          <div className="w-10 h-10 bg-hacker-green/10 rounded-full border border-hacker-green/30 flex items-center justify-center">
            <Shield size={20} className="text-hacker-green" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-l-2 border-l-hacker-border hover:border-l-hacker-green transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-white/5 rounded group-hover:bg-white/10 transition-colors ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] text-gray-600 font-mono">0x{Math.floor(Math.random() * 1000).toString(16)}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="lg:col-span-2 glass-card p-6 border-t-2 border-t-blue-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-blue-400 uppercase flex items-center gap-2">
              <Cpu size={16} /> Node Status
            </h3>
            <span className="text-[10px] text-gray-500 uppercase">Real-time monitoring</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Auth Server', status: 'Online', load: 12 },
              { name: 'Database Cluster', status: 'Online', load: 45 },
              { name: 'API Gateway', status: 'Online', load: 28 },
              { name: 'Storage Node', status: 'Warning', load: 89 }
            ].map((node, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded border border-hacker-border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-hacker-green' : 'bg-yellow-500'} animate-pulse`} />
                  <span className="text-xs font-bold text-gray-300">{node.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${node.load > 80 ? 'bg-red-500' : node.load > 50 ? 'bg-yellow-500' : 'bg-hacker-green'}`} 
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">{node.load}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 border-t-2 border-t-purple-500">
          <h3 className="text-sm font-bold text-purple-400 uppercase mb-6 flex items-center gap-2">
            <Globe size={16} /> Security Events
          </h3>
          <div className="space-y-4">
            {[
              { msg: 'SQLi attempt blocked', time: '2m ago', type: 'alert' },
              { msg: 'New user registered', time: '15m ago', type: 'info' },
              { msg: 'Brute force detected', time: '1h ago', type: 'warning' },
              { msg: 'System backup complete', time: '3h ago', type: 'success' }
            ].map((event, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                  event.type === 'alert' ? 'bg-red-500' : 
                  event.type === 'warning' ? 'bg-yellow-500' : 
                  event.type === 'success' ? 'bg-hacker-green' : 'bg-blue-500'
                }`} />
                <div>
                  <div className="text-[11px] text-gray-300 font-bold">{event.msg}</div>
                  <div className="text-[9px] text-gray-600 uppercase">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-hacker-border rounded text-[10px] font-bold uppercase text-gray-500 hover:text-white hover:border-gray-600 transition-all">
            View Full Logs
          </button>
        </div>
      </div>

      {/* Workshop Banner */}
      <div className="glass-card p-6 bg-hacker-green/5 border border-hacker-green/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-hacker-green/10 rounded-full text-hacker-green">
            <CheckCircle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase">Ethical Hacking Workshop</h4>
            <p className="text-xs text-gray-500">Master the art of penetration testing with real-world simulations.</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-[10px] text-gray-500 uppercase font-bold">Powered by</div>
          <div className="text-lg font-bold text-hacker-green tracking-tighter uppercase">Vimal Workshop</div>
        </div>
      </div>
    </div>
  );
}
