import React, { useState, useRef } from 'react';
import { MoreHorizontal, Send, Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const CommentItem = ({ comment }) => {
  const { t } = useLanguage();
  const [react, setReact] = useState(null);
  const [reactCount, setReactCount] = useState(comment.reacts || 0);
  const [showReacts, setShowReacts] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReactors, setShowReactors] = useState(false);
  const reactTimeout = useRef(null);

  const REACTS = [
    { key: 'like', emoji: '👍', label: t('react.like'), color: 'text-blue-500' },
    { key: 'heart', emoji: '❤️', label: t('react.heart'), color: 'text-rose-500' },
    { key: 'fire', emoji: '🔥', label: t('react.fire'), color: 'text-orange-500' },
  ];

  const currentReact = REACTS.find(r => r.key === react);

  const handleMouseEnterReact = () => { clearTimeout(reactTimeout.current); setShowReacts(true); };
  const handleMouseLeaveReact = () => { reactTimeout.current = setTimeout(() => setShowReacts(false), 300); };

  const allReactors = [
    ...(comment.reactors || []),
    ...(react ? [{ name: t('react.you'), react }] : []),
  ];
  const reactorsByType = REACTS.map(r => ({
    ...r,
    users: allReactors.filter(u => u.react === r.key).map(u => u.name),
  })).filter(r => r.users.length > 0);

  const topEmojis = [...new Set(allReactors.map(u => REACTS.find(r => r.key === u.react)?.emoji).filter(Boolean))].slice(0, 3);

  return (
    <div className="flex items-start gap-2.5 group/comment">
      <div className={`w-7 h-7 rounded-full flex-shrink-0 ${comment.user.avatar}`}></div>
      <div className="flex-1 min-w-0">

        {/* Bubble with react badge */}
        <div className="relative inline-block max-w-full">
          <div className="bg-gray-100 dark:bg-gray-800/70 rounded-xl px-3 py-2 pr-4">
            <span className="text-xs font-semibold mr-1.5">{comment.user.name}</span>
            <span className="text-xs leading-relaxed">{comment.text}</span>
          </div>

          {reactCount > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowReactors(s => !s)}
                className="absolute -bottom-3 right-1 flex items-center gap-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-1.5 py-0.5 shadow-sm hover:shadow-md transition-shadow text-[11px] leading-none"
              >
                <span>{topEmojis.join('')}</span>
                <span className="text-text-muted font-medium ml-0.5">{reactCount}</span>
              </button>

              {showReactors && (
                <div className="absolute bottom-4 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 min-w-[180px] p-3">
                  <p className="text-[11px] font-semibold text-text-muted mb-2">{t('react.reactions_title')}</p>
                  {reactorsByType.map(r => (
                    <div key={r.key} className="mb-2 last:mb-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">{r.emoji}</span>
                        <span className={`text-[11px] font-semibold ${r.color}`}>{r.label}</span>
                      </div>
                      {r.users.map(name => (
                        <p key={name} className="text-xs text-text-muted pl-5 leading-5">{name}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-3 ml-2 mt-4">
          <span className="text-[10px] text-text-muted">{comment.time}</span>

          {/* React button with hover popup */}
          <div className="relative" onMouseEnter={handleMouseEnterReact} onMouseLeave={handleMouseLeaveReact}>
            {showReacts && (
              <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-1 shadow-lg z-10">
                {REACTS.map(r => (
                  <button
                    key={r.key}
                    title={r.label}
                    onClick={() => {
                      const isRemoving = react === r.key;
                      const hadReact = !!react;
                      setReact(isRemoving ? null : r.key);
                      if (isRemoving) setReactCount(c => c - 1);
                      else if (!hadReact) setReactCount(c => c + 1);
                      setShowReacts(false);
                    }}
                    className={`text-base transition-transform hover:scale-125 ${react === r.key ? 'scale-125' : ''}`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (react) { setReact(null); setReactCount(c => c - 1); }
                else { setReact('like'); setReactCount(c => c + 1); }
              }}
              className={`text-[11px] font-semibold transition-colors ${
                currentReact ? currentReact.color : 'text-text-muted hover:text-blue-500'
              }`}
            >
              {currentReact ? `${currentReact.emoji} ${currentReact.label}` : t('comment.like')}
            </button>
          </div>

          {/* Reply button */}
          <button
            onClick={() => setReplying(r => !r)}
            className="text-[11px] font-semibold text-text-muted hover:text-primary-500 transition-colors"
          >
            {t('comment.reply')}
          </button>

          {/* Report menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(m => !m)}
              className="text-text-muted hover:text-text-color transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
            {showMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={() => { setReported(true); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Flag size={12} />
                  {reported ? t('comment.reported') : t('comment.report')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inline reply input */}
        {replying && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex-shrink-0"></div>
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800/70 rounded-full px-3 py-1 gap-2">
              <input
                autoFocus
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={t('comment.reply_placeholder').replace('{name}', comment.user.name)}
                className="flex-1 bg-transparent text-xs outline-none text-text-color placeholder:text-text-muted"
              />
              <button
                onClick={() => { setReplying(false); setReplyText(''); }}
                className={`text-primary-500 transition-opacity ${replyText ? 'opacity-100' : 'opacity-30'}`}
                disabled={!replyText}
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
