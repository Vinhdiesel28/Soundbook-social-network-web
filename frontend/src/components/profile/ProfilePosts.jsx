import React, { useState } from 'react';
import FeedPost from '../newsfeed/FeedPost';

const ProfilePosts = ({ t, posts }) => {
  const [playingId, setPlayingId] = useState(null);

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="pt-8 mt-4 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold tracking-tight mb-8">{t('profile.posts_title', { defaultValue: 'Bài đăng & Chia sẻ' })}</h2>
      <div className="space-y-6 pb-10">
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            isPlaying={playingId === post.id}
            onTogglePlay={() => togglePlay(post.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePosts;
