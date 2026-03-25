import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import CommentItem from './CommentItem';

const PostComments = ({ comments }) => {
  const { t } = useLanguage();
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const visibleComments = showAllComments ? comments : comments.slice(0, 2);

  if (comments.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">

      {comments.length > 2 && !showAllComments && (
        <button
          onClick={() => setShowAllComments(true)}
          className="text-xs font-medium text-text-muted hover:text-primary-500 transition-colors"
        >
          {t('post.view_all_comments').replace('{count}', comments.length)}
        </button>
      )}

      {/* Comment */}
      {visibleComments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {showAllComments && comments.length > 2 && (
        <button
          onClick={() => setShowAllComments(false)}
          className="text-xs font-medium text-text-muted hover:text-primary-500 transition-colors"
        >
          {t('common.show_less')}
        </button>
      )}

      {/* Comment Input */}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-7 h-7 rounded-full bg-primary-500 flex-shrink-0"></div>
        <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-800/70 rounded-full px-3 py-1.5 gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder={t('post.comment') + '...'}
            className="flex-1 bg-transparent text-xs outline-none text-text-color placeholder:text-text-muted"
          />
          <button type="button" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0">
            <Smile size={16} />
          </button>
          <button
            className={`text-primary-500 transition-opacity ${commentInput ? 'opacity-100' : 'opacity-30'}`}
            disabled={!commentInput}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComments;
