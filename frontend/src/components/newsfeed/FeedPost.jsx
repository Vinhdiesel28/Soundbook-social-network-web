import React from 'react';
import PostHeaderBar from './PostHeaderBar';
import PostMediaCard from './PostMediaCard';
import PostReactionsBar from './PostReactionsBar';
import PostComments from './PostComments';

const FeedPost = ({ post, isPlaying, onTogglePlay }) => {
  const comments = post.comments || [];

  return (
    <div className="bg-surface-color rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-800">
      <PostHeaderBar post={post} />

      {/*Content */}
      <p className="text-sm mb-4 leading-relaxed">{post.content}</p>

      <PostMediaCard post={post} isPlaying={isPlaying} onTogglePlay={onTogglePlay} />

      <PostReactionsBar post={post} />

      <PostComments comments={comments} />
    </div>
  );
};

export default FeedPost;
