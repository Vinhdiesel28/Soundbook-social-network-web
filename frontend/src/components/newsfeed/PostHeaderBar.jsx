import React, { useState } from 'react';
import { MoreHorizontal, Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PostHeaderBar = ({ post }) => {
  const { t } = useLanguage();
  const [followed, setFollowed] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${post.user.avatar}`}></div>
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-semibold text-sm">{post.user.name}</h4>
            <button
              onClick={() => setFollowed(f => !f)}
              className={`text-xs font-semibold transition-colors ${
                followed ? 'text-text-muted hover:text-rose-500' : 'text-primary-500 hover:text-primary-600'
              }`}
            >
              · {followed ? t('post.unfollow') : t('post.follow')}
            </button>
          </div>
          <span className="text-xs text-text-muted">{post.user.time}</span>
        </div>
      </div>

      {/* ... menu */}
      <div className="relative">
        <button
          onClick={() => setShowPostMenu(m => !m)}
          className="text-text-muted hover:text-text-color p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
        {showPostMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 min-w-[180px] py-1">
            <button
              onClick={() => { setReported(true); setShowPostMenu(false); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-rose-500"
            >
              <Flag size={16} />
              {reported ? t('post.reported') : t('post.report')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHeaderBar;
