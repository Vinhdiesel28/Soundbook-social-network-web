import React, { useMemo, useState } from 'react';
import { Image, Book, Send, Music, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { postsApi } from '../../services/posts';

const POST_TYPES = [
  { value: 'BLOG', label: 'Bài viết' },
  { value: 'MUSIC_QUICK_NOTE', label: 'Âm nhạc' },
  { value: 'BOOK_REVIEW', label: 'Review sách' },
  { value: 'BOOK_READING_UPDATE', label: 'Đang đọc' },
];

const CreatePost = ({ onCreated }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    caption: '',
    type: 'BLOG',
    visibility: 'PUBLIC',
    moodTag: '',
    mediaUrl: '',
    mediaType: 'IMAGE',
    commentsEnabled: true,
  });

  const canSubmit = useMemo(() => form.caption.trim() || form.mediaUrl.trim(), [form.caption, form.mediaUrl]);

  const update = (patch) => {
    setError('');
    setForm(prev => ({ ...prev, ...patch }));
  };

  const reset = () => {
    setForm({ caption: '', type: 'BLOG', visibility: 'PUBLIC', moodTag: '', mediaUrl: '', mediaType: 'IMAGE', commentsEnabled: true });
    setExpanded(false);
    setError('');
  };

  const submit = async () => {
    if (!canSubmit || busy) return;
    try {
      setBusy(true);
      setError('');
      const createdPost = await postsApi.create({
        ...form,
        caption: form.caption.trim(),
        moodTag: form.moodTag.trim() || null,
        mediaUrl: form.mediaUrl.trim() || null,
      });
      reset();
      onCreated?.(createdPost);
    } catch (err) {
      setError(err?.message || 'Không thể đăng bài viết. Vui lòng kiểm tra dữ liệu và thử lại.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-surface-color rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
      <div className="flex gap-3 items-start">
        <div className="w-10 h-10 rounded-full bg-orange-500 flex-shrink-0" />
        <div className="flex-1">
          <textarea
            value={form.caption}
            onChange={(event) => update({ caption: event.target.value })}
            onFocus={() => setExpanded(true)}
            rows={expanded ? 4 : 1}
            placeholder={t('feed.whats_on_your_mind')}
            className="w-full resize-none bg-gray-100 dark:bg-gray-800/50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
          />
          {expanded ? (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select value={form.type} onChange={(event) => update({ type: event.target.value })} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900">
                {POST_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <select value={form.visibility} onChange={(event) => update({ visibility: event.target.value })} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900">
                <option value="PUBLIC">Công khai</option>
                <option value="FRIENDS">Bạn bè</option>
                <option value="PRIVATE">Riêng tư</option>
              </select>
              <input value={form.moodTag} onChange={(event) => update({ moodTag: event.target.value })} placeholder="Mood/tag, ví dụ: chill, trinh thám" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900" />
              <input value={form.mediaUrl} onChange={(event) => update({ mediaUrl: event.target.value })} placeholder="URL ảnh/cover nếu có" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-900" />
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                <input type="checkbox" checked={form.commentsEnabled} onChange={(event) => update({ commentsEnabled: event.target.checked })} />
                Cho phép bình luận
              </label>
            </div>
          ) : null}
          {error ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle size={14} /> {error}
            </div>
          ) : null}
        </div>
      </div>
      <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />
      <div className="flex justify-between items-center">
        <div className="flex gap-1 sm:gap-2">
          <button type="button" onClick={() => setExpanded(true)} className="flex items-center gap-2 px-3 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <Image size={18} className="text-green-500" />
            <span className="text-sm font-medium hidden sm:block">Ảnh/cover</span>
          </button>
          <button type="button" onClick={() => { setExpanded(true); update({ type: 'MUSIC_QUICK_NOTE' }); }} className="flex items-center gap-2 px-3 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <Music size={18} className="text-purple-500" />
            <span className="text-sm font-medium hidden sm:block">Nhạc</span>
          </button>
          <button type="button" onClick={() => { setExpanded(true); update({ type: 'BOOK_REVIEW' }); }} className="flex items-center gap-2 px-3 py-2 text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <Book size={18} className="text-orange-500" />
            <span className="text-sm font-medium hidden sm:block">Sách</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {expanded ? <button type="button" onClick={reset} className="rounded-lg px-3 py-2 text-sm font-semibold text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} /></button> : null}
          <button disabled={!canSubmit || busy} onClick={submit} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-primary-500/20">
            <Send size={16} />
            {busy ? 'Đang đăng...' : t('feed.post_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
