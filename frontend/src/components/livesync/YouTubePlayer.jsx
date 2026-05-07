import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Volume2, VolumeX, Plus, SkipForward } from 'lucide-react';

const YouTubePlayer = ({
  videoId,
  isPlaying,
  playbackState,
  onPlaybackStateChange,
  onCurrentTimeChange,
  volume = 100,
  onVolumeChange,
  isHost = false,
  onEnded,
  onSeek,
  onAddSongRequest,
  onSkip,
}) => {
  const playerRef = useRef(null);
  const [localIsPlaying, setLocalIsPlaying] = useState(isPlaying);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const seekTimeRef = useRef(null);

  useEffect(() => {
    setLocalIsPlaying(isPlaying);
    if (!playerRef.current) return;

    if (isPlaying && playerRef.current.playVideo) {
      playerRef.current.playVideo();
    } else if (!isPlaying && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Periodic state update and Time Sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (!playerRef.current) return;

      try {
        const current = playerRef.current.getCurrentTime?.();
        const total = playerRef.current.getDuration?.();
        const state = playerRef.current.getPlayerState?.();

        if (current !== undefined) {
          setCurrentTime(current);
          onCurrentTimeChange?.(current);

          // ---- THUẬT TOÁN ĐỒNG BỘ NÂNG CAO CHO LISTENER ----
          if (!isHost && playbackState) {
            let targetTime = playbackState.positionMs / 1000;
            if (playbackState.isPlaying) {
              // Ưu tiên dùng localReceivedAt để loại bỏ hoàn toàn sai lệch đồng hồ (Clock Drift)
              if (playbackState.localReceivedAt) {
                const diffMs = Date.now() - playbackState.localReceivedAt;
                if (diffMs > 0) targetTime += (diffMs / 1000);
              } else if (playbackState.updatedAt) {
                // Fallback nếu lấy từ REST API lúc mới join
                const diffMs = Date.now() - new Date(playbackState.updatedAt).getTime();
                if (diffMs > 0) targetTime += (diffMs / 1000);
              }
            }

            // state === 3 là Buffering, -1 là Unstarted. 
            // Nếu đang lag (Buffering) thì kệ cho nó load, KHÔNG force seek để tránh vòng lặp giật lag.
            if (state !== 3 && state !== -1 && playbackState.isPlaying) {
              const diff = targetTime - current;

              if (diff > 5 || diff < -2) {
                // Lệch quá lớn (> 5s chậm, hoặc > 2s nhanh) -> Hard Seek
                playerRef.current.seekTo?.(targetTime, true);
                playerRef.current.setPlaybackRate?.(1);
              } else if (diff > 1.5 && diff <= 5) {
                // Hơi chậm (1.5s -> 5s) -> Tua nhanh 1.25x để đuổi theo (Soft catch-up)
                playerRef.current.setPlaybackRate?.(1.25);
              } else if (diff < -0.5 && diff >= -2) {
                // Bị nhanh hơn Host (chạy trước 0.5s -> 2s) -> Tua chậm 0.75x để Host đuổi kịp (Soft slow-down)
                playerRef.current.setPlaybackRate?.(0.75);
              } else if (diff >= -0.5 && diff <= 0.5) {
                // Trong vùng an toàn (lệch nửa giây) -> Trả về tốc độ chuẩn
                playerRef.current.setPlaybackRate?.(1);
              }
            }
          }
        }
        
        if (total !== undefined) {
          setDuration(total);
        }
      } catch (error) {
        console.error('Error getting player state:', error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onCurrentTimeChange, isHost, playbackState]);

  const handleStateChange = (event) => {
    const { data } = event;
    // 1 = playing, 2 = paused, 3 = buffering, 0 = ended, -1 = unstarted
    
    // We only want to sync explicit play/pause actions, not buffering
    if (data === 1) {
      if (isHost) {
        setLocalIsPlaying(true);
        onPlaybackStateChange?.(true);
      } else if (!isPlaying) {
        // Force pause if listener tries to play while room is paused
        playerRef.current?.pauseVideo?.();
      }
    } else if (data === 2) {
      if (isHost) {
        setLocalIsPlaying(false);
        onPlaybackStateChange?.(false);
      } else if (isPlaying) {
        // Force play if listener tries to pause while room is playing
        playerRef.current?.playVideo?.();
      }
    } else if (data === 0) {
      // Handle auto-skip when ended
      if (isHost) {
        setLocalIsPlaying(false);
        onEnded?.();
      }
    }
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
  };

  const handleTogglePlay = () => {
    if (!playerRef.current) return;

    if (localIsPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.playVideo?.();
    }
    setLocalIsPlaying(!localIsPlaying);
    onPlaybackStateChange?.(!localIsPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange?.(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume?.(newVolume);
    }
  };

  const handleSeek = (e) => {
    if (!isHost) return;
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo?.(newTime);
      onSeek?.(newTime);
      onCurrentTimeChange?.(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoId) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10" />
        <div className="z-10 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 shadow-xl rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
            <Play size={32} className="text-gray-400 dark:text-gray-500 ml-1" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Phòng nhạc đang trống</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">Chưa có bài hát nào được chọn. Hãy tìm kiếm và thêm bài hát yêu thích của bạn vào danh sách phát nhé!</p>
          {isHost && (
            <button 
              onClick={onAddSongRequest}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-semibold shadow-lg hover:shadow-primary-500/30 transition-all flex items-center gap-2 transform hover:scale-105"
            >
              <Plus size={18} />
              Mở Hàng Đợi Để Thêm Bài
            </button>
          )}
          {!isHost && (
            <button 
              onClick={onAddSongRequest}
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2"
            >
              Đề xuất bài hát vào Hàng Đợi
            </button>
          )}
        </div>
      </div>
    );
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
      controls: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="w-full h-full flex flex-col bg-black rounded-lg overflow-hidden relative">
      <div className="flex-1 relative">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
          className="w-full h-full pointer-events-auto"
          iframeClassName="w-full h-full pointer-events-auto"
        />
        {/* Invisible overlay to block interactions for non-hosts */}
        {!isHost && <div className="absolute inset-0 z-10 bg-transparent" />}
      </div>

      {/* Custom controls */}
      <div className="bg-gray-900 p-4 space-y-2">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-8">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={isHost ? handleSeek : undefined}
            disabled={!isHost}
            className={`flex-1 h-1 rounded cursor-pointer ${
              isHost ? 'bg-gray-700 accent-primary-500' : 'bg-gray-800 accent-gray-600 cursor-not-allowed'
            }`}
          />
          <span className="text-xs text-gray-400 w-8 text-right">{formatTime(duration)}</span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={isHost ? handleTogglePlay : undefined}
              disabled={!isHost}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isHost ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {localIsPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            {isHost && (
              <button
                onClick={onSkip}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gray-800 hover:bg-gray-700 text-white"
                title="Phát bài tiếp theo"
              >
                <SkipForward size={18} />
              </button>
            )}
            {!isHost && <span className="text-xs text-gray-500 font-medium">Chỉ Host mới có quyền điều khiển</span>}
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX size={16} className="text-gray-400" />
            ) : (
              <Volume2 size={16} className="text-gray-400" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded cursor-pointer accent-primary-500"
            />
            <span className="text-xs text-gray-400 w-8">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
