import React, { useEffect, useRef, useState } from 'react';
import { Send, Smile, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import CommentItem from './CommentItem';
import { getCurrentUser, resolveUrl } from '../../services/auth';

const PostComments = ({ comments = [], enabled = true, onSubmitComment, focusSignal = 0 }) => {
  const { t } = useLanguage();
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const inputRef = useRef(null);

  useEffect(() => {
    const handleUserUpdate = () => setCurrentUser(getCurrentUser());
    window.addEventListener('soundbook_user_updated', handleUserUpdate);
    return () => window.removeEventListener('soundbook_user_updated', handleUserUpdate);
  }, []);

  useEffect(() => {
    if (focusSignal) {
      inputRef.current?.focus();
    }
  }, [focusSignal]);

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  const submit = async () => {
    const text = commentInput.trim();
    if (!text || busy || !enabled) return;
    try {
      setBusy(true);
      setError('');
      await onSubmitComment?.(text);
      setCommentInput('');
      setShowAllComments(true);
    } catch (err) {
      setError(err?.message || 'Không thể gửi bình luận.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {comments.length > 2 && !showAllComments && (
        <button onClick={() => setShowAllComments(true)} className="text-xs font-medium text-text-muted hover:text-primary-500 transition-colors">
          {t('post.view_all_comments').replace('{count}', comments.length)}
        </button>
      )}

      {visibleComments.map(comment => <CommentItem key={comment.id} comment={comment} />)}

      {showAllComments && comments.length > 2 && (
        <button onClick={() => setShowAllComments(false)} className="text-xs font-medium text-text-muted hover:text-primary-500 transition-colors">
          {t('common.show_less')}
        </button>
      )}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={14} /> {error}
        </div>
      ) : null}

      {enabled ? (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden flex-shrink-0">
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
          <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800/70 rounded-full px-3 py-1.5 gap-2">
            <input
              ref={inputRef}
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') submit(); }}
              placeholder={t('post.comment') + '...'}
              className="flex-1 bg-transparent text-xs outline-none text-text-color placeholder:text-text-muted"
            />
            <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0">
              <Smile size={16} />
            </button>
            <button onClick={submit} className={`text-primary-500 transition-opacity ${commentInput.trim() ? 'opacity-100' : 'opacity-30'}`} disabled={!commentInput.trim() || busy}>
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-xs text-text-muted dark:bg-gray-800/70">
          <Lock size={14} /> Chủ bài viết đã đóng bình luận.
        </div>
      )}
    </div>
  );
};

export default PostComments;
