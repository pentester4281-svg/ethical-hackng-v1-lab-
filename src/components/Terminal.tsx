import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  logs: string[];
}

export default function Terminal({ onCommand, logs }: TerminalProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-black/90 font-mono text-[12px] p-4">
      <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-1" ref={scrollRef}>
        <div className="text-gray-500 mb-4">
          CyberSecurity Workshop Simulation Lab [Version 2.4.0]<br/>
          (c) 2024 Vimal Ethical Hacking Workshop. All rights reserved.<br/>
          Type 'help' for available commands.
        </div>
        {logs.map((log, i) => (
          <div key={i} className={`whitespace-pre-wrap ${
            log.startsWith('>') ? 'text-hacker-green font-bold' : 
            log.startsWith('[ERROR]') ? 'text-red-500' : 
            log.startsWith('[SUCCESS]') ? 'text-hacker-green' : 
            log.startsWith('[INFO]') ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {log}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-hacker-border pt-3">
        <ChevronRight size={16} className="text-hacker-green" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-hacker-green placeholder-hacker-green/20"
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
}
