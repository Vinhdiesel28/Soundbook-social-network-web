import React, { useState, useRef } from 'react';
import YouTube from 'react-youtube';
import FeedPost from '../newsfeed/FeedPost';
import CreatePost from '../newsfeed/CreatePost';

// Extract YouTube videoId from a normalized post
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
  try {
    const raw = p.original?.refJson;
    if (raw) {
      const parsed = typeof raw === 'object' ? raw : JSON.parse(raw);
      const vid = parsed?.id || parsed?.videoId || parsed?.itemId;
      if (vid) return vid;
      const rawThumb = parsed?.thumbnail || '';
      const rawMatch = rawThumb.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
      if (rawMatch) return rawMatch[1];
    }
  } catch (e) { /* ignore */ }
  return null;
};

const ProfilePosts = ({ t, posts, isGuest = false, onPostCreated, onPostDeleted, onPostShared }) => {
  const [playingId, setPlayingId] = useState(null);
  const playerRef = useRef(null);

  const togglePlay = (id) => {
    if (playingId === id) {
      try { playerRef.current?.pauseVideo?.(); } catch (e) { /* ignore */ }
      setPlayingId(null);
    } else {
      const targetPost = posts.find(p => p.id === id);
      const videoId = getPostVideoId(targetPost);
      if (videoId && playerRef.current) {
        try {
          playerRef.current.unMute?.();
          playerRef.current.setVolume?.(100);
          playerRef.current.loadVideoById(videoId);
        } catch (e) {
          console.error('ProfilePosts loadVideoById error:', e);
        }
      }
      setPlayingId(id);
    }
  };

  return (
    <div className="pt-8 mt-4 border-t border-gray-200 dark:border-gray-800">
      {/* Always-mounted audio engine */}
      <div className="fixed opacity-0 pointer-events-none" style={{ width: 1, height: 1, bottom: 0, left: 0 }}>
        <YouTube
          videoId="dQw4w9WgXcQ"
          opts={{ playerVars: { autoplay: 0, controls: 0, rel: 0, origin: window.location.origin } }}
          onReady={(e) => {
            playerRef.current = e.target;
            e.target.unMute();
            e.target.setVolume(100);
          }}
          onEnd={() => setPlayingId(null)}
          onError={() => setPlayingId(null)}
        />
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-6">{t('profile.posts_title', { defaultValue: 'Bài đăng & Chia sẻ' })}</h2>
      {!isGuest ? <CreatePost onCreated={onPostCreated} /> : null}
      <div className="space-y-6 pb-10">
        {posts.length ? posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            isPlaying={playingId === post.id}
            onTogglePlay={() => togglePlay(post.id)}
            onDeleted={onPostDeleted}
            onShared={onPostShared}
          />
        )) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-text-muted dark:border-gray-700">
            Chưa có bài viết nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;
