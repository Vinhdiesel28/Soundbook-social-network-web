import React from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SongSearch from './SongSearch';

const RoomQueue = ({ queue, onVote, onAddSong, onRemove, isHost }) => {
  const { t } = useLanguage();
  const [showSearch, setShowSearch] = React.useState(false);

  const parsePayload = (item) => {
    if (!item?.trackPayloadJson) return null;
    try {
      return JSON.parse(item.trackPayloadJson);
    } catch (e) {
      return null;
    }
  };

  const handleSelectSong = (video) => {
    if (onAddSong) {
      onAddSong(video.videoId, JSON.stringify(video));
    }
    setShowSearch(false);
  };
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Hàng đợi phát</h3>
        <button 
          onClick={() => setShowSearch(!showSearch)}
          className="text-xs px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold flex items-center gap-1 transition-colors shadow-sm"
        >
          {showSearch ? <X size={14} /> : <Plus size={14} />}
          {showSearch ? 'Đóng' : 'Thêm bài'}
        </button>
      </div>

      {showSearch && (
        <div className="mb-6 relative z-50">
          <SongSearch onSelectSong={handleSelectSong} />
        </div>
      )}

      {queue.length === 0 && !showSearch ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
            <Plus size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold mb-1">Chưa có bài hát nào</p>
          <p className="text-xs text-gray-500 mb-4">Hãy là người đầu tiên thêm nhạc vào phòng nhé!</p>
          <button 
            onClick={() => setShowSearch(true)}
            className="text-xs px-4 py-2 bg-gray-900 dark:bg-white dark:text-black text-white rounded-lg font-semibold transition-colors"
          >
            Tìm và thêm bài hát
          </button>
        </div>
      ) : queue.length > 0 ? (
        <div className="space-y-6">
          {/* Now Playing */}
          <div>
            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Đang phát</h3>
            {(() => {
              const firstSong = queue[0];
              const payload = parsePayload(firstSong);
              return (
                <div className="flex items-center gap-3 p-3 bg-primary-500/10 rounded-xl border border-primary-500/20 relative overflow-hidden group">
                  <div className="w-14 h-14 rounded-lg bg-black shadow-md flex items-center justify-center overflow-hidden relative flex-shrink-0">
                    {payload?.thumbnail ? (
                      <img src={payload.thumbnail} alt={payload.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white/40 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-primary-500 truncate" title={payload?.title || firstSong.trackId}>
                      {payload?.title || firstSong.trackId}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                      {payload?.channelTitle || firstSong.addedByDisplayName}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Up Next */}
          {queue.length > 1 && (
            <div>
              <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">Tiếp theo</h3>
              <div className="space-y-2">
                {queue.slice(1).map((song) => {
                  const payload = parsePayload(song);
                  return (
                  <div key={song.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-gray-800/80 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group">
                    <div className="w-10 h-10 rounded-lg bg-black overflow-hidden flex-shrink-0">
                      {payload?.thumbnail ? (
                        <img src={payload.thumbnail} alt={payload.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" title={payload?.title || song.trackId}>
                        {payload?.title || song.trackId}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {payload?.channelTitle || song.addedByDisplayName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {isHost && (
                        <button
                          onClick={() => onRemove?.(song.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Xóa bài hát"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => onVote?.(song.id)}
                        className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="text-xs font-medium text-gray-500 w-4 text-center">{song.voteCount}</span>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RoomQueue;
