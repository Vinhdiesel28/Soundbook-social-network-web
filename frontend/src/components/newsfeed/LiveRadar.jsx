import React, { useState } from 'react';
import { Music, Disc3, LogIn, Radio, X, ArrowLeft, Keyboard } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const RoomModal = ({ room, onClose }) => {
  const { t } = useLanguage();
  const [view, setView] = useState('menu');
  const [code, setCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleClose = () => { setView('menu'); setCode(''); setRoomName(''); onClose(); };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 pb-4 bg-gradient-to-br from-yellow-400 to-orange-500 flex flex-col items-center gap-2">
          {view !== 'menu' && (
            <button
              onClick={() => setView('menu')}
              className="absolute top-3 left-3 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Music size={26} className="text-white" />
          </div>
          <div className="text-center">
            <h2 className="font-bold text-white text-base">{room?.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">
              {view === 'menu' && t('room.choose_action')}
              {view === 'join' && t('room.join_room')}
              {view === 'open' && t('room.open_room')}
            </p>
          </div>
        </div>

        {/* Menu */}
        {view === 'menu' && (
          <div className="p-4 space-y-3">
            <button
              onClick={() => setView('join')}
              className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-primary-500/30 bg-primary-50 dark:bg-primary-500/10 hover:border-primary-500 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-primary-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <LogIn size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-text-color">{t('room.join_room')}</p>
                <p className="text-xs text-text-muted mt-0.5">{t('room.join_room_desc')}</p>
              </div>
            </button>

            <button
              onClick={() => setView('open')}
              className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 hover:border-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Radio size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-text-color">{t('room.open_room')}</p>
                <p className="text-xs text-text-muted mt-0.5">{t('room.open_room_desc')}</p>
              </div>
            </button>
          </div>
        )}

        {/* Join */}
        {view === 'join' && (
          <div className="p-5">
            <p className="text-xs text-text-muted mb-3">{t('room.join_instruction')}</p>
            <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 focus-within:border-primary-500 transition-colors bg-gray-50 dark:bg-gray-900">
              <Keyboard size={18} className="text-text-muted shrink-0" />
              <input
                autoFocus
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('room.code_placeholder')}
                className="flex-1 bg-transparent text-sm outline-none text-text-color placeholder:text-text-muted"
              />
              <button
                disabled={!code.trim()}
                onClick={handleClose}
                className="text-sm font-semibold text-primary-500 disabled:opacity-30 hover:text-primary-600 transition-colors shrink-0"
              >
                {t('room.join_room_btn')}
              </button>
            </div>
            <p className="text-[11px] text-text-muted mt-3 text-center">{t('room.join_hint')}</p>
          </div>
        )}

        {/* Open */}
        {view === 'open' && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">{t('room.room_name_label')}</label>
              <div className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus-within:border-rose-500 transition-colors bg-gray-50 dark:bg-gray-900">
                <Radio size={16} className="text-text-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder={t('room.room_name_placeholder')}
                  className="flex-1 bg-transparent text-sm outline-none text-text-color placeholder:text-text-muted"
                />
              </div>
            </div>
            <p className="text-xs text-text-muted">{t('room.open_confirm_desc')}</p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setView('menu')}
                className="flex-1 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {t('report.cancel')}
              </button>
              <button
                disabled={!roomName.trim()}
                onClick={() => { navigate("/room/123") }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-40"
              >
                {t('room.open_room_btn')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveRadar = ({ radarData }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <>
      <div className="bg-surface-color rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 overflow-x-auto custom-scrollbar">
        <div className="flex gap-4 min-w-max pb-2">
          {radarData.map((item) => (
            <div
              key={item.id}
              className={`relative flex flex-col items-center gap-1 cursor-pointer group flex-shrink-0 ${item.isRoom ? 'w-[72px]' : 'w-16'}`}
              onClick={() => item.isRoom && setSelectedRoom(item)}
            >
              <div className={`relative w-14 h-14 rounded-full p-0.5 transition-transform group-hover:scale-105 ${item.isRoom
                  ? 'bg-gradient-to-tr from-yellow-400 to-orange-500'
                  : item.isLive
                    ? 'bg-gradient-to-tr from-primary-500 to-purple-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}>
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
              <span className={`text-[11px] font-medium text-center leading-tight ${item.isRoom ? 'w-full line-clamp-2' : 'truncate w-full'}`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <RoomModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </>
  );
};

export default LiveRadar;


