import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { resolveUrl } from '../../services/auth';

const PostHeaderBar = ({ post }) => {
  const { t } = useLanguage();
  const [followed, setFollowed] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {post.user.avatarUrl ? (
        <img src={resolveUrl(post.user.avatarUrl)} alt={post.user.name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div className={`w-10 h-10 rounded-full ${post.user.avatar} flex items-center justify-center text-xs font-bold text-white`}>{(post.user.name || 'U').charAt(0).toUpperCase()}</div>
      )}
      <div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to={`/profile/${post.user.id}`} className="font-semibold text-sm hover:underline">{post.user.name}</Link>
          <button
            onClick={() => setFollowed(f => !f)}
            className={`text-xs font-semibold transition-colors ${followed ? 'text-text-muted hover:text-rose-500' : 'text-primary-500 hover:text-primary-600'
              }`}
          >
            · {followed ? t('post.unfollow') : t('post.follow')}
          </button>
        </div>
        <span className="text-xs text-text-muted">{post.user.time}</span>
      </div>
    </div>
  );
};

export default PostHeaderBar;


