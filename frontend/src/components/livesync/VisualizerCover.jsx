import React from 'react';
import { Heart } from 'lucide-react';

const VisualizerCover = ({ isPlaying }) => {
  const bars = Array.from({ length: 40 });

  return (
    <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-black opacity-40 blur-3xl scale-125" />

      <div className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full shadow-2xl z-10 border-4 border-gray-800 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-black rounded-full" />
        <div className="absolute inset-1/3 bg-black rounded-full border border-gray-700 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600" />
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full flex items-end justify-center gap-1 z-0 px-4 opacity-50">
        {bars.map((_, i) => (
          <div
            key={i}
            className="w-2 bg-primary-500 rounded-t-sm transition-all duration-75"
            style={{
              height: isPlaying ? `${Math.random() * 60 + 10}px` : '10px',
              opacity: isPlaying ? Math.random() * 0.5 + 0.5 : 0.3
            }}
          />
        ))}
      </div>

      {isPlaying && (
        <div className="absolute bottom-20 right-20 text-rose-500 animate-[bounce_2s_infinite] opacity-50">
          <Heart size={24} fill="currentColor" />
        </div>
      )}
    </div>
  );
};

export default VisualizerCover;
