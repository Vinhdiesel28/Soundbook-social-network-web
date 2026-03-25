import React from 'react';
import { Users, Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const RoomHeader = ({ membersCount }) => {
  const { t } = useLanguage();
  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
      <div className="text-white">
        <h2 className="font-bold text-lg drop-shadow-md">Chill Đêm Khuya</h2>
        <p className="text-xs text-white/80 drop-shadow-md flex items-center gap-1">
          <Users size={12} /> {membersCount} {t('room.listening')}
        </p>
      </div>
      <button className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors">
        <Settings size={18} />
      </button>
    </div>
  );
};

export default RoomHeader;
