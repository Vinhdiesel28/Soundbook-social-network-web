import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ALL_FRIENDS = [
  { id: 1, name: 'Hải Đăng', avatar: 'bg-blue-500', isOnline: true, match: 91 },
  { id: 2, name: 'Mai Linh', avatar: 'bg-pink-500', isOnline: true, match: 88 },
  { id: 3, name: 'Minh Tuấn', avatar: 'bg-green-500', isOnline: false, match: 76 },
  { id: 4, name: 'Bảo Trâm', avatar: 'bg-purple-500', isOnline: true, match: 82 },
  { id: 5, name: 'Thanh Sơn', avatar: 'bg-teal-500', isOnline: false, match: 65 },
  { id: 6, name: 'Hương Giang', avatar: 'bg-rose-500', isOnline: true, match: 79 },
  { id: 7, name: 'Tuấn Kiệt', avatar: 'bg-indigo-500', isOnline: false, match: 71 },
  { id: 8, name: 'Phương Ly', avatar: 'bg-yellow-500', isOnline: true, match: 94 },
  { id: 9, name: 'Quốc Anh', avatar: 'bg-orange-500', isOnline: false, match: 60 },
];

const FriendsPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = ALL_FRIENDS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/profile/${id}`}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{t('profile.friends', { defaultValue: 'Friends' })}</h1>
          <p className="text-xs text-text-muted">{ALL_FRIENDS.length} {t('profile.friends', { defaultValue: 'friends' }).toLowerCase()}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search_friends', { defaultValue: 'Search friends...' })}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-sm transition-all"
        />
      </div>

      {/* Friends */}
      <div className="bg-surface-color rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
        {filtered.length === 0 ? (
          <p className="text-center text-text-muted text-sm py-12">{t('common.no_results', { defaultValue: 'No friends found.' })}</p>
        ) : (
          filtered.map(friend => (
            <div key={friend.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full ${friend.avatar} border-2 border-surface-color shadow-sm`} />
                {friend.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-surface-color rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{friend.name}</p>
                <p className="text-xs text-primary-500 font-medium">{friend.match}% Match</p>
                <p className={`text-xs mt-0.5 ${friend.isOnline ? 'text-green-500' : 'text-text-muted'}`}>
                  {friend.isOnline
                    ? t('common.online', { defaultValue: 'Online' })
                    : t('common.offline', { defaultValue: 'Offline' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Link
                  to="/chat"
                  className="p-2 rounded-full text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  title={t('header.messages', { defaultValue: 'Message' })}
                >
                  <MessageCircle size={18} />
                </Link>
                <Link
                  to={`/profile/${friend.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 text-text-muted transition-colors"
                >
                  {t('profile.view', { defaultValue: 'View' })}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
