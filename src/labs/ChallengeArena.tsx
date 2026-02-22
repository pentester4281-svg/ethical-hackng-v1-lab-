import { useState, useEffect } from 'react';
import { Trophy, Timer, Target, CheckCircle2, AlertCircle, RefreshCcw, ChevronRight, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: Difficulty;
  requires?: string;
}

const challenges: Challenge[] = [
  { id: 'recon_basic', title: 'Basic Recon', description: 'Find the robots.txt file and identify one disallowed path.', points: 10, difficulty: 'beginner' },
  { id: 'xss_basic', title: 'Trigger XSS', description: 'Inject a simple alert script into the comment section.', points: 10, difficulty: 'beginner' },
  { id: 'sqli_basic', title: 'SQLi Auth Bypass', description: 'Bypass the user search filter using a tautology.', points: 15, difficulty: 'intermediate' },
  { id: 'brute_basic', title: 'Password Crack', description: 'Use dictionary attack to find the admin password.', points: 15, difficulty: 'intermediate' },
  { id: 'chained_exploit', title: 'The Grand Heist', description: 'Exploit SQLi to find admin email, then use credential stuffing to gain access.', points: 30, difficulty: 'advanced', requires: 'sqli_basic' },
  { id: 'recon_advanced', title: 'Tech Stack Analysis', description: 'Identify the backend framework and server version via headers.', points: 20, difficulty: 'advanced' },
];

export default function ChallengeArena() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all');

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completeChallenge = (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || completed.includes(id) || isGameOver) return;
    
    if (challenge.requires && !completed.includes(challenge.requires)) {
      return; // Prerequisite not met
    }

    setCompleted([...completed, id]);
    setScore(prev => prev + challenge.points);
    
    if (completed.length + 1 === challenges.length) {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setTimeLeft(600);
    setScore(0);
    setCompleted([]);
    setIsGameOver(false);
  };

  const filteredChallenges = activeDifficulty === 'all' 
    ? challenges 
    : challenges.filter(c => c.difficulty === activeDifficulty);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 border-b-4 border-b-hacker-green">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-hacker-green/10 rounded-full text-hacker-green">
            <Trophy size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Challenge Arena</h2>
            <p className="text-xs text-gray-500 uppercase">Proving Grounds for Security Experts</p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center justify-center gap-1">
              <Timer size={10} /> Time Remaining
            </div>
            <div className={`text-2xl font-bold font-mono ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-hacker-green'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-500 uppercase mb-1 flex items-center justify-center gap-1">
              <Target size={10} /> Total Score
            </div>
            <div className="text-2xl font-bold text-hacker-green font-mono">
              {score.toString().padStart(3, '0')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-hacker-border w-fit">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setActiveDifficulty(diff)}
            className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
              activeDifficulty === diff 
                ? 'bg-hacker-green text-black' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge) => {
          const isLocked = challenge.requires && !completed.includes(challenge.requires);
          return (
            <div 
              key={challenge.id}
              className={`glass-card p-5 border-l-4 transition-all relative overflow-hidden group ${
                completed.includes(challenge.id) 
                  ? 'border-l-hacker-green bg-hacker-green/5 opacity-60' 
                  : isLocked 
                    ? 'border-l-gray-800 opacity-40 grayscale pointer-events-none'
                    : 'border-l-gray-700 hover:border-l-hacker-green/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-200 text-sm">{challenge.title}</h3>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    challenge.difficulty === 'beginner' ? 'bg-hacker-green/10 text-hacker-green' :
                    challenge.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-hacker-green">+{challenge.points}</span>
              </div>
              <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">{challenge.description}</p>
              
              <div className="flex items-center justify-between">
                {completed.includes(challenge.id) ? (
                  <div className="flex items-center gap-1 text-hacker-green text-[10px] font-bold uppercase">
                    <CheckCircle2 size={12} /> Solved
                  </div>
                ) : isLocked ? (
                  <div className="flex items-center gap-1 text-gray-600 text-[9px] font-bold uppercase">
                    <ShieldAlert size={12} /> Locked: Requires {challenges.find(c => c.id === challenge.requires)?.title}
                  </div>
                ) : (
                  <button 
                    onClick={() => completeChallenge(challenge.id)}
                    className="text-[10px] neon-button py-1 px-4 w-full flex items-center justify-center gap-2 group-hover:bg-hacker-green group-hover:text-black"
                    disabled={isGameOver}
                  >
                    <Zap size={12} /> Mark as Solved
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center space-y-6 border-2 border-hacker-green shadow-[0_0_50px_rgba(0,255,65,0.15)]"
          >
            <div className="text-hacker-green">
              <Trophy size={64} className="mx-auto mb-4" />
              <h2 className="text-3xl font-bold uppercase tracking-widest">Workshop Complete</h2>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400">Your final security score is:</p>
              <div className="text-6xl font-bold text-hacker-green font-mono">{score}</div>
              <p className="text-[10px] text-gray-600 uppercase">Rank: {score > 80 ? 'Elite Operative' : score > 40 ? 'Security Analyst' : 'Novice Researcher'}</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button onClick={resetGame} className="neon-button flex items-center gap-2 px-8">
                <RefreshCcw size={14} /> Restart Arena
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-4 bg-blue-500/5 flex items-start gap-3 border border-blue-500/20">
        <AlertCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            <span className="font-bold text-blue-400 uppercase">Advanced Training:</span> Chained exploitation requires you to combine multiple vulnerabilities. For example, use SQLi to leak credentials, then use those credentials in the Brute Force lab to simulate a successful login.
          </p>
          <p className="text-[9px] text-gray-600 italic">This is a simulated environment. No actual data is being compromised.</p>
        </div>
      </div>
    </div>
  );
}
