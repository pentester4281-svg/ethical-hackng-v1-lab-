import { useState, useEffect } from 'react';
import { Shield, Send, RefreshCcw, ArrowRight, Settings } from 'lucide-react';

interface BurpSuiteProps {
  interceptedRequest: any;
  isInterceptOn: boolean;
  setIsInterceptOn: (on: boolean) => void;
  onForward: (data: any) => void;
  onDrop: () => void;
}

export default function BurpSuite({ 
  interceptedRequest, 
  isInterceptOn, 
  setIsInterceptOn, 
  onForward, 
  onDrop 
}: BurpSuiteProps) {
  const [modifiedBody, setModifiedBody] = useState('');

  // Update modified body when a new request arrives
  useEffect(() => {
    if (interceptedRequest) {
      setModifiedBody(JSON.stringify(interceptedRequest.body, null, 2));
    } else {
      setModifiedBody('');
    }
  }, [interceptedRequest]);

  const handleForward = () => {
    if (interceptedRequest) {
      try {
        const parsed = JSON.parse(modifiedBody);
        onForward({ ...interceptedRequest, body: parsed });
      } catch (e) {
        // If invalid JSON, just forward original or show error
        onForward(interceptedRequest);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#2b2b2b] text-gray-300 font-sans">
      {/* Tabs */}
      <div className="flex bg-[#3c3f41] border-b border-black text-[11px]">
        {['Dashboard', 'Target', 'Proxy', 'Intruder', 'Repeater', 'Sequencer', 'Decoder'].map((tab) => (
          <div 
            key={tab} 
            className={`px-4 py-1.5 border-r border-black cursor-pointer ${tab === 'Proxy' ? 'bg-[#2b2b2b] text-orange-400 font-bold' : 'hover:bg-white/5'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Proxy Sub-tabs */}
      <div className="flex bg-[#3c3f41] border-b border-black text-[10px] px-2 gap-1 py-1">
        <button 
          onClick={() => setIsInterceptOn(!isInterceptOn)}
          className={`px-4 py-0.5 rounded border border-black shadow-sm transition-colors ${isInterceptOn ? 'bg-orange-600 text-white' : 'bg-[#4e5254] text-gray-300'}`}
        >
          Intercept is {isInterceptOn ? 'on' : 'off'}
        </button>
        <button 
          disabled={!interceptedRequest} 
          onClick={handleForward}
          className="px-4 py-0.5 bg-[#4e5254] border border-black rounded disabled:opacity-50 hover:bg-[#5a5e60]"
        >
          Forward
        </button>
        <button 
          disabled={!interceptedRequest} 
          onClick={onDrop}
          className="px-4 py-0.5 bg-[#4e5254] border border-black rounded disabled:opacity-50 hover:bg-[#5a5e60]"
        >
          Drop
        </button>
        <button className="px-4 py-0.5 bg-[#4e5254] border border-black rounded ml-auto">Options</button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">
        <div className="flex-1 bg-[#1e1e1e] border border-black rounded overflow-hidden flex flex-col">
          <div className="bg-[#3c3f41] px-2 py-1 text-[10px] border-b border-black flex justify-between">
            <span>Raw Request</span>
            <span className="text-orange-400">HTTP/1.1</span>
          </div>
          <textarea 
            className="flex-1 bg-transparent p-3 font-mono text-xs outline-none resize-none text-gray-400 focus:text-white transition-colors"
            value={interceptedRequest ? `POST ${interceptedRequest.url} HTTP/1.1\nHost: internal-corp.local\nContent-Type: application/json\n\n${modifiedBody}` : 'Waiting for request...'}
            onChange={(e) => {
              if (interceptedRequest) {
                const val = e.target.value;
                const bodyPart = val.split('\n\n')[1] || '';
                setModifiedBody(bodyPart);
              }
            }}
            spellCheck={false}
          />
        </div>

        <div className="h-1/3 bg-[#1e1e1e] border border-black rounded overflow-hidden flex flex-col">
          <div className="bg-[#3c3f41] px-2 py-1 text-[10px] border-b border-black">
            Inspector
          </div>
          <div className="p-3 text-[11px] text-gray-500 italic">
            {isInterceptOn ? (
              interceptedRequest ? 'Request intercepted! You can modify the body and click Forward.' : 'Intercepting traffic on port 8080...'
            ) : 'Intercept is disabled. Traffic is passing through.'}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#3c3f41] border-t border-black px-2 py-0.5 text-[9px] flex justify-between text-gray-500">
        <div className="flex gap-4">
          <span>Proxy: 127.0.0.1:8080</span>
          <span className="text-green-500">Connected</span>
        </div>
        <span>Burp Suite Community Edition v2024.3</span>
      </div>
    </div>
  );
}
