import React from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const RoomQueue = ({ queue }) => {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-black/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">{t('room.now_playing')}</h3>
        </div>
        <div className="flex items-center gap-3 p-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
          <div className={`w-12 h-12 rounded-lg ${queue[0].cover} shadow-md flex items-center justify-center`}>
            <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-primary-500">{queue[0].title}</p>
            <p className="text-xs text-text-muted">{queue[0].artist}</p>
          </div>
          <div className="text-xs text-text-muted pr-2">{queue[0].duration}</div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="font-bold text-sm">{t('room.up_next')}</h3>
          <button className="text-xs text-primary-500 font-semibold hover:underline">{t('room.add_song')}</button>
        </div>
        <div className="space-y-2">
          {queue.slice(1).map((song) => (
            <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
              <div className={`w-10 h-10 rounded-lg ${song.cover}`}></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{song.title}</p>
                <p className="text-xs text-text-muted">{song.artist}</p>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md">
                  <Plus size={14} />
                </button>
                <span className="text-xs font-medium text-text-muted w-4 text-center">{song.votes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomQueue;
