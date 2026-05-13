import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import LiveRadar from '../components/newsfeed/LiveRadar';
import CreatePost from '../components/newsfeed/CreatePost';
import FeedPost from '../components/newsfeed/FeedPost';
import NewsfeedSidebar from '../components/newsfeed/NewsfeedSidebar';
import { feedApi } from '../services/feed';
import { getActiveRooms } from '../services/room';
import { friendsApi } from '../services/friends';
import { normalizePost, normalizeSuggestion, normalizeTrending } from '../utils/feedNormalizers';
import { useRef } from 'react';
import YouTube from 'react-youtube';

const Newsfeed = () => {
  const { t } = useLanguage();
  const playerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('following');
  const [playingId, setPlayingId] = useState(null);
  const [payload, setPayload] = useState({ posts: [], friendSuggestions: [], trending: [], incomingRequests: [] });
  const [activeRooms, setActiveRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActiveRooms = useCallback(async () => {
    setRoomsLoading(true);
    setRoomsError('');
    try {
      const response = await getActiveRooms(12);
      setActiveRooms(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setRoomsError(err?.message || 'Không thể tải phòng live.');
      setActiveRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  }, []);

  const loadFeed = useCallback(async (tab = activeTab) => {
    setLoading(true);
    setError('');
    try {
      const data = await feedApi.getFeed({ tab: tab === 'foryou' ? 'discover' : 'following', limit: 20 });
      setPayload(prev => ({
        ...prev,
        posts: data?.posts || [],
        friendSuggestions: data?.friendSuggestions || [],
        trending: data?.trending || [],
      }));
    } catch (err) {
      setError(err?.message || 'Không thể tải bảng tin.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await feedApi.getFeed({ tab: activeTab === 'foryou' ? 'discover' : 'following', limit: 20 });
        if (mounted) {
          setPayload(prev => ({
            ...prev,
            posts: data?.posts || [],
            friendSuggestions: data?.friendSuggestions || [],
            trending: data?.trending || [],
          }));
        }
      } catch (err) {
        if (mounted) setError(err?.message || 'Không thể tải bảng tin.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [activeTab]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const hub = await friendsApi.getFriendHub();
        setPayload(prev => ({ ...prev, incomingRequests: hub?.incomingRequests || [] }));
      } catch (e) {
        console.error('Failed to load friend requests:', e);
      }
    };
    loadRequests();
  }, []);

  useEffect(() => {
    loadActiveRooms();
  }, [loadActiveRooms]);

  const posts = useMemo(() => payload.posts.map(normalizePost), [payload.posts]);
  const suggestions = useMemo(() => payload.friendSuggestions.map(normalizeSuggestion), [payload.friendSuggestions]);
  const trending = useMemo(() => payload.trending.map(normalizeTrending), [payload.trending]);
  const incomingRequests = payload.incomingRequests;

  // Extract videoId from a normalized post
  const getPostVideoId = (p) => {
    if (!p) return null;
    if (p.media?.id) return p.media.id;
    const ref = p.media?.ref || {};
    if (ref.id) return ref.id;
    if (ref.videoId) return ref.videoId;
    if (ref.itemId) return ref.itemId;
    // Extract from YouTube thumbnail URL: ytimg.com/vi/{VIDEO_ID}/...
    const thumb = ref.thumbnail || p.media?.coverUrl || '';
    const thumbMatch = thumb.match(/\/vi\/([a-zA-Z0-9_-]{11})\//); 
    if (thumbMatch) return thumbMatch[1];
    // Parse raw refJson
    try {
      const raw = p.original?.refJson;
      if (raw) {
        const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
        const vid = parsed?.id || parsed?.videoId || parsed?.itemId;
        if (vid) return vid;
        // Also try thumbnail in raw refJson
        const rawThumb = parsed?.thumbnail || '';
        const rawMatch = rawThumb.match(/\/vi\/([a-zA-Z0-9_-]{11})\//); 
        if (rawMatch) return rawMatch[1];
      }
    } catch (e) { /* ignore */ }
    return null;
  };

  const togglePlay = (id) => {
    if (playingId === id) {
      // Pause currently playing
      try { playerRef.current?.pauseVideo?.(); } catch (e) { /* ignore */ }
      setPlayingId(null);
    } else {
      // Start new video
      const targetPost = posts.find(p => p.id === id);
      const videoId = getPostVideoId(targetPost);
      const isAudio = targetPost?.type === 'audio' || targetPost?.type === 'music_quick_note';

      if (videoId && playerRef.current && isAudio) {
        try {
          playerRef.current.unMute?.();
          playerRef.current.setVolume?.(100);
          playerRef.current.loadVideoById(videoId);
        } catch (e) {
          console.error('loadVideoById error:', e);
        }
      } else if (!isAudio) {
        // For video posts, stop the global player so it doesn't double play
        try { playerRef.current?.stopVideo?.(); } catch (e) { /* ignore */ }
      }
      setPlayingId(id);
    }
  };

  const prependPost = (rawPost) => {
    if (!rawPost?.id) return;
    setPayload(prev => ({
      ...prev,
      posts: [rawPost, ...(prev.posts || []).filter(item => item.id !== rawPost.id)],
    }));
  };

  const removePost = (postId) => {
    setPayload(prev => ({
      ...prev,
      posts: (prev.posts || []).filter(item => item.id !== postId),
    }));
  };

  const playingPost = useMemo(() => posts.find(p => p.id === playingId), [posts, playingId]);
  const playingVideoId = useMemo(() => {
    if (!playingPost) return null;
    if (playingPost.media?.id) return playingPost.media.id;
    const ref = playingPost.media?.ref || {};
    if (ref.id) return ref.id;
    if (ref.videoId) return ref.videoId;
    if (ref.itemId) return ref.itemId;
    try {
      const raw = playingPost.original?.refJson;
      if (raw) {
        const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
        const vid = parsed?.id || parsed?.videoId || parsed?.itemId;
        if (vid) return vid;
      }
    } catch (e) { /* ignore */ }
    return null;
  }, [playingPost]);

  // When playingVideoId changes, load it into the already-mounted player
  useEffect(() => {
    if (!playerRef.current) return;
    if (playingVideoId) {
      try {
        playerRef.current.loadVideoById(playingVideoId);
      } catch (e) {
        console.error('loadVideoById error:', e);
      }
    } else {
      try {
        playerRef.current.stopVideo?.();
      } catch (e) { /* ignore */ }
    }
  }, [playingVideoId]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Global Newsfeed Player - Always Mounted */}
      <div className="fixed opacity-0 pointer-events-none" style={{ width: 1, height: 1, bottom: 0, left: 0 }}>
        <YouTube
          videoId="dQw4w9WgXcQ"
          opts={{
            playerVars: {
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              origin: window.location.origin,
            }
          }}
          onReady={(e) => {
            playerRef.current = e.target;
            e.target.unMute();
            e.target.setVolume(100);
          }}
          onEnd={() => setPlayingId(null)}
          onError={() => setPlayingId(null)}
        />
      </div>

      <div className="flex-1 lg:w-[70%] space-y-6 overflow-hidden">
        <LiveRadar
          rooms={activeRooms}
          loading={roomsLoading}
          error={roomsError}
          onRefresh={loadActiveRooms}
        />

        <CreatePost onCreated={prependPost} />

        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 px-2">
          <button
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'following' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('following')}
          >
            {t('feed.following')}
            {activeTab === 'following' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
          <button
            className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'foryou' ? 'text-primary-500' : 'text-text-muted hover:text-text-color'}`}
            onClick={() => setActiveTab('foryou')}
          >
            {t('feed.foryou')}
            {activeTab === 'foryou' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />}
          </button>
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <div className="flex items-center gap-2"><AlertCircle size={18} /> {error}</div>
            <button onClick={() => loadFeed()} className="rounded-lg bg-red-100 px-3 py-1.5 font-semibold hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900">
              Tải lại
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-surface-color p-8 text-center shadow-sm dark:border-gray-800">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-500/20 border-t-primary-500" />
            <p className="font-semibold">Đang tải bảng tin...</p>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {posts.length ? posts.map((post) => (
              <FeedPost
                key={post.id}
                post={post}
                isPlaying={playingId === post.id}
                onTogglePlay={() => togglePlay(post.id)}
                onDeleted={removePost}
                onShared={prependPost}
              />
            )) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-surface-color p-8 text-center text-sm text-text-muted dark:border-gray-700">
                Chưa có bài viết phù hợp. Hãy theo dõi thêm bạn bè hoặc tạo bài viết mới.
              </div>
            )}
          </div>
        )}
      </div>

      <NewsfeedSidebar suggestions={suggestions} trending={trending} requests={incomingRequests} onRefreshRequests={() => {
        friendsApi.getFriendHub().then(hub => setPayload(prev => ({ ...prev, incomingRequests: hub?.incomingRequests || [] })));
      }} />
    </div>
  );
};

export default Newsfeed;
