import React, { useState, useEffect, FormEvent } from 'react';
import { Cpu, Send, Shield, ShieldAlert, Trash2, AlertCircle, Terminal as TerminalIcon, Info, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface XssLabProps {
  onIntercept?: (request: any) => Promise<any>;
}

export default function XssLab({ onIntercept }: XssLabProps) {
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', user: 'vimal', text: 'Welcome to the security workshop! Try to find the XSS vulnerability here.', timestamp: new Date().toISOString() },
    { id: '2', user: 'admin', text: 'Remember to always sanitize your inputs.', timestamp: new Date().toISOString() }
  ]);
  const [newComment, setNewComment] = useState('');
  const [isSanitized, setIsSanitized] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handlePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    let finalText = newComment;

    if (onIntercept) {
      const intercepted = await onIntercept({
        url: '/api/comments',
        method: 'POST',
        body: { text: newComment }
      });
      if (!intercepted) return;
      finalText = intercepted.body.text;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      user: 'guest_' + Math.floor(Math.random() * 1000),
      text: finalText,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');

    // Simulate XSS execution if not sanitized
    if (!isSanitized && finalText.includes('<script>')) {
      // In a real browser, this would execute. We simulate it with an alert.
      const scriptContent = finalText.match(/<script>(.*?)<\/script>/)?.[1] || 'XSS Executed!';
      setAlertMessage(`[XSS ALERT] Script Executed: ${scriptContent}`);
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const clearComments = () => {
    setComments([]);
  };

  return (
    <div className="h-full flex flex-col bg-black/40">
      <div className="p-6 border-b border-hacker-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-purple-500/10 rounded text-purple-400">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Stored XSS Lab</h2>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Target: Public Comment Feed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Output Sanitization</span>
          <button 
            onClick={() => setIsSanitized(!isSanitized)}
            className={`w-8 h-4 rounded-full transition-colors relative ${isSanitized ? 'bg-hacker-green' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isSanitized ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Comment Feed */}
        <div className="flex-1 flex flex-col border-r border-hacker-border bg-black/20">
          <div className="p-4 border-b border-hacker-border flex justify-between items-center">
            <div className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-2">
              <TerminalIcon size={12} /> Live Feed
            </div>
            <button onClick={clearComments} className="text-red-500 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-4 border-l-2 border-l-purple-500 bg-purple-500/5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-purple-400 uppercase">{comment.user}</span>
                    <span className="text-[9px] text-gray-600 font-mono">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  {/* VULNERABLE RENDER */}
                  {isSanitized ? (
                    <p className="text-[11px] text-gray-400 leading-relaxed">{comment.text}</p>
                  ) : (
                    <div 
                      className="text-[11px] text-gray-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: comment.text }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-hacker-border bg-black/40">
            <form onSubmit={handlePost} className="flex gap-3">
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 neon-input py-2.5 px-4 text-xs"
                placeholder="Write a comment... (Try <script>alert('XSS')</script>)"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="neon-button px-6 py-2.5 flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={14} />
                <span className="text-[10px] font-bold uppercase">Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Analysis & Payloads */}
        <div className="w-80 flex flex-col">
          <div className="p-4 border-b border-hacker-border bg-black/20 text-[10px] text-gray-500 uppercase font-bold">
            XSS Analysis
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="glass-card p-4 border-l-4 border-l-blue-500 bg-blue-500/5">
              <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
                <Info size={12} /> Stored XSS
              </h4>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                Stored XSS occurs when a malicious script is permanently stored on the target server (e.g., in a database). When a user visits the page, the script is served and executed in their browser.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase">Example Payloads</h4>
              {[
                { name: 'Basic Alert', code: "<script>alert('XSS')</script>" },
                { name: 'Cookie Stealer', code: "<script>fetch('/api/log?c=' + document.cookie)</script>" },
                { name: 'Image Error', code: "<img src=x onerror=alert(1)>" },
                { name: 'SVG Payload', code: "<svg onload=alert(1)>" }
              ].map((payload, i) => (
                <button 
                  key={i}
                  onClick={() => setNewComment(payload.code)}
                  className="w-full text-left p-2 bg-black/40 border border-hacker-border rounded hover:border-purple-500/50 transition-all group"
                >
                  <div className="text-[9px] text-gray-500 uppercase font-bold mb-1 group-hover:text-purple-400">{payload.name}</div>
                  <code className="text-[10px] text-gray-600 font-mono break-all">{payload.code}</code>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {alertMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
                    <ShieldAlert size={14} /> Critical Alert
                  </div>
                  <p className="text-[11px] text-gray-300 font-mono">{alertMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-black/60 border-t border-hacker-border">
            <div className="flex items-center gap-2 text-hacker-green text-[10px] font-bold uppercase mb-2">
              <Shield size={14} /> Protection Tip
            </div>
            <p className="text-[9px] text-gray-600 leading-relaxed">
              Always use context-aware output encoding. In React, <code className="text-gray-400">dangerouslySetInnerHTML</code> should be avoided unless absolutely necessary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
