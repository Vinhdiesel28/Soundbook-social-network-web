import React, { useState, useRef } from 'react';
import { MessageCircle, Share2, Heart, ThumbsUp, Flame, Smile, Frown, Angry } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const POST_REACTS_KEYS = [
  { key: 'like', icon: ThumbsUp, labelKey: 'react.like', color: 'text-blue-500' },
  { key: 'heart', icon: Heart, labelKey: 'react.heart', color: 'text-rose-500' },
  { key: 'fire', icon: Flame, labelKey: 'react.fire', color: 'text-orange-500' },
  { key: 'smile', icon: Smile, labelKey: 'react.smile', color: 'text-yellow-500', noFill: true },
  { key: 'sad', icon: Frown, labelKey: 'react.sad', color: 'text-indigo-400', noFill: true },
  { key: 'angry', icon: Angry, labelKey: 'react.angry', color: 'text-red-500', noFill: true },
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

  const handlePostReactEnter = () => {
    clearTimeout(postReactTimeout.current);
    postReactTimeout.current = setTimeout(() => setShowPostReacts(true), 500);
  };
  const handlePostReactLeave = () => {
    clearTimeout(postReactTimeout.current);
    postReactTimeout.current = setTimeout(() => setShowPostReacts(false), 300);
  };

  return (
    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">

      {/* React count */}
      {postReactCount > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="flex items-center justify-center leading-none">
            {currentPostReact ? <currentPostReact.icon size={14} fill={currentPostReact.noFill ? "none" : "currentColor"} className={currentPostReact.color} /> : <Heart size={14} fill="currentColor" className="text-rose-500" />}
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

      {/* Reactions */}
      <div className="flex items-center">
        <div className="flex items-center gap-8 -mx-1">

          <div className="relative" onMouseEnter={handlePostReactEnter} onMouseLeave={handlePostReactLeave}>
            {showPostReacts && (
              <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 shadow-xl z-10 animate-react-popup">
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
                    className={`transition-transform hover:scale-125 ${r.color}`}
                  >
                    <r.icon size={20} fill={postReact === r.key && !r.noFill ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (postReact) { setPostReact(null); setPostReactCount(c => c - 1); }
                else { setPostReact('like'); setPostReactCount(c => c + 1); }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${currentPostReact ? currentPostReact.color : 'text-text-muted'
                }`}
            >
              <span className="flex items-center justify-center leading-none">
                {currentPostReact ? <currentPostReact.icon size={18} fill={currentPostReact.noFill ? "none" : "currentColor"} /> : <ThumbsUp size={18} />}
              </span>
              {currentPostReact ? currentPostReact.labelKey ? t(currentPostReact.labelKey) : currentPostReact.label : t('react.like')}
            </button>
          </div>

          {/* Comment */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MessageCircle size={16} />
            {t('post.comment')}
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Share2 size={16} />
            {t('post.share')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReactionsBar;
