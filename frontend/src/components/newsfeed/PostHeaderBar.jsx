import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getCurrentUser, resolveUrl } from '../../services/auth';
import { profileApi } from '../../services/profile';

const PostHeaderBar = ({ post }) => {
  const { t } = useLanguage();
  const currentUser = getCurrentUser();
  const authorId = post?.user?.id;
  const isSelf = Boolean(post?.user?.self || (currentUser?.id && String(currentUser.id) === String(authorId)));
  const [followed, setFollowed] = useState(Boolean(post?.user?.following));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFollowed(Boolean(post?.user?.following));
  }, [post?.user?.following, authorId]);

  const handleToggleFollow = async () => {
    if (!authorId || isSelf || busy) return;
    const previous = followed;
    const next = !previous;
    setFollowed(next);
    setBusy(true);
    setError('');
    try {
      const profile = next
        ? await profileApi.followProfile(authorId)
        : await profileApi.unfollowProfile(authorId);
      setFollowed(Boolean(profile?.following));
    } catch (err) {
      setFollowed(previous);
      setError(err?.message || 'Không thể cập nhật theo dõi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Link to={`/profile/${post.user.id}`} className="transition-transform active:scale-95">
        {post.user.avatarUrl ? (
          <img src={resolveUrl(post.user.avatarUrl)} alt={post.user.name} className="h-10 w-10 rounded-full object-cover shadow-sm" />
        ) : (
          <div className={`w-10 h-10 rounded-full ${post.user.avatar} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>{(post.user.name || 'U').charAt(0).toUpperCase()}</div>
        )}
      </Link>
      <div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link to={`/profile/${authorId}`} className="font-semibold text-sm hover:underline">{post.user.name}</Link>
          {!isSelf ? (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={busy}
              className={`text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${followed ? 'text-text-muted hover:text-rose-500' : 'text-primary-500 hover:text-primary-600'
                }`}
              title={error || (followed ? 'Bỏ theo dõi người dùng này' : 'Theo dõi người dùng này')}
            >
              · {busy ? 'Đang lưu...' : followed ? t('post.unfollow') : t('post.follow')}
            </button>
          ) : null}
        </div>
        <span className="text-xs text-text-muted">{post.user.time}</span>
        {error ? <p className="mt-0.5 text-[11px] text-red-500">{error}</p> : null}
      </div>
    </div>
  );
};

export default PostHeaderBar;
