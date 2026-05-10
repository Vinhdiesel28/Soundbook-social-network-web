import React, { useMemo, useState } from 'react';
import { BookOpen, Check, Music2, Save, SlidersHorizontal, X } from 'lucide-react';

const MUSIC_GENRES = ['Pop', 'Ballad', 'Indie', 'Lo-fi', 'R&B', 'Rap', 'Rock', 'EDM', 'Acoustic', 'K-Pop', 'V-Pop', 'Jazz', 'Classical', 'Metal'];
const MUSIC_MOODS = ['Chill', 'Buồn', 'Lãng mạn', 'Năng lượng cao', 'Hoài niệm', 'Tập trung', 'Vui vẻ', 'Sâu lắng'];
const BOOK_GENRES = ['Trinh thám', 'Lãng mạn', 'Fantasy', 'Tâm lý', 'Kinh dị', 'Manga', 'Light novel', 'Self-help', 'Khoa học viễn tưởng', 'Đời thường', 'Phiêu lưu', 'Tiểu thuyết'];
const BOOK_THEMES = ['Tình bạn', 'Gia đình', 'Tội phạm', 'Học đường', 'Chữa lành', 'Sinh tồn', 'Trưởng thành', 'Ma thuật', 'Hài hước', 'U tối'];

const emptyTaste = {
  musicGenres: [],
  musicMoods: [],
  musicArtists: [],
  musicSongs: [],
  musicDislikedGenres: [],
  bookGenres: [],
  bookThemes: [],
  bookAuthors: [],
  favoriteBooks: [],
  bookDislikedGenres: [],
  weightMusic: 0.5,
  weightBook: 0.5,
};

const toArray = (value) => Array.isArray(value) ? value.filter(Boolean) : [];
const splitFreeText = (value) => String(value || '').split(',').map(item => item.trim()).filter(Boolean);
const joinFreeText = (value) => toArray(value).join(', ');

const mergeTaste = (initialTaste) => ({
  ...emptyTaste,
  ...initialTaste,
  musicGenres: toArray(initialTaste?.musicGenres),
  musicMoods: toArray(initialTaste?.musicMoods),
  musicArtists: toArray(initialTaste?.musicArtists),
  musicSongs: toArray(initialTaste?.musicSongs),
  musicDislikedGenres: toArray(initialTaste?.musicDislikedGenres),
  bookGenres: toArray(initialTaste?.bookGenres),
  bookThemes: toArray(initialTaste?.bookThemes),
  bookAuthors: toArray(initialTaste?.bookAuthors),
  favoriteBooks: toArray(initialTaste?.favoriteBooks),
  bookDislikedGenres: toArray(initialTaste?.bookDislikedGenres),
  weightMusic: Number(initialTaste?.weightMusic ?? 0.5),
  weightBook: Number(initialTaste?.weightBook ?? 0.5),
});

const OptionButton = ({ label, selected, negative = false, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
      selected
        ? negative
          ? 'border-red-400 bg-red-50 text-red-600 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300'
          : 'border-primary-500 bg-primary-500/10 text-primary-500'
        : 'border-gray-200 bg-white text-text-color hover:border-primary-400 dark:border-gray-700 dark:bg-gray-900/40'
    }`}
  >
    {selected ? <Check size={15} /> : null}
    {label}
  </button>
);

const Section = ({ icon, title, desc, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-surface-color p-5 shadow-sm dark:border-gray-800">
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-xl bg-primary-500/10 p-2 text-primary-500">{icon}</div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        {desc ? <p className="text-sm text-text-muted mt-1">{desc}</p> : null}
      </div>
    </div>
    {children}
  </section>
);

const TasteEditor = ({ initialTaste, onSubmit, submitLabel = 'Lưu Taste DNA', loading = false, compact = false }) => {
  const [form, setForm] = useState(() => mergeTaste(initialTaste));
  const [artistText, setArtistText] = useState(() => joinFreeText(initialTaste?.musicArtists));
  const [songText, setSongText] = useState(() => joinFreeText(initialTaste?.musicSongs));
  const [authorText, setAuthorText] = useState(() => joinFreeText(initialTaste?.bookAuthors));
  const [bookText, setBookText] = useState(() => joinFreeText(initialTaste?.favoriteBooks));
  const [error, setError] = useState('');

  const progress = useMemo(() => {
    const musicDone = Math.min(100, (form.musicGenres.length / 3) * 100);
    const bookDone = Math.min(100, (form.bookGenres.length / 3) * 100);
    return Math.round((musicDone + bookDone) / 2);
  }, [form.musicGenres.length, form.bookGenres.length]);

  const toggle = (field, value) => {
    setForm(prev => {
      const current = toArray(prev[field]);
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter(item => item !== value) : [...current, value],
      };
    });
  };

  const setPriority = (mode) => {
    if (mode === 'music') setForm(prev => ({ ...prev, weightMusic: 0.7, weightBook: 0.3 }));
    else if (mode === 'book') setForm(prev => ({ ...prev, weightMusic: 0.3, weightBook: 0.7 }));
    else setForm(prev => ({ ...prev, weightMusic: 0.5, weightBook: 0.5 }));
  };

  const currentPriority = form.weightMusic > form.weightBook ? 'music' : form.weightBook > form.weightMusic ? 'book' : 'balanced';

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      ...form,
      musicArtists: splitFreeText(artistText),
      musicSongs: splitFreeText(songText),
      bookAuthors: splitFreeText(authorText),
      favoriteBooks: splitFreeText(bookText),
    };

    if (payload.musicGenres.length < 3) {
      setError('Bạn cần chọn tối thiểu 3 thể loại nhạc.');
      return;
    }
    if (payload.bookGenres.length < 3) {
      setError('Bạn cần chọn tối thiểu 3 thể loại sách/truyện.');
      return;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${compact ? '' : 'max-w-5xl mx-auto'}`}>
      <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-500">Taste DNA setup</p>
            <h2 className="text-2xl font-black mt-1">Khai báo gu âm nhạc và sách/truyện</h2>
            <p className="text-sm text-text-muted mt-1">Dữ liệu này dùng để tính % Match, gợi ý kết nối và khởi tạo Discover.</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-2xl font-black text-primary-500">{progress}%</div>
            <div className="text-xs text-text-muted">đủ dữ liệu tối thiểu</div>
          </div>
        </div>
      </div>

      <Section icon={<Music2 size={22} />} title="1. Music DNA" desc="Chọn tối thiểu 3 thể loại nhạc. Mood, nghệ sĩ và bài hát giúp hệ thống hiểu gu sâu hơn.">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Thể loại nhạc yêu thích</p>
              <span className={`text-xs ${form.musicGenres.length >= 3 ? 'text-green-500' : 'text-red-500'}`}>{form.musicGenres.length}/3 bắt buộc</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map(item => <OptionButton key={item} label={item} selected={form.musicGenres.includes(item)} onClick={() => toggle('musicGenres', item)} />)}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Mood nhạc</p>
            <div className="flex flex-wrap gap-2">
              {MUSIC_MOODS.map(item => <OptionButton key={item} label={item} selected={form.musicMoods.includes(item)} onClick={() => toggle('musicMoods', item)} />)}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-semibold">Nghệ sĩ yêu thích</span>
              <input value={artistText} onChange={(e) => setArtistText(e.target.value)} placeholder="Ví dụ: Đen Vâu, Taylor Swift" className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-gray-700" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold">Bài hát yêu thích</span>
              <input value={songText} onChange={(e) => setSongText(e.target.value)} placeholder="Ví dụ: Một triệu like, August" className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-gray-700" />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-2"><X size={15} /> Thể loại nhạc không thích</p>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map(item => <OptionButton key={item} label={item} negative selected={form.musicDislikedGenres.includes(item)} onClick={() => toggle('musicDislikedGenres', item)} />)}
            </div>
          </div>
        </div>
      </Section>

      <Section icon={<BookOpen size={22} />} title="2. Book DNA" desc="Chọn tối thiểu 3 thể loại sách/truyện. Chủ đề, tác giả và sách yêu thích giúp Match Score chính xác hơn.">
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Thể loại sách/truyện yêu thích</p>
              <span className={`text-xs ${form.bookGenres.length >= 3 ? 'text-green-500' : 'text-red-500'}`}>{form.bookGenres.length}/3 bắt buộc</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BOOK_GENRES.map(item => <OptionButton key={item} label={item} selected={form.bookGenres.includes(item)} onClick={() => toggle('bookGenres', item)} />)}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Chủ đề/mood nội dung</p>
            <div className="flex flex-wrap gap-2">
              {BOOK_THEMES.map(item => <OptionButton key={item} label={item} selected={form.bookThemes.includes(item)} onClick={() => toggle('bookThemes', item)} />)}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-semibold">Tác giả yêu thích</span>
              <input value={authorText} onChange={(e) => setAuthorText(e.target.value)} placeholder="Ví dụ: Higashino Keigo, Nguyễn Nhật Ánh" className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-gray-700" />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold">Sách/truyện yêu thích</span>
              <input value={bookText} onChange={(e) => setBookText(e.target.value)} placeholder="Ví dụ: Conan, Harry Potter" className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary-500 dark:border-gray-700" />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2 flex items-center gap-2"><X size={15} /> Thể loại sách/truyện không thích</p>
            <div className="flex flex-wrap gap-2">
              {BOOK_GENRES.map(item => <OptionButton key={item} label={item} negative selected={form.bookDislikedGenres.includes(item)} onClick={() => toggle('bookDislikedGenres', item)} />)}
            </div>
          </div>
        </div>
      </Section>

      <Section icon={<SlidersHorizontal size={22} />} title="3. Ưu tiên tính Match" desc="Chọn cách hệ thống cân bằng âm nhạc và sách/truyện khi tìm người cùng gu.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { id: 'balanced', label: 'Cân bằng', desc: 'Nhạc 50% · Sách 50%' },
            { id: 'music', label: 'Ưu tiên nhạc', desc: 'Nhạc 70% · Sách 30%' },
            { id: 'book', label: 'Ưu tiên sách', desc: 'Nhạc 30% · Sách 70%' },
          ].map(item => (
            <button key={item.id} type="button" onClick={() => setPriority(item.id)} className={`rounded-2xl border p-4 text-left transition-all ${currentPriority === item.id ? 'border-primary-500 bg-primary-500/10' : 'border-gray-200 hover:border-primary-400 dark:border-gray-700'}`}>
              <p className="font-bold">{item.label}</p>
              <p className="text-xs text-text-muted mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </Section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-bold text-white shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-600 disabled:opacity-60">
          <Save size={18} />
          {loading ? 'Đang lưu...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TasteEditor;
