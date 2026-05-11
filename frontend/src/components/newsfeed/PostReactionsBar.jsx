import React, { useState, useRef } from 'react';
import { MessageCircle, Share2, Heart, ThumbsUp, Flame, Laugh, Frown, Ghost, Angry } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const REACTS = [
  { key: 'like', api: 'LIKE', icon: ThumbsUp, label: 'Thích', color: 'text-blue-500', bg: 'hover:bg-blue-50 dark:hover:bg-blue-950/40' },
  { key: 'heart', api: 'HEART', icon: Heart, label: 'Yêu thích', color: 'text-rose-500', bg: 'hover:bg-rose-50 dark:hover:bg-rose-950/40' },
  { key: 'fire', api: 'FIRE', icon: Flame, label: 'Nhiệt', color: 'text-orange-500', bg: 'hover:bg-orange-50 dark:hover:bg-orange-950/40' },
  { key: 'haha', api: 'HAHA', icon: Laugh, label: 'Haha', color: 'text-yellow-500', bg: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/40' },
  { key: 'wow', api: 'WOW', icon: Ghost, label: 'Wow', color: 'text-purple-500', bg: 'hover:bg-purple-50 dark:hover:bg-purple-950/40' },
  { key: 'sad', api: 'SAD', icon: Frown, label: 'Buồn', color: 'text-sky-500', bg: 'hover:bg-sky-50 dark:hover:bg-sky-950/40' },
  { key: 'angry', api: 'ANGRY', icon: Angry, label: 'Phẫn nộ', color: 'text-red-500', bg: 'hover:bg-red-50 dark:hover:bg-red-950/40' },
];

const PostReactionsBar = ({ post, onReact, onFocusComment, onShare, onViewReactions }) => {
  const { t } = useLanguage();
  const [pickerOpen, setPickerOpen] = useState(false);
  const timeoutRef = useRef(null);

  const total = REACTS.reduce((sum, item) => sum + (post.reactions?.[item.key] || 0), 0);
  const activeKey = post.currentUserReaction?.toLowerCase();
  const active = REACTS.find(item => item.api === post.currentUserReaction?.toUpperCase());
  const MainIcon = active?.icon || ThumbsUp;
  const mainLabel = active?.label || 'Thích';

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPickerOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setPickerOpen(false);
    }, 500);
  };

  const pickReaction = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPickerOpen(false);
    onReact?.(item.api);
  };

  return (
    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
        <button
          onClick={onViewReactions}
          className="flex items-center gap-1.5 hover:underline decoration-dotted"
        >
          <div className="flex items-center gap-1.5">
            {REACTS.filter(item => post.reactions?.[item.key]).slice(0, 4).map(item => {
              const Icon = item.icon;
              return (
                <span key={item.key} className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700 ${item.color}`}>
                  <Icon size={12} fill={(item.key === 'like' || item.key === 'heart' || item.key === 'fire') ? 'currentColor' : 'none'} />
                </span>
              );
            })}
            <span>{total ? `${total} cảm xúc` : 'Hãy là người đầu tiên bày tỏ cảm xúc'}</span>
          </div>
        </button>
        <span>{post.reactions?.comments || 0} bình luận · {post.reactions?.shares || 0} chia sẻ</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) handleMouseLeave();
          }}
        >
          {pickerOpen ? (
            <div className="absolute bottom-full left-0 z-30 mb-2 flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              {REACTS.map(item => {
                const Icon = item.icon;
                const selected = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={(e) => pickReaction(e, item)}
                    title={item.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all hover:-translate-y-1 hover:scale-110 ${item.color} ${item.bg} ${selected ? 'bg-gray-100 ring-2 ring-primary-500 dark:bg-gray-800' : ''}`}
                  >
                    <Icon size={22} fill={(selected && (item.key === 'like' || item.key === 'heart' || item.key === 'fire')) ? 'currentColor' : 'none'} />
                  </button>
                );
              })}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => onReact?.(active?.api || 'LIKE')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${active ? active.color : 'text-text-muted'} hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <MainIcon size={16} fill={(active && (active.key === 'like' || active.key === 'heart' || active.key === 'fire')) ? 'currentColor' : 'none'} />
            <span>{mainLabel}</span>
          </button>
        </div>

        <button onClick={onFocusComment} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MessageCircle size={16} />
          {t('post.comment')}
        </button>

        <button onClick={onShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Share2 size={16} />
          {t('post.share')}
        </button>

        {active ? (
          <span className={`ml-auto hidden text-xs font-semibold sm:inline-flex ${active.color}`}>
            <MainIcon size={14} className="mr-1" fill={(active.key === 'like' || active.key === 'heart' || active.key === 'fire') ? 'currentColor' : 'none'} /> Bạn đã {mainLabel.toLowerCase()}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PostReactionsBar;
