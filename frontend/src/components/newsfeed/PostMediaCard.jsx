import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PostMediaCard = ({ post, isPlaying, onTogglePlay }) => {
  const { t } = useLanguage();

  if (post.type === 'audio') {
    return (
      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4">
        <div className={`w-16 h-16 rounded-lg flex-shrink-0 ${post.media.cover} shadow-md`}></div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-sm truncate">{post.media.title}</h5>
          <p className="text-xs text-text-muted truncate">{post.media.artist}</p>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary-500 w-1/3"></div>
          </div>
        </div>
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-1" fill="currentColor" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
      <div className={`w-20 h-28 rounded-md flex-shrink-0 ${post.media.cover} shadow-md`}></div>
      <div className="flex-1 flex flex-col justify-center gap-1">
        <h5 className="font-bold text-base leading-tight">{post.media.title}</h5>
        <p className="text-sm text-text-muted">{post.media.author}</p>
        {post.media.rating && (
          <div className="flex items-center text-yellow-400 text-sm mt-1">
            {'★'.repeat(post.media.rating)}
            <span className="text-xs text-text-muted ml-1.5">{post.media.rating}/5</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostMediaCard;
