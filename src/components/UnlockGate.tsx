import { useState, useEffect, FormEvent } from 'react';
import { Lock, ShieldAlert, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnlockGateProps {
  onUnlock: () => void;
}

export default function UnlockGate({ onUnlock }: UnlockGateProps) {
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [error, setError] = useState('');

  const ACCESS_CODE = 'VIMALADMIN123ETV1';

  useEffect(() => {
    let interval: any;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0) {
      setIsLocked(false);
      setAttempts(3);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (code === ACCESS_CODE) {
      onUnlock();
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setError('INVALID ACCESS CODE');
      setCode('');

      if (newAttempts <= 0) {
        setIsLocked(true);
        setLockTimer(30);
        setError('SYSTEM LOCKED - SECURITY BREACH DETECTED');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hacker-bg p-4 overflow-hidden relative">
      {/* Background Matrix-like effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-12 gap-4 text-[8px] leading-none">
          {Array.from({ length: 1000 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`p-4 rounded-full mb-4 border-2 ${isLocked ? 'border-red-500 text-red-500' : 'border-hacker-green text-hacker-green'}`}>
            {isLocked ? <ShieldAlert size={48} /> : <Lock size={48} />}
          </div>
          <h1 className="text-2xl font-bold text-center terminal-text text-hacker-green">
            CyberSecurity Workshop Simulation Lab
          </h1>
          <p className="text-gray-500 text-sm mt-2 uppercase tracking-tighter">
            Enter Access Code to Start Workshop
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLocked}
              placeholder="ACCESS_CODE_REQUIRED"
              className="w-full neon-input text-center text-lg tracking-[0.5em]"
              autoFocus
            />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-center text-xs font-bold uppercase ${isLocked ? 'text-red-500' : 'text-yellow-500'}`}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase">
            <span>Attempts Remaining: {attempts}</span>
            {isLocked && <span className="text-red-500">Lockout: {lockTimer}s</span>}
          </div>

          <button
            type="submit"
            disabled={isLocked || !code}
            className={`w-full ${isLocked ? 'opacity-50 cursor-not-allowed border-gray-700 text-gray-700' : 'neon-button'}`}
          >
            {isLocked ? 'SYSTEM_LOCKED' : 'INITIALIZE_SESSION'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-hacker-green/40">
          <Terminal size={12} />
          <span>SECURE_ENCRYPTED_CHANNEL_ESTABLISHED</span>
        </div>
      </motion.div>
    </div>
  );
}
