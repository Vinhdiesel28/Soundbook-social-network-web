import React from 'react';
import { Music, Disc3 } from 'lucide-react';

const LiveRadar = ({ radarData }) => {
  return (
    <div className="bg-surface-color rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar">
      <div className="flex gap-4 min-w-max pb-2">
        {radarData.map((item) => (
          <div key={item.id} className={`flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0 ${item.isRoom ? 'w-[72px]' : 'w-16'}`}>
            <div className={`relative w-14 h-14 rounded-full p-0.5 ${item.isLive ? 'bg-gradient-to-tr from-primary-500 to-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
              <div className={`w-full h-full rounded-full border-2 border-surface-color ${item.avatar} flex items-center justify-center`}>
                {item.isRoom && <Music size={20} className="text-white" />}
              </div>
              {item.isLive && (
                <div className="absolute -bottom-1 -right-1 bg-surface-color rounded-full p-0.5">
                  <div className="bg-red-500 text-white rounded-full p-1 animate-pulse">
                    <Disc3 size={10} />
                  </div>
                </div>
              )}
            </div>
            <span className={`text-[11px] font-medium text-center leading-tight ${item.isRoom ? 'w-full line-clamp-2' : 'truncate w-full'}`}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRadar;
