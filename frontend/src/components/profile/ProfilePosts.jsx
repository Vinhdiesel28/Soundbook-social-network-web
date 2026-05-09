import React, { useState } from 'react';
import FeedPost from '../newsfeed/FeedPost';
import CreatePost from '../newsfeed/CreatePost';

const ProfilePosts = ({ t, posts, isGuest = false, onPostCreated, onPostDeleted, onPostShared }) => {
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="pt-8 mt-4 border-t border-gray-200 dark:border-gray-800">
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
