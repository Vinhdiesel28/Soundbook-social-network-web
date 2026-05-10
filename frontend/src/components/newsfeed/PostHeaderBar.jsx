import React, { useState } from 'react';
import { MoreHorizontal, Flag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import ReportModal from '../common/ReportModal';

const PostHeaderBar = ({ post }) => {
  const { t } = useLanguage();
  const [followed, setFollowed] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [reported, setReported] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleReportSubmit = ({ reason, description }) => {
    console.log('Submit report:', { target_type: 'POST', target_id: post?.id, reason, description });
    setReported(true);
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        {post.user.avatarUrl ? (
          <img src={post.user.avatarUrl} alt={post.user.name} className="h-10 w-10 rounded-full object-cover" />
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

      <div className="flex items-center gap-1">
        {/* AI Summary button */}
        {post?.media && (
          <button
            title={t('ai.summary_title')}
            className="text-text-muted hover:text-violet-500 p-1 rounded-full hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors"
          >
            <Sparkles size={18} />
          </button>
        )}

        {/* Three-dot menu */}
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
                onClick={() => { setShowPostMenu(false); setIsReportModalOpen(true); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-rose-500"
              >
                <Flag size={16} />
                {reported ? t('post.reported') : t('post.report')}
              </button>
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        type="POST"
        targetId={post?.id}
      />

    </div>
  );
};

export default PostHeaderBar;


