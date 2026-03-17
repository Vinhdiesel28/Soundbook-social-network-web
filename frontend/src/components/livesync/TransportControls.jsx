import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2 } from 'lucide-react';

const TransportControls = ({ isPlaying, onTogglePlay }) => {
  return (
    <div className="px-6 py-4 bg-surface-color border-t border-gray-200 dark:border-gray-800 z-10 w-full">
      <div className="flex flex-col gap-3">
        {/* Progress */}
        <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
          <span>1:24</span>
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer overflow-hidden relative group">
            <div className="absolute top-0 left-0 h-full bg-primary-500 w-1/3 group-hover:bg-primary-400" />
          </div>
          <span>3:50</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-text-muted">
            <button className="hover:text-primary-500 transition-colors"><Volume2 size={20} /></button>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-text-muted hover:text-text-color transition-colors"><SkipBack size={24} fill="currentColor" /></button>
            <button 
              onClick={onTogglePlay}
              className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary-500/30"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button className="text-text-muted hover:text-text-color transition-colors"><SkipForward size={24} fill="currentColor" /></button>
          </div>

          <div className="flex items-center gap-4 text-text-muted">
            <button className="hover:text-primary-500 transition-colors"><Maximize2 size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportControls;
