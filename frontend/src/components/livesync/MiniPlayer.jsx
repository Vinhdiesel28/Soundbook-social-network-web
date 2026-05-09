import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import { Play, Pause, X, ChevronUp, Music2 } from 'lucide-react';
import { useRoomSession } from '../../context/RoomSessionContext';

const MiniPlayer = () => {
  const { session, closeSession, setLocalPlayback } = useRoomSession();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const [minimized, setMinimized] = useState(false);
  const playback = session?.playback;

  // Keep hook order stable; only gate rendering below.
  const isInRoom = location.pathname === `/room/${session?.roomId}`;
  const shouldHide = !session || isInRoom;

  useEffect(() => {
    if (shouldHide || !playerRef.current || !playback) return;
    if (playback.isPlaying) playerRef.current.playVideo?.();
    else playerRef.current.pauseVideo?.();
  }, [shouldHide, playback?.isPlaying]);

  // Clean up YouTube player when the mini player is hidden or component unmounts
  useEffect(() => {
    if (!shouldHide) return undefined;
    if (playerRef.current) {
      try {
        const iframe = playerRef.current.getIframe?.();
        if (iframe) try { iframe.src = 'about:blank'; } catch (_) {}
      } catch (_) {}
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch (_) {}
      }
    }
    playerRef.current = null;
    return undefined;
  }, [shouldHide]);

  // Ensure player is destroyed on unmount as a fallback
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          const iframe = playerRef.current.getIframe?.();
          if (iframe) try { iframe.src = 'about:blank'; } catch (_) {}
        } catch (_) {}
        if (playerRef.current?.destroy) {
          try { playerRef.current.destroy(); } catch (_) {}
        }
      }
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (shouldHide || !playerRef.current || !playback) return;
    const elapsed = playback.isPlaying && playback.localReceivedAt
      ? (Date.now() - playback.localReceivedAt) / 1000
      : 0;
    const target = (playback.positionMs / 1000) + elapsed;
    if (target > 1) playerRef.current.seekTo?.(target, true);
  }, [shouldHide, playback?.positionMs]);

  const handleReady = (e) => {
    playerRef.current = e.target;
    if (!playback) return;
    const elapsed = playback.isPlaying && playback.localReceivedAt
      ? (Date.now() - playback.localReceivedAt) / 1000
      : 0;
    const target = (playback.positionMs / 1000) + elapsed;
    if (target > 2) e.target.seekTo(target, true);
    if (playback.isPlaying) e.target.playVideo();
    else e.target.pauseVideo();
  };

  if (shouldHide) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
        minimized ? 'w-64' : 'w-80'
      }`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Hidden YouTube iframe for audio */}
      {playback?.trackId && (
        <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
          <YouTube
            videoId={playback.trackId}
            opts={{ playerVars: { autoplay: 0, controls: 0 } }}
            onReady={handleReady}
            onStateChange={(e) => {
              if (e.data === 0) setLocalPlayback({ isPlaying: false });
            }}
          />
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/60 border-b border-gray-700/50">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
        <span className="text-xs text-gray-400 font-medium flex-1 truncate">LIVE · {session.roomName}</span>
        <button onClick={() => setMinimized((v) => !v)} className="text-gray-400 hover:text-white transition-colors p-1">
          <ChevronUp size={14} className={`transition-transform ${minimized ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={closeSession} className="text-gray-400 hover:text-red-400 transition-colors p-1" title="Đóng">
          <X size={14} />
        </button>
      </div>

      {/* Player body */}
      {!minimized && (
        <div className="flex items-center gap-3 p-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
            {playback?.trackThumbnail ? (
              <img src={playback.trackThumbnail} alt="track" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music2 size={20} className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {playback?.trackTitle || 'Đang phát...'}
            </p>
            <button
              onClick={() => navigate(`/room/${session.roomId}`)}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors truncate block mt-0.5"
            >
              Quay về phòng →
            </button>
          </div>
          {/* MiniPlayer is listen-only — play/pause controlled by Host via STOMP */}
          <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
            {playback?.isPlaying
              ? <Pause size={16} className="text-white" />
              : <Play size={16} className="text-white ml-0.5" />
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniPlayer;
