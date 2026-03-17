import React, { useState, useRef } from 'react';
import { MessageCircle, Share2, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const POST_REACTS_KEYS = [
  { key: 'like', emoji: '👍', labelKey: 'react.like', color: 'text-blue-500' },
  { key: 'heart', emoji: '❤️', labelKey: 'react.heart', color: 'text-rose-500' },
  { key: 'fire', emoji: '🔥', labelKey: 'react.fire', color: 'text-orange-500' },
];

const PostReactionsBar = ({ post }) => {
  const { t } = useLanguage();
  const POST_REACTS = POST_REACTS_KEYS.map(r => ({ ...r, label: t(r.labelKey) }));

  const [postReact, setPostReact] = useState(null);
  const [postReactCount, setPostReactCount] = useState(
    (post.reactions.flame || 0) + (post.reactions.sad || 0)
  );
  const [showPostReacts, setShowPostReacts] = useState(false);
  const postReactTimeout = useRef(null);
  const currentPostReact = POST_REACTS.find(r => r.key === postReact);

  const handlePostReactEnter = () => { clearTimeout(postReactTimeout.current); setShowPostReacts(true); };
  const handlePostReactLeave = () => { postReactTimeout.current = setTimeout(() => setShowPostReacts(false), 300); };

  return (
    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">

      {/* Row 1: React count summary */}
      {postReactCount > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base leading-none">
            {currentPostReact ? currentPostReact.emoji : '👍'}
          </span>
          <span className="text-xs text-text-muted">
            {postReact
              ? postReactCount > 1
                ? t('react.you_and_others').replace('{count}', postReactCount - 1)
                : t('react.you')
              : t('react.others').replace('{count}', postReactCount)}
          </span>
        </div>
      )}

      {/* Row 2: Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 -mx-1">

          {/* Thích — hover emoji picker */}
          <div className="relative" onMouseEnter={handlePostReactEnter} onMouseLeave={handlePostReactLeave}>
            {showPostReacts && (
              <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 shadow-xl z-10">
                {POST_REACTS.map(r => (
                  <button
                    key={r.key}
                    title={r.label}
                    onClick={() => {
                      const isRemoving = postReact === r.key;
                      const hadReact = !!postReact;
                      setPostReact(isRemoving ? null : r.key);
                      if (isRemoving) setPostReactCount(c => c - 1);
                      else if (!hadReact) setPostReactCount(c => c + 1);
                      setShowPostReacts(false);
                    }}
                    className={`text-xl transition-transform hover:scale-125 ${postReact === r.key ? 'scale-125' : ''}`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (postReact) { setPostReact(null); setPostReactCount(c => c - 1); }
                else { setPostReact('like'); setPostReactCount(c => c + 1); }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                currentPostReact ? currentPostReact.color : 'text-text-muted'
              }`}
            >
              <span className="text-base leading-none">
                {currentPostReact ? currentPostReact.emoji : '👍'}
              </span>
              {currentPostReact ? currentPostReact.label : t('react.like')}
            </button>
          </div>

          {/* Bình luận */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MessageCircle size={16} />
            {t('post.comment')}
            {post.reactions.comments > 0 && (
              <span className="text-xs opacity-70">· {post.reactions.comments}</span>
            )}
          </button>

          {/* Chia sẻ */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Share2 size={16} />
            {t('post.share')}
          </button>
        </div>

        <button className="text-text-muted hover:text-primary-500 p-1 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default PostReactionsBar;
