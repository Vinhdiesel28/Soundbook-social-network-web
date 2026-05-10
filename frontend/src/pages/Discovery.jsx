import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Compass, Music2, Sparkles, Users } from 'lucide-react';
import { tasteApi } from '../services/taste';

const MatchCard = ({ match }) => (
  <Link to={`/profile/${match.userId}`} className="block rounded-2xl border border-gray-200 bg-surface-color p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-purple-500 text-lg font-black text-white">
          {(match.displayName || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold">{match.displayName || 'Soundbook user'}</h3>
          <p className="text-xs text-text-muted">@{match.username || `user_${match.userId}`}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-primary-500">{Math.round(match.finalMatch || 0)}%</div>
        <div className="text-xs text-text-muted">Match</div>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
        Music: <strong>{Math.round(match.musicSimilarity || 0)}%</strong>
      </div>
      <div className="rounded-xl bg-orange-50 p-3 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300">
        Book: <strong>{Math.round(match.bookSimilarity || 0)}%</strong>
      </div>
    </div>

    {match.sharedFeatures?.length ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {match.sharedFeatures.slice(0, 5).map(feature => (
          <span key={feature} className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-500">{feature}</span>
        ))}
      </div>
    ) : null}
  </Link>
);

const DiscoverItem = ({ item }) => (
  <div className="rounded-2xl border border-gray-200 bg-surface-color p-5 shadow-sm dark:border-gray-800">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className={`rounded-xl p-2 ${item.type === 'MUSIC' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
        {item.type === 'MUSIC' ? <Music2 size={20} /> : <BookOpen size={20} />}
      </div>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-text-muted dark:bg-gray-800">{Math.round(item.score || 0)} điểm</span>
    </div>
    <h3 className="font-bold">{item.title}</h3>
    <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
    <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-text-muted dark:bg-gray-800/60">{item.reason}</p>
  </div>
);

const Discovery = () => {
  const [matches, setMatches] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [matchData, discoverData] = await Promise.all([
          tasteApi.getMatches(12),
          tasteApi.getDiscoverSeed(),
        ]);
        if (mounted) {
          setMatches(matchData || []);
          setItems(discoverData || []);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Không thể tải Discovery.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-4 pb-16 pt-2 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-primary-500/15 via-purple-500/10 to-orange-500/10 p-6 ring-1 ring-primary-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-semibold text-primary-500">
              <Compass size={16} /> Discover theo Taste DNA
            </div>
            <h1 className="text-3xl font-black tracking-tight">Tìm người và nội dung cùng gu</h1>
            <p className="mt-2 max-w-2xl text-sm text-text-muted">Match Score được tính từ Music DNA, Book DNA, trọng số ưu tiên và xung đột sở thích.</p>
          </div>
          <Link to="/taste-settings" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-white hover:bg-primary-600">
            <Sparkles size={18} /> Chỉnh sở thích
          </Link>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{error}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-surface-color p-8 text-center shadow-sm dark:border-gray-800">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-500/20 border-t-primary-500" />
          <p className="font-semibold">Đang tính Match Score...</p>
        </div>
      ) : (
        <>
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Users size={22} className="text-primary-500" />
              <h2 className="text-xl font-black">Người dùng tương thích</h2>
            </div>
            {matches.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {matches.map(match => <MatchCard key={match.userId} match={match} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-surface-color p-6 text-sm text-text-muted dark:border-gray-800">
                Chưa có người dùng khác có Taste DNA để so khớp. Hãy thêm dữ liệu mẫu hoặc rủ bạn bè hoàn tất onboarding.
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={22} className="text-primary-500" />
              <h2 className="text-xl font-black">Seed Discover ban đầu</h2>
            </div>
            {items.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {items.map((item, index) => <DiscoverItem key={`${item.type}-${item.title}-${index}`} item={item} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-surface-color p-6 text-sm text-text-muted dark:border-gray-800">
                Chưa có Taste DNA. Hãy hoàn tất onboarding để khởi tạo Discover.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Discovery;
