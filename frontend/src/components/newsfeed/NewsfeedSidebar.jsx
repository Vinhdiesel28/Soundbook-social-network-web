import React from 'react';
import { Plus, Music, Book } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const NewsfeedSidebar = ({ suggestions, trending }) => {
  const { t } = useLanguage();

  return (
    <div className="hidden lg:block lg:w-[30%] space-y-6">

      {/* Friend Suggestions */}
      <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-text-muted">{t('feed.friend_suggestions')}</h3>
        <div className="space-y-4">
          {suggestions.map(user => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${user.avatar}`}></div>
                <div>
                  <p className="font-semibold text-sm group-hover:underline cursor-pointer">{user.name}</p>
                  <p className="text-xs text-primary-500 font-medium">{user.match}% Match</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-text-muted hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-surface-color rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-text-muted">{t('feed.trending_now')}</h3>
        <div className="space-y-4">
          {trending.map((item, i) => (
            <div key={item.id} className="flex gap-3 group cursor-pointer">
              <div className="text-text-muted font-bold text-lg select-none w-4">{i + 1}</div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm group-hover:underline">{item.title}</p>
                  {item.type === 'music' ? <Music size={12} className="text-purple-500" /> : <Book size={12} className="text-orange-500" />}
                </div>
                <p className="text-xs text-text-muted">{item.subtitle}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-text-muted flex flex-wrap justify-center gap-x-3 gap-y-2 px-2">
        <a href="#" className="hover:underline">© 2026 Soundbook</a>
      </div>
    </div>
  );
};

export default NewsfeedSidebar;
