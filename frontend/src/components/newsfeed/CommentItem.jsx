import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Send, Flag, Heart, ThumbsUp, Flame, Laugh, Frown, Ghost, Angry } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ReportModal from '../common/ReportModal';
import ReactionModal from '../common/ReactionModal';
import { getCurrentUser, resolveUrl } from '../../services/auth';
import { postsApi } from '../../services/posts';

const CommentItem = ({ comment }) => {
  const { t } = useLanguage();
  const [react, setReact] = useState(comment.currentUserReaction?.toUpperCase() || null);
  const [reactCount, setReactCount] = useState(comment.reacts || 0);
  const [showReacts, setShowReacts] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showReactors, setShowReactors] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const reactTimeout = useRef(null);

  useEffect(() => {
    const handleUserUpdate = () => setCurrentUser(getCurrentUser());
    window.addEventListener('soundbook_user_updated', handleUserUpdate);
    return () => window.removeEventListener('soundbook_user_updated', handleUserUpdate);
  }, []);

  const REACTS = [
    { key: 'like', api: 'LIKE', icon: ThumbsUp, label: t('react.like'), color: 'text-blue-500', bg: 'bg-blue-500' },
    { key: 'heart', api: 'HEART', icon: Heart, label: t('react.heart'), color: 'text-rose-500', bg: 'bg-rose-500' },
    { key: 'fire', api: 'FIRE', icon: Flame, label: t('react.fire'), color: 'text-orange-500', bg: 'bg-orange-500' },
    { key: 'haha', api: 'HAHA', icon: Laugh, label: t('react.haha'), color: 'text-yellow-500', bg: 'bg-yellow-500', noFill: true },
    { key: 'wow', api: 'WOW', icon: Ghost, label: t('react.wow'), color: 'text-purple-500', bg: 'bg-purple-500', noFill: true },
    { key: 'sad', api: 'SAD', icon: Frown, label: t('react.sad'), color: 'text-indigo-400', bg: 'bg-indigo-400', noFill: true },
    { key: 'angry', api: 'ANGRY', icon: Angry, label: t('react.angry'), color: 'text-red-500', bg: 'bg-red-500', noFill: true },
  ];

  const currentReact = REACTS.find(r => r.api === react);

  const handleMouseEnterReact = () => {
    clearTimeout(reactTimeout.current);
    reactTimeout.current = setTimeout(() => setShowReacts(true), 500);
  };
  const handleMouseLeaveReact = () => {
    clearTimeout(reactTimeout.current);
    reactTimeout.current = setTimeout(() => setShowReacts(false), 300);
  };

  const handleReact = async (rawType) => {
    const type = rawType.toUpperCase();
    const isRemoving = react === type;
    setReact(isRemoving ? null : type);
    setReactCount(c => isRemoving ? c - 1 : (react ? c : c + 1));
    setShowReacts(false);
    try {
      await postsApi.reactComment(comment.id, type);
    } catch (err) {
      console.error('Failed to react to comment', err);
    }
  };

  const allReactors = [
    ...(comment.reactors || []),
    ...(react ? [{ name: t('react.you'), react }] : []),
  ];
  const reactorsByType = REACTS.map(r => ({
    ...r,
    users: allReactors.filter(u => u.react === r.api).map(u => u.name),
  })).filter(r => r.users.length > 0);

  const topReacts = REACTS.filter(r => allReactors.some(u => u.react === r.api)).slice(0, 3);

  return (
    <div className="flex items-start gap-2.5 group/comment">
      {comment.user.avatarUrl ? (
        <img src={resolveUrl(comment.user.avatarUrl)} alt={comment.user.name} className="h-7 w-7 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className={`w-7 h-7 rounded-full flex-shrink-0 ${comment.user.avatar} flex items-center justify-center text-[10px] font-bold text-white`}>{(comment.user.name || 'U').charAt(0).toUpperCase()}</div>
      )}
      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-2">
          <div className="relative inline-block max-w-full">
            <div className="bg-gray-100 dark:bg-gray-800/70 rounded-2xl px-3 py-2 flex flex-col">
              <span className="text-[13px] font-semibold">{comment.user.name}</span>
              <span className="text-[13px] leading-snug">{comment.text}</span>
            </div>
          </div>

          {/* Report */}
          <div className={`relative shrink-0 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover/comment:opacity-100'}`}>
            <button
              onClick={() => setShowMenu(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {showMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-[140px]">
                <button
                  onClick={() => { setShowMenu(false); setIsReportModalOpen(true); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Flag size={12} />
                  {t('comment.report')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-3 ml-2 mt-1">
          <span className="text-[10px] text-text-muted">{comment.time}</span>

          <div className="relative" onMouseEnter={handleMouseEnterReact} onMouseLeave={handleMouseLeaveReact}>
            {showReacts && (
              <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 shadow-xl z-10 animate-react-popup">
                {REACTS.map(r => (
                  <button
                    key={r.key}
                    title={r.label}
                    onClick={() => handleReact(r.api)}
                    className={`transition-transform hover:scale-125 ${r.color}`}
                  >
                    <r.icon size={20} fill={react === r.key && !r.noFill ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (react) handleReact(react.toUpperCase()); // Toggle off (ensure uppercase for API)
                else handleReact('LIKE'); // Default like
              }}
              className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${currentReact ? currentReact.color : 'text-text-muted hover:text-blue-500'
                }`}
            >
              {currentReact ? <currentReact.icon size={12} fill={currentReact.noFill ? "none" : "currentColor"} /> : <ThumbsUp size={12} />}
              {currentReact ? currentReact.label : t('react.like')}
            </button>
          </div>

          {/* Reply */}
          <button
            onClick={() => setReplying(r => !r)}
            className="text-[11px] font-semibold text-text-muted hover:text-primary-500 transition-colors"
          >
            {t('comment.reply')}
          </button>

          {reactCount > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowReactors(s => !s)}
                className="flex items-center px-0.5 shadow-none hover:opacity-80 transition-opacity text-[11px] leading-none"
              >
                <span className="text-text-muted font-medium mr-1.5">{reactCount}</span>
                <div className="flex -space-x-1">
                  {topReacts.map((r, i) => (
                    <div key={i} style={{ zIndex: 3 - i }} className={`p-0.5 bg-white dark:bg-gray-800 rounded-full ring-[1.5px] ring-white dark:ring-gray-800`}>
                      <r.icon
                        size={14}
                        fill={r.noFill ? "none" : "currentColor"}
                        className={r.color}
                      />
                    </div>
                  ))}
                </div>
              </button>

              {showReactors && (
                <ReactionModal
                  isOpen={showReactors}
                  onClose={() => setShowReactors(false)}
                  targetId={comment.id}
                  targetType="COMMENT"
                  title="Người đã bày tỏ cảm xúc về bình luận"
                />
              )}
            </div>
          )}
        </div>

        {/* Reply input */}
        {replying && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-[8px] overflow-hidden flex-shrink-0">
              {currentUser?.avatarUrl ? (
                <img 
                  src={`${resolveUrl(currentUser.avatarUrl)}${String(currentUser.avatarUrl).includes('?') ? '&' : '?'}t=${currentUser.updatedAt || 'initial'}`} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{(currentUser?.displayName || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
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

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        type="COMMENT"
        targetId={comment?.id}
      />
    </div>
  );
};

export default CommentItem;
