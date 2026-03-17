import React from 'react';
import { Share2, Edit3, Settings, Play, Pause } from 'lucide-react';

const ProfileHeader = ({ profileData, isGuest, isPlaying, onTogglePlay, t }) => {
  return (
    <div className={`w-full h-64 sm:h-80 relative overflow-hidden bg-gradient-to-b ${profileData.themeColor}`}>
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      {/* Actions inside header */}
      <div className="absolute top-6 right-6 flex gap-3 z-10">
        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors" title={t('profile.share', { defaultValue: 'Share Profile' })}>
          <Share2 size={20} />
        </button>
        {!isGuest && (
          <>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors" title={t('profile.edit_cover', { defaultValue: 'Edit Cover Photo' })}>
              <Edit3 size={20} />
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors" title={t('header.settings')}>
              <Settings size={20} />
            </button>
          </>
        )}
      </div>

      {/* Profile Info & Pinned Mini-player */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-end justify-between gap-6 z-10 w-auto">

        {/* Avatar & Info */}
        <div className="flex items-end gap-x-6 gap-y-4 flex-wrap w-full sm:w-auto">
          <div className="relative group translate-y-1 sm:translate-y-2">
            {/* Soundwave animation ring */}
            <div className="absolute -inset-2 rounded-full border-4 border-white/20 animate-pulse" />
            <div className="absolute -inset-4 rounded-full border-4 border-white/10 animate-ping" style={{ animationDuration: '3s' }} />

            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-surface-color shadow-2xl relative z-10 ${profileData.avatar}`} />
            {!isGuest && (
              <button className="absolute bottom-2 right-2 p-2 bg-surface-color text-text-color rounded-full shadow-lg z-20 hover:scale-110 transition-transform">
                <Edit3 size={16} />
              </button>
            )}
          </div>

          <div className="text-white drop-shadow-md pb-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{profileData.name}</h1>
            <p className="text-sm font-medium text-white/80 mt-1">{profileData.username}</p>
            {profileData.description && (
              <p className="text-sm text-white/90 mt-3 max-w-lg leading-relaxed">{profileData.description}</p>
            )}

          </div>
        </div>

        {/* Match Score (If Guest) */}
        {isGuest && (
          <div className="hidden sm:flex flex-col items-center bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
            <span className="text-xs text-white/80 font-semibold uppercase tracking-wider mb-1">{t('profile.match_score')}</span>
            <div className="text-3xl font-bold text-primary-400">85%</div>
          </div>
        )}

        {/* Pinned Mini-player */}
        <div className="w-full sm:w-64 bg-black/40 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl flex items-center gap-3">
          <div className={`relative w-14 h-14 rounded-full shadow-lg overflow-hidden flex-shrink-0 ${profileData.pinnedSong.cover} ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <div className="absolute inset-0 border-4 border-black/50 rounded-full" />
            <div className="absolute inset-1/3 bg-black rounded-full border border-gray-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{profileData.pinnedSong.title}</p>
            <p className="text-white/70 text-xs truncate">{profileData.pinnedSong.artist}</p>
            <div className="w-full h-1 bg-white/20 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-white w-1/4 rounded-full" />
            </div>
          </div>
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;
