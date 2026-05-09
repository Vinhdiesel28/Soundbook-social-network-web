import React, { useEffect, useState } from 'react';
import { Lock, MoreHorizontal, Pencil, Sparkles, Trash2, MessageSquareOff, Send } from 'lucide-react';
import PostHeaderBar from './PostHeaderBar';
import PostMediaCard from './PostMediaCard';
import PostReactionsBar from './PostReactionsBar';
import PostComments from './PostComments';
import { postsApi } from '../../services/posts';
import ModalShell from '../common/ModalShell';
import ConfirmDialog from '../common/ConfirmDialog';
import { normalizeComment, normalizePost } from '../../utils/feedNormalizers';

const toApiType = (type) => {
  if (type === 'audio') return 'MUSIC_QUICK_NOTE';
  if (type === 'book_review') return 'BOOK_REVIEW';
  return 'BLOG';
};

const FeedPost = ({ post, isPlaying, onTogglePlay, onChanged, onDeleted, onShared }) => {
  const [livePost, setLivePost] = useState(post);
  const comments = livePost.comments || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [commentFocusTick, setCommentFocusTick] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareForm, setShareForm] = useState({
    caption: 'Mình muốn chia sẻ bài viết này với mọi người.',
    visibility: 'PUBLIC',
  });
  const [editForm, setEditForm] = useState({
    caption: post.content || '',
    visibility: post.original?.visibility || 'PUBLIC',
    moodTag: post.original?.moodTag || '',
    mediaUrl: post.media?.coverUrl || '',
    commentsEnabled: post.commentsEnabled !== false,
  });

  useEffect(() => {
    setLivePost(post);
    setEditForm({
      caption: post.content || '',
      visibility: post.original?.visibility || 'PUBLIC',
      moodTag: post.original?.moodTag || '',
      mediaUrl: post.media?.coverUrl || '',
      commentsEnabled: post.commentsEnabled !== false,
    });
  }, [post]);

  const setUpdatedPost = (rawPost) => {
    const normalized = normalizePost(rawPost);
    setLivePost(normalized);
    onChanged?.(normalized, { action: 'update' });
    return normalized;
  };

  const runAction = async (action, { keepMenu = false } = {}) => {
    if (busy) return null;
    try {
      setBusy(true);
      setActionError('');
      const result = await action();
      return result;
    } catch (err) {
      setActionError(err?.message || 'Thao tác không thành công. Vui lòng thử lại.');
      return null;
    } finally {
      setBusy(false);
      if (!keepMenu) setMenuOpen(false);
    }
  };

  const handleReact = async (reactionType) => {
    const result = await runAction(() => postsApi.react(livePost.id, reactionType));
    if (result) setUpdatedPost(result);
  };

  const handleComment = async (content) => {
    const result = await runAction(() => postsApi.comment(livePost.id, content), { keepMenu: true });
    if (!result) return;
    const newComment = normalizeComment(result);
    setLivePost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
      reactions: {
        ...(prev.reactions || {}),
        comments: (prev.reactions?.comments || 0) + 1,
      },
    }));
    onChanged?.(newComment, { action: 'comment', postId: livePost.id });
  };

  const submitShare = async () => {
    const caption = shareForm.caption.trim();
    const result = await runAction(() => postsApi.share(livePost.id, {
      caption: caption || 'Đã chia sẻ một bài viết trên Soundbook.',
      visibility: shareForm.visibility,
    }));
    if (!result) return;
    setLivePost(prev => ({
      ...prev,
      reactions: {
        ...(prev.reactions || {}),
        shares: (prev.reactions?.shares || 0) + 1,
      },
    }));
    onShared?.(result);
    setShareOpen(false);
    setShareForm({ caption: 'Mình muốn chia sẻ bài viết này với mọi người.', visibility: 'PUBLIC' });
  };

  const handleDelete = async () => {
    const result = await runAction(() => postsApi.remove(livePost.id));
    if (result !== null) {
      setDeleteOpen(false);
      onDeleted?.(livePost.id);
    }
  };

  const handleToggleComments = async () => {
    const result = await runAction(() => postsApi.toggleComments(livePost.id, !(livePost.commentsEnabled !== false)));
    if (result) setUpdatedPost(result);
  };

  const saveEdit = async () => {
    const result = await runAction(() => postsApi.update(livePost.id, {
      type: toApiType(livePost.type),
      caption: editForm.caption,
      visibility: editForm.visibility,
      moodTag: editForm.moodTag,
      mediaUrl: editForm.mediaUrl,
      mediaType: 'IMAGE',
      commentsEnabled: editForm.commentsEnabled,
    }));
    if (result) {
      setUpdatedPost(result);
      setEditing(false);
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between gap-2">
        <PostHeaderBar post={livePost} />
        {livePost.canEdit ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(prev => !prev)} className="rounded-full p-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreHorizontal size={18} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-10 z-20 w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                <button onClick={() => { setEditing(true); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"><Pencil size={15} /> Sửa bài viết</button>
                <button onClick={handleToggleComments} disabled={busy} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-60 dark:hover:bg-gray-800"><MessageSquareOff size={15} /> {livePost.commentsEnabled !== false ? 'Đóng bình luận' : 'Mở bình luận'}</button>
                <button onClick={() => { setDeleteOpen(true); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"><Trash2 size={15} /> Xóa bài viết</button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {livePost.reason ? (
        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">
          <Sparkles size={13} />
          <span className="truncate">{livePost.reason}</span>
        </div>
      ) : null}

      {actionError ? (
        <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-300">
          {actionError}
        </div>
      ) : null}

      {editing ? (
        <div className="mb-4 space-y-3 rounded-2xl border border-primary-500/20 bg-primary-500/5 p-3">
          <textarea value={editForm.caption} onChange={(event) => setEditForm(prev => ({ ...prev, caption: event.target.value }))} rows={4} className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select value={editForm.visibility} onChange={(event) => setEditForm(prev => ({ ...prev, visibility: event.target.value }))} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="PUBLIC">Công khai</option>
              <option value="FRIENDS">Bạn bè</option>
              <option value="PRIVATE">Riêng tư</option>
            </select>
            <input value={editForm.moodTag} onChange={(event) => setEditForm(prev => ({ ...prev, moodTag: event.target.value }))} placeholder="Mood/tag" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
            <input value={editForm.mediaUrl} onChange={(event) => setEditForm(prev => ({ ...prev, mediaUrl: event.target.value }))} placeholder="URL ảnh/cover" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editForm.commentsEnabled} onChange={(event) => setEditForm(prev => ({ ...prev, commentsEnabled: event.target.checked }))} /> Cho phép bình luận</label>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800">Hủy</button>
            <button onClick={saveEdit} disabled={busy} className="rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">Lưu</button>
          </div>
        </div>
      ) : (
        <p className="text-sm mb-4 leading-relaxed whitespace-pre-line">{livePost.content}</p>
      )}

      <PostMediaCard post={livePost} isPlaying={isPlaying} onTogglePlay={onTogglePlay} />

      {livePost.commentsEnabled === false ? <div className="mb-2 mt-3 flex items-center gap-2 text-xs text-text-muted"><Lock size={13} /> Bình luận đang đóng</div> : null}

      <PostReactionsBar post={livePost} onReact={handleReact} onFocusComment={() => setCommentFocusTick(tick => tick + 1)} onShare={() => setShareOpen(true)} />

      <PostComments comments={comments} enabled={livePost.commentsEnabled !== false} onSubmitComment={handleComment} focusSignal={commentFocusTick} />

      <ModalShell
        open={shareOpen}
        title="Chia sẻ bài viết"
        description="Viết vài dòng cảm nghĩ trước khi chia sẻ bài viết."
        onClose={() => setShareOpen(false)}
        footer={(
          <>
            <button type="button" onClick={() => setShareOpen(false)} disabled={busy} className="rounded-xl px-4 py-2 text-sm font-semibold text-text-muted hover:bg-gray-100 disabled:opacity-60 dark:hover:bg-gray-800">Hủy</button>
            <button type="button" onClick={submitShare} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60">
              <Send size={15} /> {busy ? 'Đang chia sẻ...' : 'Chia sẻ'}
            </button>
          </>
        )}
      >
        <div className="space-y-3">
          <textarea
            value={shareForm.caption}
            onChange={(event) => setShareForm(prev => ({ ...prev, caption: event.target.value }))}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900"
            placeholder="Bạn muốn nói gì về bài viết này?"
          />
          <select
            value={shareForm.visibility}
            onChange={(event) => setShareForm(prev => ({ ...prev, visibility: event.target.value }))}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="PUBLIC">Công khai</option>
            <option value="FRIENDS">Bạn bè</option>
            <option value="PRIVATE">Riêng tư</option>
          </select>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-text-muted dark:border-gray-700 dark:bg-gray-800/70">
            Chia sẻ từ: <span className="font-semibold text-text-color">{livePost.user?.name}</span> — {livePost.content?.slice(0, 120)}
          </div>
        </div>
      </ModalShell>

      <ConfirmDialog
        open={deleteOpen}
        danger
        title="Xóa bài viết"
        message="Bạn chắc chắn muốn xóa bài viết này? Thao tác này sẽ xóa bình luận, cảm xúc và media liên quan."
        confirmLabel="Xóa bài"
        busy={busy}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FeedPost;
