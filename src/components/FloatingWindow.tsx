import { ReactNode } from 'react';
import { motion, useDragControls, AnimatePresence } from 'motion/react';
import { X, Minus, Square, GripHorizontal } from 'lucide-react';

interface FloatingWindowProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialX?: number;
  initialY?: number;
  width?: string;
  height?: string;
  icon?: ReactNode;
  key?: string | number;
}

export default function FloatingWindow({ 
  id, 
  title, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  onFocus,
  isMinimized,
  isMaximized,
  zIndex,
  initialX = 100, 
  initialY = 100,
  width = '600px',
  height = '400px',
  icon
}: FloatingWindowProps) {
  const dragControls = useDragControls();

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          drag={!isMaximized}
          dragMomentum={false}
          dragControls={dragControls}
          dragListener={false}
          onPointerDown={() => onFocus(id)}
          initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            width: isMaximized ? '100vw' : width,
            height: isMaximized ? '100vh' : height,
            x: isMaximized ? 0 : undefined,
            y: isMaximized ? 0 : undefined,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{ 
            position: 'absolute', 
            zIndex: isMaximized ? 1000 : zIndex,
            top: 0,
            left: 0
          }}
          className="glass-card flex flex-col overflow-hidden shadow-2xl border-hacker-green/30"
        >
          {/* Window Header / Drag Handle */}
          <div 
            className="bg-black/80 border-b border-hacker-border px-4 py-2 flex items-center justify-between cursor-default select-none"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="flex items-center gap-3 flex-1 h-full">
              <div className="text-hacker-green opacity-70">
                {icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {title}
              </span>
              <GripHorizontal size={14} className="text-gray-700 ml-2 cursor-grab active:cursor-grabbing" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
                className="p-1 hover:bg-white/5 rounded transition-colors text-gray-500"
              >
                <Minus size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
                className="p-1 hover:bg-white/5 rounded transition-colors text-gray-500"
              >
                <Square size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(id); }}
                className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors text-gray-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex-1 overflow-auto bg-black/40 custom-scrollbar">
            {children}
          </div>

          {/* Resize Handle (Simplified) */}
          {!isMaximized && (
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-gradient-to-br from-transparent to-hacker-green/20" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
